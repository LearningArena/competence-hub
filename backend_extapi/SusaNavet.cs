#nullable enable
using System;
using System.Text.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Net.Http;
using System.Linq;
using Serilog;
using System.IO;
using System.Threading;
using System.Text.RegularExpressions;

namespace SusaNavet
{

	public class Link
	{
		public string? rel { get; set; }
		public string? href { get; set; }
	}

	public class String
	{
		public string? lang { get; set; }
		public string? content { get; set; }
	}

	public class RecommendedPriorKnowledge
	{
		[JsonPropertyName("string")]
		public IList<String>? string_list { get; set; }
	}

	public class Configuration
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class Subject
	{
			public int id { get; set; }
            public string? name { get; set; }
            public string? nameEn { get; set; }
            public string? type { get; set; }
            public string? code { get; set; }
            public IList<Link>? links { get; set; }
	}

	public class Description
	{
		
		[JsonPropertyName("string")]
		public IList<String>? string_list { get; set; }
	}



	public class Title
	{
		
		[JsonPropertyName("string")]
		public IList<String>? string_list { get; set; }
	}

	public class EligibleForStudentAid
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class Form
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class System
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class Credits
	{
		public IList<System>? system { get; set; }
		public IList<double>? credits { get; set; }
	}

	public class EducationLevel
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class Extension
	{
		public IList<string>? focusIdentifier { get; set; }
		public IList<string>? id { get; set; }
		public string? type { get; set; }
	}



	public class Degree
	{
		
		[JsonPropertyName("string")]
		public IList<String>? string_list { get; set; }
	}



	public class EligibilityDescription
	{
		
		[JsonPropertyName("string")]
		public IList<String>? string_list { get; set; }
	}

	public class Eligibility
	{
		public IList<EligibilityDescription>? eligibilityDescription { get; set; }
	}

	public class Unit
	{
		public string? code { get; set; }
		public string? type { get; set; }
	}

	public class Extent
	{
		public IList<Unit>? unit { get; set; }
		public int length { get; set; }
	}

	public class Url
	{
		public string? lang { get; set; }
		public string? content { get; set; }
	}

	public class UrlList
	{
		[JsonPropertyName("url")]
		public IList<Url>? url_list { get; set; }
	}

	public class Execution
    {
        public int condition { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }

	public class PaceOfStudy
    {
        public int percentage { get; set; }
    }

	public class Application
    {
        public UrlList? url { get; set; }
    }

	public class Location
    {
        public string? country { get; set; }
        public string? town { get; set; }
        public string? streetAddress { get; set; }
        public string? postCode { get; set; }
        public string? position { get; set; }
        public string? municipalityCode { get; set; }
    }

	public class Name
    {
		[JsonPropertyName("string")]
        public IList<String>? string_list { get; set; }
    }

	public class ProviderType
    {
        public string? code { get; set; }
        public string? type { get; set; }
    }

	public class ResponsibleBody
    {
        public Name? name { get; set; }
        public ProviderType? type { get; set; }
    }
	
	public class Function
    {
		[JsonPropertyName("string")]
        public IList<String>? string_list { get; set; }
    }

	public class Phone
    {
        public string? number { get; set; }
        public Function? function { get; set; }
    }

	public class ContactAddress
    {
        public string? country { get; set; }
        public string? town { get; set; }
        public string? organization { get; set; }
        public string? postCode { get; set; }
    }

    public class VisitAddress
    {
        public string? country { get; set; }
        public string? town { get; set; }
        public string? streetAddress { get; set; }
        public string? postCode { get; set; }
        public string? position { get; set; }
        public string? municipalityCode { get; set; }
    }

	public class EducationEvent
	{
		public string? identifier { get; set; }
		public Execution? execution { get; set; }
		public DateTime expires { get; set; }
		public bool isCancelled { get; set; }
		public string? education { get; set; }
		public DateTime lastEdited { get; set; }
		public Title? title { get; set; }
		public PaceOfStudy? paceOfStudy { get; set; }
		public UrlList? url { get; set; }
		public Application? application { get; set; }
		public IList<string>? languageOfInstruction { get; set; }
		public IList<string>? provider { get; set; }
		public IList<Location>? location { get; set; }
	}

