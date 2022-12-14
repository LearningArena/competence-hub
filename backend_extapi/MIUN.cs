using System;
using System.Text;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using Serilog;
using System.Text.Json.Serialization;
using Arena;

namespace MIUN;


public class Response_EducationOccasion
{
	public object Orientations { get; set; }
	public string RegistrationCode { get; set; }
	public string TermStart { get; set; }
	public string TermStartAbbreviation { get; set; }
	public string TermStartDate { get; set; }
	public string StudyLocation { get; set; }
	public string StudyPace { get; set; }
	public string StudyForm { get; set; }
	public DateTime ApplicationDeadLine { get; set; }
	public bool Canceled { get; set; }
	public DateTime ApplicationClosed { get; set; }
}

public class Response_Hit
{
	public string Type { get; set; }
	public string Code { get; set; }
	public string Title { get; set; }
	public float Points { get; set; }
	public string Level { get; set; }
	public string Url { get; set; }
	public string Area { get; set; }
	public bool HasOpenCourses { get; set; }
	public bool HasClosedCourses { get; set; }
	public List<Response_EducationOccasion> EducationOccasions { get; set; }
}

public class Response_Root
{
	public string ResponseTime { get; set; }
	public int NumberOfHits { get; set; }
	public List<Response_Hit> Hits { get; set; }
}



public class Request_Facets
{
	public bool IsOpen { get; set; }
	public List<string> TermStart { get; set; }
	public List<string> StudyLocation { get; set; }
	public List<string> StudyPace { get; set; }
	public List<string> StudyForm { get; set; }
	public List<string> Level { get; set; }
}

public class Request_Root
{
	public string FreeText { get; set; }
	public string Area { get; set; }
	public bool SearchCourse { get; set; }
	public bool SearchProgram { get; set; }
	public Request_Facets Facets { get; set; }
}



public static class Methods
{
	private static readonly ILogger log = Log.ForContext(typeof(Methods));

	public static List<Arena.Course> request_parse(HttpClient client, Extapi.Parser method, string url)
	{
		List<Arena.Course> courses = new List<Arena.Course>();
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, url);
		Request_Root rreq = new Request_Root
		{
			Area = "",
			SearchCourse = true,
			SearchProgram = false,
			Facets = new Request_Facets
			{
				Level = new List<String>(),
				StudyForm = new List<String>(),
				StudyLocation = new List<String>(),
				StudyPace = new List<String>(),
				IsOpen = true,
				TermStart = new List<String>{}
			},
			FreeText = ""
		};
		var jsonOptions = new JsonSerializerOptions() {
			NumberHandling = JsonNumberHandling.AllowReadingFromString
		};
		string content = JsonSerializer.Serialize<Request_Root>(rreq);
		log.Information(content);
		req.Content = new StringContent(content, Encoding.UTF8, "application/json");
		HttpResponseMessage r = client.SendAsync(req).Result;
		string response = r.Content.ReadAsStringAsync().Result;
		Response_Root root = JsonSerializer.Deserialize<Response_Root>(response, jsonOptions);
		foreach(Response_Hit h in root.Hits)
		{
			// Skip this hit if there are no open courses
			if (h.HasOpenCourses == false) { continue; }

			// Pick the next occurring education occasion
			Response_EducationOccasion educationOccasion = null;
			foreach(Response_EducationOccasion eo in h.EducationOccasions)
			{
				if (eo.ApplicationClosed < DateTime.Now) { continue; }
				educationOccasion = eo;
				break;
			}
			if (educationOccasion is null) { continue; }

			Arena.Course c = new Arena.Course
			{
				external_stringid = h.Code,
				title = h.Title,

				//We need study location
				city = educationOccasion.StudyLocation,

				link = $"https://miun.se/{h.Url}",

				credits = h.Points,
				hogskolapoang = h.Points,

				registration_end_date = educationOccasion.ApplicationDeadLine.ToUniversalTime()
			};

			// Parse studypace
			if (educationOccasion.StudyPace == "helfart")
			{
				c.studypace = "100%";
			}
			else if (educationOccasion.StudyPace == "halvfart")
			{
				c.studypace = "50%";
			}

			// Set the record status of the course
			if (educationOccasion.Canceled)
			{
				c.record_status = Record_Status.ARCHIVED;
			}
			else
			{
				c.record_status = Record_Status.GENERATED;
			}

			c.import_source = method.ToString();

			courses.Add(c);
		}
		return courses;
	}

}
