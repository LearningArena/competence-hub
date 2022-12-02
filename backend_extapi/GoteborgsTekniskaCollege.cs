#nullable enable
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using Serilog;
using HtmlAgilityPack;
using Schema.NET;



namespace GoteborgsTekniskaCollege
{

	public class KmCategory
	{
		public string? name {get; set;}
		public IList<string>? keywords { get; set;}
	}

	public class GTCLinkMap
	{
		public IList<string>? categories { get; set; }
	}
	
	public static class Methods
	{

		private static readonly ILogger log = Log.ForContext(typeof(Methods));
		private const string KM_CATEGORY_FILE = "./misc/km-categories.json";
		private const string GTC_LINK_CATEGORY_FILE = "./misc/gtc-link-map.json";

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

		private static Dictionary<string, GTCLinkMap>? gtcLinkMaps = null;
		private static void LoadLinkMaps ()
		{
			// Read file containing GTC (course) link properties, e.g. relevant KM categories
			JsonSerializerOptions json_options = new JsonSerializerOptions();
			json_options.Converters.Add(new Arena.AutoNumberToStringConverter());
			gtcLinkMaps = new Dictionary<string, GTCLinkMap>{};
			using (StreamReader reader = new StreamReader(GTC_LINK_CATEGORY_FILE))
			{
				string json = reader.ReadToEnd();
				gtcLinkMaps = JsonSerializer.Deserialize<Dictionary<string, GTCLinkMap>>(json);
			}
		}

		public static Arena.Course? ToArena(Course schemaCourse)
		{
			// Absolute minimum requirement - link
			if (!schemaCourse.TryGetValue("url", out var url)) { return null; }
			
			Arena.Course arenaCourse = new Arena.Course
			{
				link = ((OneOrMany<System.Uri>)url).First().ToString(),
				record_status = Arena.Record_Status.GENERATED
			};

			arenaCourse.external_stringid = arenaCourse.link; // required above

			try {
				if (schemaCourse.TryGetValue("name", out var name)) { arenaCourse.title = ((OneOrMany<System.String>)name).First(); }
			} catch {}

			try {
				if (schemaCourse.TryGetValue("description", out var description)) { arenaCourse.description = ((OneOrMany<System.String>)description).First(); }
			} catch {}

			IValues prop;
			try {
				if (schemaCourse.TryGetValue("numberOfCredits", out prop)) {
					var values = (Values<Int32, IStructuredValue>)prop;
					if (values.HasValue1) { arenaCourse.credits = values.Value1.First();}
				}
			} catch {}

			try {
				if (schemaCourse.TryGetValue("inLanguage", out prop))
				{
					var values = (Values<ILanguage,System.String>)prop;
					IThing? thing = null;
					String? lang = null;
					if (values.HasValue1) { thing = values.Value1.First(); } else if (values.HasValue2) { lang = values.Value2.First(); }
					if (thing is not null)
					{
						arenaCourse.language = thing.Name.First().ToString();
					} else if (lang is not null)
					{
						arenaCourse.language = lang.ToString();
					}
				}
			} catch {}

			try {
				if (schemaCourse.TryGetValue("copyrightHolder", out prop)) {
					var values = (Values<IOrganization, IPerson>)prop;
					IThing? thing = null;
					if (values.HasValue1) { thing = values.Value1.First(); } else if (values.HasValue2) { thing = values.Value2.First(); }
					if (thing is not null)
					{
						arenaCourse.education_provider = thing.Name.First().ToString();
					}
				}
			} catch {}

			try {
				if (schemaCourse.TryGetValue("image", out prop)) {
					var values = (Values<IImageObject, Uri>)prop;
					IImageObject? img = null;
					Uri? uri = null;
					if (values.HasValue1) { img = values.Value1.First(); } else if (values.HasValue2) { uri = values.Value2.First(); }
					if (img is not null)
					{
						arenaCourse.image_feature = img.Url.First().ToString();
					} else if (uri is not null)
					{
						arenaCourse.image_feature = uri.ToString();
					}
				}
			} catch {}

			try {
				if (schemaCourse.TryGetValue("dateModified", out prop))
				{
					var values = (Values<System.Int32?,System.DateTime?,System.DateTimeOffset?>)prop;
					if (values.HasValue2)
					{
						DateTime? dt = values.Value2.First();
						if (dt is not null) {
							arenaCourse.time_modified = dt.Value.ToUniversalTime();
						}
					} else if (values.HasValue3)
					{
						DateTimeOffset? dto = values.Value3.First();
						if (dto is not null) {
							arenaCourse.time_modified = dto.Value.DateTime.ToUniversalTime();
						}
					}
				}
			} catch {}
			
			
			try {
				if (schemaCourse.TryGetValue("datePublished", out prop))
				{
					var values = (Values<System.Int32?,System.DateTime?,System.DateTimeOffset?>)prop;
					if (values.HasValue2)
					{
						DateTime? dt = values.Value2.First();
						if (dt is not null) {
							arenaCourse.time_created = dt.Value.ToUniversalTime();
						}
					} else if (values.HasValue3)
					{
						DateTimeOffset? dto = values.Value3.First();
						if (dto is not null) {
							arenaCourse.time_created = dto.Value.DateTime.ToUniversalTime();
						}
					}
				}
			} catch {}
			
			return arenaCourse;
		}