	public class EducationInfo
	{
		public string? identifier { get; set; }
		public bool resultIsDegree { get; set; }
		public DateTime expires { get; set; }
		public RecommendedPriorKnowledge? recommendedPriorKnowledge { get; set; }
		public string? code { get; set; }
		public Configuration? configuration { get; set; }
		public IList<Subject>? subject { get; set; }
		public Description? description { get; set; }
		public DateTime lastEdited { get; set; }
		public Title? title { get; set; }
		public EligibleForStudentAid? eligibleForStudentAid { get; set; }
		public Form? form { get; set; }
		public Credits? credits { get; set; }
		public IList<EducationLevel>? educationLevel { get; set; }
		public IList<Extension>? extension { get; set; }
		public IList<Degree>? degree { get; set; }
		public Eligibility? eligibility { get; set; }
		public Extent? extent { get; set; }
		public UrlList? url { get; set; }
		public bool? isVocational { get; set; }
	}

	public class EducationProvider
    {
        public ResponsibleBody? responsibleBody { get; set; }
        public string? identifier { get; set; }
        public string? expires { get; set; }
        public Description? description { get; set; }
        public string? lastEdited { get; set; }
		public IList<Url>? url { get; set; }
        public string? emailAddress { get; set; }
        public IList<Phone>? phone { get; set; }
        public Name? name { get; set; }
        public ContactAddress? contactAddress { get; set; }
        public VisitAddress? visitAddress { get; set; }
    }


	public class InnerContent
	{
		public EducationEvent? educationEvent { get; set; }
		public EducationInfo? educationInfo { get; set; }
		public EducationProvider? educationProvider { get; set; }
	}

	public class Content
	{
		public InnerContent? content { get; set; }
		public IList<Link>? links { get; set; }
	}

	public class Page
	{
		public int size { get; set; }
		public int totalElements { get; set; }
		public int totalPages { get; set; }
		public int number { get; set; }
	}

	public class Documents
	{
		public IList<Link>? links { get; set; }
		[JsonPropertyName("content")]
		public IList<Content>? content_list { get; set; }
		public Page? page { get; set; }
	}

	public class Category
	{
		public string? slug { get; set; }
		public string? name { get; set; }
		public IList<string>? keywords { get; set; }
		public IList<Subject> subjects { get; set; } = new List<Subject>{};
	}

	public class Susa
	{
		public static int max_course_length = 270; // In days
		public static int num_courses_per_page = 50;
		public static string organisation_forms = "folkhögskola,högskoleutbildning,kvalificerad yrkesutbildning,vuxenutbildning,yrkeshögskoleutbildning";
		private static readonly ILogger log = Log.ForContext(typeof(Susa));

