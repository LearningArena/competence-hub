using HotChocolate;
using HotChocolate.Types;
using Serilog;
using System;
using System.Net.Http;

namespace Arena;

public static class Bolaget
{
	public static DateTime time = DateTime.Now;
	public static string find(string s, string s1, int j1, string s2, int j2)
	{
		int i1 = s.IndexOf(s1);
		if (i1 < 0){return null;}
		int i2 = s.IndexOf(s2, i1);
		if (i2 < 0){return null;}
		i1 += s1.Length + j1;
		return s.Substring(i1, i2 - i1 + j2);
	}

}

[ExtendObjectType(OperationTypeNames.Query)]
public class Allabolag_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Allabolag_Query>();
	public DateTime lastCall = DateTime.Now.AddSeconds(-0);

	[GraphQLType(typeof(AnyType))]
	public Organization allabolag([Service] Arena_Context context, string orgnr)
	{
		Organization o = new Organization{};
		if (lastCall.AddSeconds(10) > DateTime.Now)
		{
			o.name = "Too many requests. Wait " + (lastCall.AddSeconds(10) - DateTime.Now).TotalSeconds + " seconds.";
		}
		else
		{
			lastCall = DateTime.Now;
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, "https://www.allabolag.se/"+ orgnr);
			HttpResponseMessage r = Arena.Send(req);
			string response = r.Content.ReadAsStringAsync().Result;
			o.name = Bolaget.find(response, "companyName: decodeEntities(", 1, ")", -1);
			o.orgid = Bolaget.find(response, "companyOrgNr: ", 1, ",", -1);
			//o.address = Bolaget.find(response, "geoCounty: ", 1, ",", -1) + " " + Bolaget.find(response, "geoProvince: ", 1, ",", -1);
			o.address = Bolaget.find(response, "maps?q=", 0, "&t", 0);
			o.phonenumber = Bolaget.find(response, "tel:", 0, ">", -1);
			o.description = 
			Bolaget.find(response, "SNIindustry: decodeEntities(", 1, ")", -1) + ". " +
			Bolaget.find(response, "industryCategory: decodeEntities(", 1, ")", -1) + ". " +
			Bolaget.find(response, "industrySubCategory: decodeEntities(", 1, ")", -1);
		}
		return o;
	}

}
