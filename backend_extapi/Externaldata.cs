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
		GOTEBORGS_TEKNISKA_COLLAGE,
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
			{Parser.GOTEBORGS_TEKNISKA_COLLAGE, "https://www.goteborgstekniskacollege.se/utbildningar/yrkeshogskola/utbildningar"},
			{Parser.LEARNING_4_PROFESSIONALS, "https://learning4professionals.se/search?show=24"},
			{Parser.SUSA_NAVET, "https://susanavet2.skolverket.se/api/1.1"},
			{Parser.MIUN, "https://www.miun.se/api/edu"}
		};
	}
	// Temporary code end



	static public class Externaldata
	{

		private static readonly ILogger log = Log.ForContext(typeof(Externaldata));
		public static string LOGTYPE_FILE_PREFIX = "Import2File_";
		public static string NO_URL = "NO_URL";
		public static string MISSING_TIMES = "MISSING_TIMES";
		public static string PAST_START = "PAST_START";
		public static string TIMESPAN_LONG = "TIMESPAN_LONG";
		public static string NO_DESCRIPTION = "NO_DESCRIPTION";
		public static string NO_TITLE_OR_DESCR = "NO_TITLE_OR_DESCR";
		public static string NO_PROVIDER = "NO_PROVIDER";
		public static string STATS = "STATS";

		static public List<Arena.Course> request_parse(HttpClient client, Parser method, string url)
		{
			List<Arena.Course> courses = new List<Arena.Course>();
			log.Information("Request and parsing {method}", method);
			switch(method)
			{
			case Parser.GOTEBORGS_TEKNISKA_COLLAGE:
				courses = GoteborgsTekniskaCollege.Methods.request_parse(client, method, url);
				break;
			case Parser.LEARNING_4_PROFESSIONALS:
				courses = Learning4professionals.Methods.request_parse(client, method, url);
				break;
			case Parser.SUSA_NAVET:
				courses = SusaNavet.Susa.request_parse(client, method, url);
				break;
			case Parser.MIUN:
				courses = MIUN.Methods.request_parse(client, method, url);
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