		public static Course? ResolveGraph(JsonElement graph)
		{
			Course? c = null;
			var graphArray = graph.EnumerateArray();
			JsonElement el;
			while(graphArray.MoveNext())
			{
				if (graphArray.Current.TryGetProperty("@type", out el) && (el.GetString() == "Course" || el.GetString() == "WebPage"))
				{
					// Force WebPage to Course and deserialize
					String courseStr = graphArray.Current.ToString();
					if (el.GetString() == "WebPage") { courseStr = courseStr.Replace("\"WebPage\"", "\"Course\""); }
					c = Schema.NET.SchemaSerializer.DeserializeObject<Course>(courseStr);
				}
				else if (graphArray.Current.TryGetProperty("@id", out var nodeId))
				{
					// Other graph node
					if (graphArray.Current.TryGetProperty("@type", out el))
					{
						// TODO: Generalise for all types
						// if (Type.GetType("Schema.NET.OrganizationAndPlace, Schema.NET").IsAssignableFrom(Type.GetType("Schema.NET."+el.GetString()+", "+"Schema.NET")) ||
						// 	Type.GetType("Schema.NET.Person, Schema.NET").IsAssignableFrom(Type.GetType("Schema.NET."+el.GetString()+", "+"Schema.NET")))
						Type? t = Type.GetType("Schema.NET.LocalBusiness, Schema.NET");
						if (t is not null && t.Equals(Type.GetType("Schema.NET."+el.GetString()+", "+"Schema.NET")))
						{
							LocalBusiness? lb = Schema.NET.SchemaSerializer.DeserializeObject<LocalBusiness>(graphArray.Current.ToString());
							if (c is not null) {
								JsonDocument jsonCourse = JsonDocument.Parse(c.ToString());
								foreach (JsonProperty courseProp in jsonCourse.RootElement.EnumerateObject())
								{
									try
									{
										JsonElement coursePropVal = JsonDocument.Parse(courseProp.Value.ToString()).RootElement;
										if (lb is not null && coursePropVal.TryGetProperty("@id", out var courseId) && courseId.ToString().Equals(nodeId.ToString()))
										{
											// Console.WriteLine("\tFound linked course node {0}, replacing ...", courseId.ToString());
											Schema.NET.IPerson p = new Schema.NET.Person();
											var localBusiness = new Values<IOrganization, IPerson>(lb, p);
											bool set_success = c.TrySetValue(courseProp.Name.ToString(), localBusiness);
										}
									} catch {
										// Console.WriteLine("whyisthishappeningtome:", ex.ToString());
									}
								}
							}
						} else {
							Log.Information("Node with id {0}, not castable Schema.NET type", nodeId.ToString());
						}
					}
				}
			}
			return c;
		}

