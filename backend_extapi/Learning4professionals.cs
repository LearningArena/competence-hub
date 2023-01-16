#nullable enable
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Web;
using Serilog;
using HtmlAgilityPack;



namespace Learning4professionals
{

	public class KmCategory
	{
		public string? name {get; set;}
		public IList<string>? keywords { get; set;}
	}

	public class L4PLinkMap
	{
		public IList<string>? categories { get; set; }
	}

	public static class Methods
	{
		private static readonly ILogger log = Log.ForContext(typeof(Methods));
		private const string KM_CATEGORY_FILE = "./misc/km-categories.json";
		private const string L4P_LINK_CATEGORY_FILE = "./misc/l4p-link-map.json";

		private static Dictionary<string, KmCategory>? kmCategories = null;
		private static void LoadCategories ()
		{
			// Read file containing KM category properties
			JsonSerializerOptions json_options = new JsonSerializerOptions();
			json_options.Converters.Add(new Arena.AutoNumberToStringConverter());
			kmCategories = new Dictionary<string, KmCategory>{};
			using (StreamReader reader = new StreamReader(KM_CATEGORY_FILE))
			{
				string json = reader.ReadToEnd();
				kmCategories = JsonSerializer.Deserialize<Dictionary<string, KmCategory>>(json);
			}
		}

		private static Dictionary<string, L4PLinkMap>? l4pLinkMaps = null;
		private static void LoadLinkMaps ()
		{
			// Read file containing L4P (course) link properties, e.g. relevant KM categories
			JsonSerializerOptions json_options = new JsonSerializerOptions();
			json_options.Converters.Add(new Arena.AutoNumberToStringConverter());
			l4pLinkMaps = new Dictionary<string, L4PLinkMap>{};
			using (StreamReader reader = new StreamReader(L4P_LINK_CATEGORY_FILE))
			{
				string json = reader.ReadToEnd();
				l4pLinkMaps = JsonSerializer.Deserialize<Dictionary<string, L4PLinkMap>>(json);
			}
		}

		public static Arena.Course request_parse1(HttpClient client, string url)
		{
			System.Globalization.CultureInfo cultureinfo = new System.Globalization.CultureInfo("sv-SE");
			Arena.Course course = new Arena.Course
			{
				link = url,
				external_stringid = url,
				record_status = Arena.Record_Status.GENERATED
			};
			Log.Information("Loading: " + url);
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, url);
			HttpResponseMessage r = client.SendAsync(req).Result;
			string response = r.Content.ReadAsStringAsync().Result;
			HtmlDocument doc = new HtmlDocument();
			doc.LoadHtml(response);
			
			// title
			// MatchCollection mc = Regex.Matches(response, @"header(?:\n|.)*<h1.*>((?:\n|.)*?)<\/h1");
			MatchCollection mc = Regex.Matches(response, @"title>((.|\n)*?)\|");
			if (mc.Count > 0) {
				try {
					course.title = mc[0].Groups[1].Captures[0].ToString().Trim(' ', '\n');
				} catch (Exception ex) { Log.Warning("Problem parsing title: " + ex.Message); }
			}

			// description
			String courseText = "";
			HtmlNodeCollection children = doc.DocumentNode.SelectNodes("//div[@class='col-12 col-md-6 col-lg-7 px-md-0' and contains(@style, 'min-height')]/*");
			int lastIndex = children.Count - 1;
			for (int childIx = 0; childIx <= lastIndex; childIx++)
			{
				if (childIx == lastIndex)
				{
					courseText += HttpUtility.HtmlDecode(children[childIx].InnerText);
				} else if (childIx > 1)
				{
					courseText += HttpUtility.HtmlDecode(children[childIx].InnerText) + "\n";
				}
			}
			course.description = courseText;

			// link = external_stringid
			// APPLY HERE / READ MORE link not unique!
			// mc = Regex.Matches(response, @"href=\""(.*?)\"".*\n.*(APPLY\sHERE|READ\sMORE)");
			// if (mc.Count > 0) {
			// 	course.link = mc[0].Groups[1].Captures[0].ToString();
			// 	course.external_stringid = course.link;
			// }

			// registration dates
			mc = Regex.Matches(response, @"<p.*Applications.*(\d\d\d\d-\d\d-\d\d)(?:(?:\n|.)*?)-.*?(\d\d\d\d-\d\d-\d\d)(?:(?:\n|.)*?)<\/p>");
			if (mc.Count > 0) {
				try {
					course.registration_start_date = DateTime.Parse(mc[0].Groups[1].Captures[0].ToString(), cultureinfo).ToUniversalTime();
					course.registration_end_date   = DateTime.Parse(mc[0].Groups[2].Captures[0].ToString(), cultureinfo).AddHours(24).ToUniversalTime();
				} catch (Exception ex) { Log.Warning("Problem parsing reg dates: " + ex.Message); }
			}