		public static List<Arena.Course> request_parse(HttpClient client, string url)
		{
			List<Arena.Course> courses = new List<Arena.Course>{};

			string susa_endpoint = $"{url}/events?configuration=kurs&startsAfter={DateTime.Now.Date.ToString("yyyy-MM-dd")}";
			susa_endpoint += $"&size={num_courses_per_page}";
			susa_endpoint += $"&organisationForm={organisation_forms}";

			string result = client.GetStringAsync(susa_endpoint).Result;

			JsonSerializerOptions json_options = new JsonSerializerOptions();
			json_options.Converters.Add(new Arena.AutoNumberToStringConverter());
			SusaNavet.Documents? events = JsonSerializer.Deserialize<SusaNavet.Documents>(result, json_options);
			SusaNavet.Documents? infos = null;
			SusaNavet.Documents? providers = null;

			// Read file containing mapping between or categories and SUSA-navets subjects
			IList<Category>? categories = new List<Category>{};
			using (StreamReader r = new StreamReader("./misc/susa-subject-category-map.json"))
			{
				string json = r.ReadToEnd();
				categories = JsonSerializer.Deserialize<IList<Category>>(json, json_options);
			}

			int sleep_length = 1000; // Time to sleep after each request (ms)
			int pages = events?.page?.totalPages ?? 0;
			int page = 1;
			do
			{
				log.Information($"SUSA_NAVET request and parse page {page} of {pages}");
				HashSet<string> info_ids = new HashSet<string>();
				HashSet<string> provider_ids = new HashSet<string>();

				if (events?.content_list is null) { return courses; }

				//Filter out all incomplete courses and get info and provider ids
				foreach (Content doc in events.content_list.ToList())
				{
					if (doc.content?.educationEvent is null) { return courses; }
					// Ensure the course has a url
					if (doc.content.educationEvent.url?.url_list?.Count <= 0 && doc.content.educationEvent.application?.url?.url_list?.Count != 2)
					{
						events.content_list.Remove(doc);
						continue;
					}
					// Ensure valid start and end dates
					if (doc.content.educationEvent.execution?.end is null || doc.content.educationEvent.execution?.start is null)
					{
						events.content_list.Remove(doc);
						continue;
					}
					if (doc.content.educationEvent.execution.end < doc.content.educationEvent.execution.start || doc.content.educationEvent.execution.start < DateTime.Now)
					{
						events.content_list.Remove(doc);
						continue;
					}
					// Only pick out short courses
					int course_length_days = (doc.content.educationEvent.execution.end - doc.content.educationEvent.execution.start).Days;
					if (course_length_days > max_course_length)
					{
						events.content_list.Remove(doc);
						continue;
					}

					// Save info and provider ids
					if (doc.content.educationEvent.education is not null)
					{
						info_ids.Add(doc.content.educationEvent.education);
					}
					if (doc.content.educationEvent.provider is not null)
					{
						provider_ids.Add(doc.content.educationEvent.provider[0]);
					}
				}

				// Get infos and providers
				if (info_ids.Count == 0)
				{
					log.Information($"No info ids found for page {page}!");
					infos = null;
				}
				else
				{
					string info_string = $"{url}/infos?configuration=kurs&id={string.Join(",", info_ids)}&size={num_courses_per_page}";
					log.Information($"Requesting infos with url: {info_string}");
					result = client.GetStringAsync(info_string).Result;
					log.Information($"Sleeping for {sleep_length / 1000} seconds.");
					Thread.Sleep(sleep_length);
					infos = JsonSerializer.Deserialize<SusaNavet.Documents>(result, json_options);
				}

				if (provider_ids.Count == 0)
				{
					log.Information($"No provider ids found for page {page}!");
					providers = null;
				}
				else
				{
					string provider_string = $"{url}/providers?configuration=kurs&id={string.Join(",", provider_ids)}&size={num_courses_per_page}";
					log.Information($"Requesting providers with url: {provider_string}");
					result = client.GetStringAsync(provider_string).Result;
					log.Information($"Sleeping for {sleep_length / 1000} seconds.");
					Thread.Sleep(sleep_length);
					providers = JsonSerializer.Deserialize<SusaNavet.Documents>(result, json_options);
				}

				foreach (Content doc in events.content_list)
				{
					if (doc.content?.educationEvent is null) { return courses; }

					// Get the info document for the course
					Content? info = infos?.content_list?.Where(d => d.content.educationInfo.identifier.ToString() == doc.content?.educationEvent?.education?.ToString()).FirstOrDefault();
					if (info?.content?.educationInfo?.description?.string_list?[0].content is null) { continue; } // Don't continue if the course has no description

					// Get the provider document for the course
					Content? provider = providers?.content_list?.Where(d => d.content.educationProvider.identifier.ToString() == doc.content?.educationEvent?.provider?[0].ToString()).FirstOrDefault();

					Arena.Course course = new Arena.Course
					{
						external_stringid = doc.content.educationEvent.identifier,
						title = doc.content.educationEvent.title?.string_list?[0].content,
						record_status = Arena.Record_Status.GENERATED,
						start_date = doc.content.educationEvent.execution?.start.ToUniversalTime(),
						end_date = doc.content.educationEvent.execution?.end.ToUniversalTime(),
						registration_end_date = doc.content.educationEvent.expires.ToUniversalTime(),
						time_created = doc.content.educationEvent.lastEdited.ToUniversalTime(),
						time_modified = doc.content.educationEvent.lastEdited.ToUniversalTime()
					};

					// If the course is canceled, it is archived in our database
					if (doc.content.educationEvent.isCancelled)
					{
						course.record_status = Arena.Record_Status.ARCHIVED;
					}

					// Add content from info document to course
					addInfo(ref course, info, categories);

					// Discard the course if there is no title or description after going through event and info
					if (course.title is null || course.description is null) { continue; }

					// Add content from provider document to course
					addProvider(ref course, provider);

					// Discard the course if there is no education provider
					if (course.education_provider is null) { continue; }

					if (doc.content.educationEvent.application?.url is not null)
					{
						course.link = doc.content.educationEvent.application.url.url_list?.LastOrDefault()?.content;
					}
					else
					{
						course.link = doc.content.educationEvent.url?.url_list?[0].content;
					}
					// Discard course if there is no url after last step
					if (course.link is null) { continue; }

					if (doc.content.educationEvent.paceOfStudy?.percentage is not null)
					{
						course.studypace = $"{doc.content.educationEvent.paceOfStudy.percentage.ToString()}%";
					}

					course.city = doc.content.educationEvent.location?[0].town;

					if (doc.content.educationEvent.languageOfInstruction?[0] is not null)
					{
						string? tag = IETF_Language_Tags_BCP_47.FirstCommonTagFromName(doc.content.educationEvent.languageOfInstruction?[0], "en");
						if (tag is not null)
							course.language = tag;
					}

					Arena.Course? duplicate = courses.Where(previous => 
							previous.title == course.title && 
							previous.education_provider == course.education_provider &&
							previous.city == course.city &&
							previous.description == course.description &&
							previous.start_date == course.start_date &&
							previous.end_date == course.end_date
						).FirstOrDefault();
					
					MatchCollection mc = Regex.Matches(course.description, @"<.+?>");
					if (mc.Count > 0) {
						course.description = Extapi.Externaldata.HtmlToPrettyString(course.description);
					}

					if (duplicate is null)
					{
						courses.Add(course);
						continue;
					}

					if (course.time_modified > duplicate.time_modified)
					{
						courses.Remove(duplicate);
						courses.Add(course);
					}

				}

				page++;

				if (page <= pages)
				{
					string event_string = $"{susa_endpoint}&page={page}";
					log.Information($"Requesting new events with url: {event_string}");
					result = client.GetStringAsync(event_string).Result;
					log.Information($"Sleeping for {sleep_length / 1000} seconds.");
					Thread.Sleep(sleep_length);
					events = JsonSerializer.Deserialize<SusaNavet.Documents>(result, json_options);
				}
			} while (page <= pages);

			return courses;
		}

