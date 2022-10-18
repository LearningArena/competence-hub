using Serilog;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Net;

namespace Extapi
{

	public enum Parser
	{
		UNKNOWN,
		GOTENBORGS_TEKNISKA_COLLAGE,
		//MDH courses
		LEARNING_4_PROFESSIONALS,
		SUSA_NAVET,
		MIUN, //https://www.miun.se/utbildning/kurser/

	};


	// Temporary code begin
	// TODO: Remove this class
	public static class Endpoints
	{
		// TODO: Get this information from database instead:
		public static readonly Dictionary<Parser, string> urls = new Dictionary<Parser, string>{
			{Parser.GOTENBORGS_TEKNISKA_COLLAGE, "https://www.goteborgstekniskacollege.se/utbildningar/yrkeshogskola/utbildningar"},
			{Parser.LEARNING_4_PROFESSIONALS, "https://learning4professionals.se/search?show=24"},
			{Parser.SUSA_NAVET, "https://susanavet2.skolverket.se/api/1.1"},
			{Parser.MIUN, "https://www.miun.se/api/edu"}
		};
	}
	// Temporary code end



	static public class Externaldata
	{

		private static readonly ILogger log = Log.ForContext(typeof(Externaldata));

		static public List<Arena.Course> request_parse(HttpClient client, Parser method, string url)
		{
			List<Arena.Course> courses = new List<Arena.Course>();
			log.Information("Request and parsing {method}", method);
			switch(method)
			{
			case Parser.GOTENBORGS_TEKNISKA_COLLAGE:
				courses = GoteborgsTekniskaCollege.Methods.request_parse(client, url);
				break;
			case Parser.LEARNING_4_PROFESSIONALS:
				courses = Learning4professionals.Methods.request_parse(client, url);
				break;
			case Parser.SUSA_NAVET:
				courses = SusaNavet.Susa.request_parse(client, url);
				break;
			case Parser.MIUN:
				courses = MIUN.Methods.request_parse(client, url);
				break;
			default:
				break;
			}
			return courses;
		}

		// Generic onversion of text elements with html to formatted text, useable for any imported external data
		static public string HtmlToPrettyString(string htmlString) {
			htmlString = Regex.Replace(htmlString, @"<br.*?>|<p>", "\n"); // replace break and paragraph start with linebreak
			htmlString = Regex.Replace(htmlString, @"<li>", "\n- ");      // replace list items with linebreaks and hyphen
			htmlString = Regex.Replace(htmlString, @"<.+?>", "");         // remove remaing tags
   			htmlString = WebUtility.HtmlDecode(htmlString);               // decode e.g. ampersands
			htmlString = Regex.Replace(htmlString, @"\n\s*\n", "\n");     // replace multiple linebreaks with single linebreak
			return htmlString.Trim();
		}

	}
}