			string courseKey = "";
			string courseValue = "";
			foreach (HtmlNode cn in doc.DocumentNode.SelectNodes("//div[contains(@class, 'card-body')]//ul/li"))
			{
				try {
					courseKey = cn.SelectSingleNode(".//span[@class='pl-2']").InnerText.Trim();
					courseValue = cn.SelectSingleNode(".//div[@class='text-right']").InnerText.Trim();
				} catch (Exception ex) { Log.Warning("Problem parsing course link: " + ex.Message); }

				if (courseKey.Contains("CREDITS") && courseValue.Contains("HP"))
				{
					// hogskolapoang
					try
					{
						course.hogskolapoang = float.Parse(courseValue.Replace("HP", ""));
					} catch (Exception ex) { Log.Warning("Problem parsing hogskolapoang: " + ex.Message); }
					
				} else if (courseKey.Contains("INSTITUTION"))
				{
					// education_provider
					course.education_provider = courseValue;
				} else if (courseKey.Contains("START DATE"))
				{
					// start_date
					try
					{
						course.start_date = DateTime.Parse(courseValue, cultureinfo).ToUniversalTime();
					} catch (Exception ex) { Log.Warning("Problem parsing start_date: " + ex.Message); }
				} else if (courseKey.Contains("END DATE"))
				{
					// end_date
					try
					{
						course.end_date = DateTime.Parse(courseValue, cultureinfo).ToUniversalTime();
					} catch (Exception ex) { Log.Warning("Problem parsing end_date: " + ex.Message); }
				}
			}
			
			return course;
		}

		public static Arena.Course AddCategories(Arena.Course ac)
		{
			if (l4pLinkMaps is null || !l4pLinkMaps.ContainsKey(ac.link)) {
				Log.Warning($"No categorization for for course: {ac.link}, add to file {L4P_LINK_CATEGORY_FILE}");
				return ac;
			}

			IList<string>? course_categories = l4pLinkMaps[ac.link].categories;
			if (course_categories is null) {return ac;}

			// Add the categories found in the manual mapping file
			// NOTE: Arena.Course.category is currently just a string where a single course is only a string and
			// multiple courses needs to be be converted to a string which looks like: ["category1","category2"]
			if (course_categories.Count > 0)
			{
				if (course_categories.Count == 1)
				{
					ac.category = course_categories[0];
				}
				else
				{
					ac.category = $"[\"{string.Join("\",\"", course_categories)}\"]";
				}
			}

			return ac;
		}

		public static bool CheckRequirements(Arena.Course arenaCourse)
		{
			if (String.IsNullOrEmpty(arenaCourse.title)) {return false;}
			if (String.IsNullOrEmpty(arenaCourse.description)) {return false;}
			if (String.IsNullOrEmpty(arenaCourse.link)) {return false;}
			if (String.IsNullOrEmpty(arenaCourse.external_stringid)) {return false;}
			if (arenaCourse.registration_end_date != null && arenaCourse.registration_end_date.Value.Date < DateTime.Now.Date) {return false;}
			if (arenaCourse.start_date != null && arenaCourse.start_date < DateTime.Now) {return false;}
			if (arenaCourse.start_date != null && arenaCourse.end_date != null &&
			   (arenaCourse.end_date.Value - arenaCourse.start_date.Value).TotalDays > 270) {return false;}
			if (arenaCourse.hogskolapoang != null && arenaCourse.hogskolapoang > 12) {return false;} // fulltime = 1.5/week

			return true;
		}

		public static List<Arena.Course> request_parse(HttpClient client, Extapi.Parser method, string url)
		{
			LoadCategories();
			LoadLinkMaps();

			List<Arena.Course> courses = new List<Arena.Course>();
			int page = 1;
			while (true)
			{
				HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, url + "&page=" + page.ToString());
				HttpResponseMessage r = client.SendAsync(req).Result;
				string response = r.Content.ReadAsStringAsync().Result;

				MatchCollection mc = Regex.Matches(response, @"href=.*(/showCourse/[0-9]*).*card-title");
				if (mc.Count == 0) {
					if (page == 1) {
						Log.Error("Found no courses at " + url + "&page=1");
					}
					break;
				}
				foreach (Match match in mc)
				{
					String? path = null;
					try
					{
						if (match.Groups.Count > 1 && match.Groups[1].Captures.Count > 0 && match.Groups[1].Captures[0].ToString().Length > 0)
						{
							path = match.Groups[1].Captures[0].ToString();
						}
					} catch (Exception ex)
					{
						Log.Warning("Problems finding course paths: " + ex.Message);
					}
					if (path is not null)
					{
						Arena.Course course = request_parse1(client, "https://learning4professionals.se" + path);
						course = AddCategories(course);
						if (CheckRequirements(course))
						{
							course.import_source = method.ToString();
							courses.Add(course);
						} else
							Log.Information("... discarded.");
					}
				}
				page++;
			}
			return courses;
		}

	}
}