		private static void addInfo(ref Arena.Course course, Content? info, IList<Category>? categories)
		{
			if (info?.content?.educationInfo is null) { return; }

			// Don't continue if the course has no description
			if (info.content.educationInfo.description?.string_list?[0].content is null) { return; }

			// If the course currently has no title, add one from info if it exists, otherwise return
			if (course.title is null)
			{
				if (info?.content.educationInfo.title?.string_list?[0].content is not null)
				{
					course.title = info.content.educationInfo.title.string_list[0].content;
				}
				else return;
			}

			course.description = info.content.educationInfo.description.string_list[0].content;

			if (info.content.educationInfo.credits?.system?[0].code == "hp")
			{
				course.credits = (float?)info.content.educationInfo.credits?.credits?[0];
				course.hogskolapoang = (float?)info.content.educationInfo.credits?.credits?[0];
			}
			else if (info.content.educationInfo.credits?.system?[0].code == "yh")
			{
				course.yrkeshogskolepoang = (float?)info.content.educationInfo.credits?.credits?[0];
			}

			course.prerequisite = info.content.educationInfo.eligibility?.eligibilityDescription?[0].string_list?[0].content;

			if (course.prerequisite is null)
			{
				course.prerequisite = info.content.educationInfo.recommendedPriorKnowledge?.string_list?[0].content;
			}

			if (info.content.educationInfo.educationLevel?[0].code == "ISCED_3A")
			{
				course.level = 0;
			}
			else if (info.content.educationInfo.educationLevel?[0].code == "ISCED_4C")
			{
				course.level = 1;
			}

			if (info.content.educationInfo.form?.code == "högskoleutbildning")
			{
				course.level = 2;
			}

			addCategories(ref course, info.content.educationInfo.subject, categories);
		}

		private static void addProvider(ref Arena.Course course, Content? provider)
		{
			if (provider?.content?.educationProvider is null) { return; }

			course.education_provider = provider.content.educationProvider.name?.string_list?[0].content;

			course.email_of_contact_person = provider.content.educationProvider.emailAddress;
		}

		private static void addCategories(ref Arena.Course course, IList<Subject>? subjects, IList<Category>? categories)
		{
			if (subjects is null || categories is null) { return; }

			List<string> course_categories = new List<string>{};

			foreach (Subject subject in subjects)
			{
				// NOTE: "code" format differs between {base_url}/subjects and subjects in educationInfo,
				// therefore only the first letter of the subject code is used for comparison (Y, U or F)
				var matched_categories = categories
					.Where(c => c.subjects
						.Any(s => s.code == subject.code
						&& s.type?[0] == subject.type?[0]
						)
					);
				foreach (Category matched_category in matched_categories)
				{
					if (matched_category.slug is null) { continue; }
					if (course_categories.Any(c => c == matched_category.slug)) { continue; }
					course_categories.Add(matched_category.slug);
				}
			}
			// Add the categories found from the educationInfo subjects.
			// NOTE: Arena.Course.category is currently just a string where a single course is only a string and
			// multiple courses needs to be be converted to a string which looks like: ["category1","category2"]
			if (course_categories.Count() > 0)
			{
				if (course_categories.Count() == 1)
				{
					course.category = course_categories[0];
				}
				else
				{
					course.category = $"[\"{string.Join("\",\"", course_categories)}\"]";
				}
			}
		}


	}



}