		public static Arena.Course AddScrapedData(String htmlStr, Arena.Course ac)
		{
			System.Globalization.CultureInfo cultureinfo = new System.Globalization.CultureInfo("sv-SE");

			// start_date, potentially available on the form "19 sep"
			MatchCollection mc = Regex.Matches(htmlStr, @"<h3>Utbildning.?start[\s\S]*?<p>([A-Za-z0-9 ]*)<\/p>");
			if (mc.Count == 0) { mc = Regex.Matches(htmlStr, @"<h3>Start[\s\S]*?<p>([A-Za-z0-9 ]*)<\/p>"); }
			if (mc.Count > 0) {
				try
				{
					DateTime nextStart = DateTime.Parse(mc[0].Groups[1].Captures[0].ToString(), cultureinfo);
					if (DateTime.Now > nextStart) { nextStart.AddYears(1); }
					ac.start_date = nextStart.ToUniversalTime();
				} catch
				{
					// Log.Warning("Problem parsing startDate: " + ex.Message);
				}
			} else {
				// Log.Information("Found no startDate");
			}

			// registration_end_date, potentially available on the form "19 sep"
			mc = Regex.Matches(htmlStr, @"<h3>Ansök senast[\s\S]*?<p>([A-Za-z0-9 ]*)<\/p>");
			if (mc.Count == 0) { mc = Regex.Matches(htmlStr, @"<h3>Anmäl senast[\s\S]*?<p>([A-Za-z0-9 ]*)<\/p>"); }
			if (mc.Count == 0) { mc = Regex.Matches(htmlStr, @"<h2>Ansök senast *([A-Za-z0-9 ]*)<\/h2>"); }
			if (mc.Count > 0) {
				try
				{
					DateTime nextReg = DateTime.Parse(mc[0].Groups[1].Captures[0].ToString(), cultureinfo).AddHours(24);
					if (DateTime.Now > nextReg) { nextReg.AddYears(1); }
					ac.registration_end_date = nextReg.ToUniversalTime();
				} catch
				{
					// Log.Warning("Problem parsing registration_end_date: " + ex.Message);
				}
			} else {
				// Log.Information("Found no registration_end_date");
			}


			// yrkeshogskolepoang, potentially available
			mc = Regex.Matches(htmlStr, @"<h3>Antal YH-poäng[\s\S]*?<p>([A-Za-z0-9 ]*)<\/p>");
			if (mc.Count > 0) {
				try
				{
					int yhPoints = Int32.Parse(mc[0].Groups[1].Captures[0].ToString());
					ac.yrkeshogskolepoang = yhPoints;
				} catch
				{
					// Log.Warning("Problem parsing yrkeshogskolepoang: " + ex.Message);
				}
			} else {
				// Log.Information("Found no yrkeshogskolepoang");
			}
			
			return ac;
		}

