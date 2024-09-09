
using System;
using System.Collections.Generic;
using Serilog;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using HttpClientToCurl;

public class OpenAI_Message
{
	public string role { get; set; }
	public string content { get; set; }
}
public class OpenAI_Data
{
	public string model { get; set; }
	public List<OpenAI_Message> messages { get; set; }
	public double temperature { get; set; }
}



static public class OpenAI_Functions
{
	private static string OPENAI_API_KEY = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
	private static readonly ILogger log = Log.ForContext(typeof(OpenAI_Functions));


	static public void log_req_to_curl(HttpRequestMessage req)
	{
		HttpClient c = new HttpClient();
		c.BaseAddress = req.RequestUri; // This is stupid 
		c.GenerateCurlInConsole(req);
	}

	static public string prompt(string content)
	{
		OpenAI_Data data = new OpenAI_Data
		{
			model = "gpt-3.5-turbo",
			messages = new List<OpenAI_Message>
			{
				new OpenAI_Message{role = "user", content = content}
			},
			temperature = 0.7
		};
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", OPENAI_API_KEY);
		req.Content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
		log_req_to_curl(req);
		HttpResponseMessage rep = Arena.Arena.client.SendAsync(req).Result;
		string response = rep.Content.ReadAsStringAsync().Result;
		log.Information(response);
		return "";
	}
}
