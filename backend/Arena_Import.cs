using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Text.RegularExpressions;
using Serilog;
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
						prop_changed = true;
					property.SetValue(existing_course, new_value);
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

		// Add course_user_edges to new courses
		// TODO: Add some default admin or don't add these edges at all?
		int ? user_id = null;
		try { user_id = context.current_user_id(); } catch { user_id = null; }
		if (user_id != null) {
			foreach (Course course in courses.ToList())
			{
				Course_User_Edge e = new Course_User_Edge
				{
					course_id = course.id,
					user_id = user_id.GetValueOrDefault(),
					relationship = Relationship.AUTHOR
				};
				context.course_user_edges.Add(e);
			}
			context.SaveChanges();
		}

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
					// eniro found org info
					//Organization neworg = result.Item2;
					// Already exists? Try searching by orgid or website, considered unique
					Organization existing_org = context.organizations.FirstOrDefault(t => t.orgid == neworg.orgid);
					if (existing_org is null)
						existing_org = context.organizations.FirstOrDefault(t => t.website == neworg.website);
					if (existing_org is null)
					{
						context.organizations.Add(neworg);
						context.SaveChanges();
						orgDbId = neworg.id;
						numNewOrgs++;
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
				// we found/created org, create edge
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
		context.SaveChanges();
		Log.Information($"Linked {numOCE.ToString()}/{courses.Count.ToString()} new courses to orgs, of which {numNewOrgs.ToString()} are newly generated.");
		return courses.Count;
	}


}