		public static Arena.Course AddCategories(Arena.Course ac)
		{
			if (gtcLinkMaps is null || !gtcLinkMaps.ContainsKey(ac.link)) {return ac;}

			IList<string>? course_categories = gtcLinkMaps[ac.link].categories;
			if (course_categories is null) {return ac;}

			// Add the categories found in the manual mapping file
			// NOTE: Arena.Course.category is currently just a string where a single course is only a string and
			// multiple courses needs to be be converted to a string which looks like: ["category1","category2"]
			if (course_categories.Count() > 0)
			{
				if (course_categories.Count() == 1)
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
			if (arenaCourse.registration_end_date != null && arenaCourse.registration_end_date < DateTime.Now) {return false;}
			if (arenaCourse.start_date != null && arenaCourse.start_date < DateTime.Now) {return false;}
			if (arenaCourse.start_date != null && arenaCourse.end_date != null &&
			   (arenaCourse.end_date.Value - arenaCourse.start_date.Value).TotalDays > 270) {return false;}
			if (arenaCourse.yrkeshogskolepoang != null && arenaCourse.yrkeshogskolepoang > 40) {return false;} // fulltime = 5/week

			if (String.IsNullOrEmpty(arenaCourse.category))
				Log.Warning($"No categorization for for course: {arenaCourse.link}, add to file {GTC_LINK_CATEGORY_FILE}");

			return true;
		}

		public static Arena.Course? LoadSingle(HttpClient client, string url)
		{
			if (kmCategories is null) {LoadCategories();}
			Log.Information($"Loading: {url}");
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, url);
			HttpResponseMessage r = client.SendAsync(req).Result;
			string response = r.Content.ReadAsStringAsync().Result;
			HtmlDocument doc = new HtmlDocument();
			doc.LoadHtml(response);
			HtmlNodeCollection a = doc.DocumentNode.SelectNodes("//script[@type='application/ld+json']");
			Course? schemaCourse = null;
			foreach (HtmlNode link in a) //TODO Handle multiple nodess
			{
				// TODO As of this writing Schema.NET is still working on supporting graph, but not yet,
				// so, with the current parsed content, some less pretty manual resolving of graph info
				// is needed
				JsonElement j = JsonDocument.Parse(link.InnerHtml).RootElement;

				if (j.TryGetProperty("@graph", out JsonElement graph))
				{
					schemaCourse = ResolveGraph(graph);
				} else
				{
					schemaCourse = Schema.NET.SchemaSerializer.DeserializeObject<Course>(j.ToString());
				}
			}

			Arena.Course? arenaCourse = null;
			if (schemaCourse is not null)
			{
				arenaCourse = ToArena(schemaCourse);
			}
			if (arenaCourse is null) { return null; }
			arenaCourse = AddScrapedData(response, arenaCourse);
			arenaCourse = AddCategories(arenaCourse);

			return arenaCourse;
		}

		public static List<Arena.Course> request_parse(HttpClient client, Extapi.Parser method, string url)
		{
			if (kmCategories is null) {LoadCategories();}
			if (gtcLinkMaps is null) {LoadLinkMaps();}
			
			List<Arena.Course> courses = new List<Arena.Course>();
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, url);
			HttpResponseMessage r = client.SendAsync(req).Result;
			string response = r.Content.ReadAsStringAsync().Result;
			HtmlDocument doc = new HtmlDocument();
			doc.LoadHtml(response);
			// "Långa utbildningar"/"Korta utbildningar" from March 2022 html structure of https://www.goteborgstekniskacollege.se/utbildningar/yrkeshogskola/utbildningar
			HtmlNodeCollection a = doc.DocumentNode.SelectNodes("//ul[@class='courses']/div/a");
			if (a == null) { Log.Error($"No 'long' courses found at {url}"); }
			else
			{
				foreach (HtmlNode link in a)
				{
					Arena.Course? arenaCourse = LoadSingle(client, link.Attributes["href"].Value);
					if (arenaCourse is not null && CheckRequirements(arenaCourse))
					{
						arenaCourse.import_source = method.ToString();
						courses.Add(arenaCourse);
					} else
						Log.Information("... discarded.");
				}
			}
			// "Kurs på tom plats" from March 2022 html structure of https://www.goteborgstekniskacollege.se/utbildningar/yrkeshogskola/utbildningar
			a = doc.DocumentNode.SelectNodes("//ul[@class='free-chairs']/li/a");
			if (a == null) { Log.Warning($"No 'free chairs' courses found at {url}"); }
			else
			{
				foreach (HtmlNode link in a)
				{
					Arena.Course? arenaCourse = LoadSingle(client, link.Attributes["href"].Value);
					if (arenaCourse is not null && CheckRequirements(arenaCourse))
					{
						arenaCourse.import_source = method.ToString();
						courses.Add(arenaCourse);
					}
					else
						Log.Information("... discarded.");
				}
			}

			return courses;
		}

	}
}