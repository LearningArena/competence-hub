using System;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using Serilog;

Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();
HttpClient client = new HttpClient();

var test = (Extapi.Parser p) => 
{
	List<Arena.Course> courses = Extapi.Externaldata.request_parse(client, p, Extapi.Endpoints.urls[p]);
	foreach (Arena.Course c in courses)
	{
		string str = JsonSerializer.Serialize<Arena.Course>(c);
		Log.Information("{str}", str);
		//Console.WriteLine(c);
	}
};




test(Extapi.Parser.GOTEBORGS_TEKNISKA_COLLEGE);
//test(Extapi.Parser.SUSA_NAVET);
//test(Extapi.Parser.LEARNING_4_PROFESSIONALS);
//test(Extapi.Parser.MIUN);


Log.CloseAndFlush();