using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Text.RegularExpressions;
using Serilog;
using System.IO;

namespace Arena;


public static class Arena_Import
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Import));

	private static string DomainFromUrl(string url)
		{
			Match match = Regex.Match(url, @"(http:|https:)\/\/(.*?)(\/|$)", RegexOptions.IgnoreCase);
			if (match.Success && match.Groups.Count > 2)
				return match.Groups[2].Value;
			else
				return null;
		}

	private static void PublishCourses(Arena_Context context, List<Course> courses)
	{
		// Currently publishing all generated courses.
		// Do we want to do additional filtering here before publishing?
		foreach (Course course in courses.ToList())
		{
			if (course.record_status == Record_Status.GENERATED)
			{
				course.record_status = Record_Status.APPROVED;
				context.courses.Update(course);
			}
		}
		context.SaveChanges();
	}

	private static List<string> ParseCategories(Course course)
	{
		List<string> categories = new List<string>();
		if (course.category == null)
		{
			return categories;
		}
		if (!course.category.Contains(","))
		{
			categories.Add(course.category);
		}
		else if (course.category.Contains(","))
		{
			categories = course.category.Split(',').Select(s => s.Trim( new Char[] { ' ', '"', '[', ']' } )).ToList();
		}
		return categories;
	}

	private static void AddImages(Arena_Context context, List<Course> courses)
	{
		foreach (Course course in courses.Where(c => c.image_feature == null))
		{
			var random = new Random();
			List<string> categories = ParseCategories(course);
			List<string> image_paths = new List<string>();
			// Use specific category folder for categorized courses
			if (categories.Count() > 0)
			{
				string category = categories[random.Next(categories.Count)];
				image_paths = new List<string>(Directory.GetFiles($"../media/category-images/{category}/"));
			}
			// If there are no categories, use all images
			if (categories.Count() == 0)
			{
				image_paths = new List<string>(Directory.GetFiles($"../media/category-images/", "*.*", SearchOption.AllDirectories));
			}
			string image_path = image_paths[random.Next(image_paths.Count)];
			course.image_feature = image_path.Substring(2);
			context.courses.Update(course);
		}
		context.SaveChanges();
	}
	
	public static int external_import(Arena_Context context, Extapi.Parser method)
	{
		List<Course> courses = Extapi.Externaldata.request_parse(Arena.client, method, Extapi.Endpoints.urls[method]);
		Log.Information($"Parsed {courses.Count.ToString()} courses from {Extapi.Endpoints.urls[method]}.");
		DateTime now = DateTime.Now.ToUniversalTime();
		foreach (Course course in courses.ToList())
		{
			Course existing_course = context.courses.FirstOrDefault(t => t.external_stringid == course.external_stringid);
			if (existing_course is null)
			{
				if (course.time_modified == DateTime.MinValue)
					course.time_modified = now;
				if (course.time_created == DateTime.MinValue)
					course.time_created = now;
				context.courses.Add(course);
			}
			else
			{
				string[] excluded_properties = {"id", "organization_id", "time_created", "time_modified", "record_status"};
				bool prop_changed = false;
				foreach (PropertyInfo property in typeof(Course).GetProperties())
				{
					if (excluded_properties.Contains(property.Name)) { continue; }
					var new_value = property.GetValue(course);
					if (new_value != null && (property.GetValue(existing_course) == null || !property.GetValue(existing_course).Equals(new_value)))
					{
						prop_changed = true;
						property.SetValue(existing_course, new_value);
					}
				}
				if (course.record_status == Record_Status.ARCHIVED)
				{
					// currently, imported susanavet cancelled/ARCHIVED courses overwrite record_status
					existing_course.record_status = course.record_status;
					prop_changed = true;
				}
				if (prop_changed)
				{
					existing_course.time_modified = now;
					context.courses.Update(existing_course);
				}
				courses.Remove(course);
			}
		}
		context.SaveChanges();

		// Add course_user_edges to new courses, connected to default admin user
		foreach (Course course in courses.ToList())
		{
			Course_User_Edge e = new Course_User_Edge
			{
				course_id = course.id,
				user_id = Arena.DEFAULT_ADMIN_ID,
				relationship = Relationship.AUTHOR
			};
			context.course_user_edges.Add(e);
		}
		context.SaveChanges();

		// Add organization_course_edges to new courses
		Dictionary<string, int> domainOrgidCache =  new Dictionary<string, int>();
		//Eniro_Query q = new Eniro_Query();
		int NO_ORG = -1;
		int numOCE = 0;
		int numNewOrgs = 0;
		foreach (Course course in courses.ToList())
		{
			string domain = DomainFromUrl(course.link);
			if (domain == null) continue;
			int orgDbId = NO_ORG;
			if (domainOrgidCache.TryGetValue(domain, out int existing_id))
			{
				// in cache
				orgDbId = existing_id;
			}
			else
			{
				// not in cache
				Organization neworg = new Organization{};
				Primitive_Result result = Primitive_Result.REQUEST_COOLDOWN;
				do
				{
					result = Arena_Eniro.OrgFromSearchstring(context, domain, neworg);
					Thread.Sleep(Arena_Eniro.RETRY_MS);
				}
				while(result == Primitive_Result.REQUEST_COOLDOWN);
				if (result == Primitive_Result.SUCCESS)
				{
					// Eniro found org info
					// Already exists in arena? Try searching by orgid or website, considered unique
					Organization existing_org = context.organizations.FirstOrDefault(t => t.orgid == neworg.orgid);
					if (existing_org is null)
						existing_org = context.organizations.FirstOrDefault(t => t.website == neworg.website);
					if (existing_org is null)
					{
						// couldn't find, add
						context.organizations.Add(neworg);
						context.SaveChanges();
						orgDbId = neworg.id;
						numNewOrgs++;
						// also add user edge to new org
						Organization_User_Edge edge = new Organization_User_Edge
						{
							organization_id = orgDbId,
							user_id = Arena.DEFAULT_ADMIN_ID,
							relationship = Relationship.AUTHOR
						};
						context.organization_user_edges.Add(edge);
					}
					else
						orgDbId = existing_org.id;
					domainOrgidCache.Add(domain, orgDbId);
				}
				else
				{
					// eniro did not find org info
					orgDbId = NO_ORG;
					domainOrgidCache.Add(domain, orgDbId);
				}
			}
			if (orgDbId != NO_ORG)
			{
				// we found/created org, create course edge
				Organization_Course_Edge e = new Organization_Course_Edge
				{
					course_id = course.id,
					organization_id = orgDbId,
					relationship = Relationship.AUTHOR
				};
				context.organization_course_edges.Add(e);
				numOCE++;
			}
		}
		AddImages(context, courses);
		PublishCourses(context, courses);
		context.SaveChanges();
		Log.Information($"Linked {numOCE.ToString()}/{courses.Count.ToString()} new courses to orgs, of which {numNewOrgs.ToString()} are newly generated.");
		return courses.Count;
	}


}
