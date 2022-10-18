using Serilog;
using System;
using System.Text.RegularExpressions;
using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;


namespace Arena;
public static class Arena_Eniro
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Eniro));
	public const int RETRY_MS = 1000;
	private static DateTime lastCall = DateTime.Now.AddMilliseconds(-RETRY_MS);
	//public const string SUCCESS = "SUCCESS";
	//public const string NOT_FOUND = "NOT FOUND";
	//public const string REQUEST_COOLDOWN = "REQUEST COOLDOWN";
	public static Primitive_Result OrgFromSearchstring(Arena_Context context, string searchString, Organization o)
	{
		Primitive_Result status = Primitive_Result.NOT_FOUND;
		//Organization o = new Organization{};
		if (lastCall.AddMilliseconds(RETRY_MS) > DateTime.Now)
			status = Primitive_Result.REQUEST_COOLDOWN;
		else
		{
			lastCall = DateTime.Now;
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, $"https://www.eniro.se/{searchString}/företag");
			HttpResponseMessage r = Arena.Send(req);
			string response = r.Content.ReadAsStringAsync().Result;

			// find company info
			MatchCollection mc = Regex.Matches(response, @"PRELOADED_STATE__ = (.*);");
			if (mc.Count > 0 && mc[0].Groups.Count > 1 && mc[0].Groups[1].Captures.Count > 0) {
				string resString = mc[0].Groups[1].Captures[0].ToString().Trim(' ', '\n');
				JsonElement json = JsonDocument.Parse(resString).RootElement;
				if (json.TryGetProperty("searchPage", out var searchPage) && searchPage.ValueKind != JsonValueKind.Null)
					if (searchPage.TryGetProperty("searchResult", out var searchResult) && searchResult.ValueKind != JsonValueKind.Null)
						if (searchResult.TryGetProperty("hits", out var hits) && hits.ValueKind != JsonValueKind.Null)
						{
							int numHits = hits.GetInt32();
							if (numHits > 0 && searchResult.TryGetProperty("items", out var items) && items.GetArrayLength() > 0)
							{
								JsonElement firstOrg = items[0];
								if (firstOrg.TryGetProperty("type", out var type) && type.GetString() == "single_company" && firstOrg.TryGetProperty("orgNumber", out var orgNumber))
								{
									// currently requiring org id, should we relax this? - some hits have good info even though lacking org number ...
									status = Primitive_Result.SUCCESS;
									List<string> missingProps = new List<string> {};
									o.orgid = orgNumber.GetString();
									try { o.name = firstOrg.GetProperty("name").GetString(); } catch {missingProps.Add("name");}
									try {
										if (firstOrg.TryGetProperty("contact", out var contact) && contact.TryGetProperty("homepage", out var homepage) && homepage.TryGetProperty("link", out var link))
										{
											o.website = link.GetString();
										}
									} catch {missingProps.Add("contact->homepage->link");}
									try {
										if (firstOrg.TryGetProperty("address", out var address))
										{
											JsonElement firstAddress = address[0];
											foreach (JsonProperty p in firstAddress.EnumerateObject())
											{
												o.address += $"{p.Value.ToString()} ";
											}
										}
									} catch {missingProps.Add("adress");}
									try {
										if (firstOrg.TryGetProperty("phoneNumbers", out var phoneNumbers))
										{
											JsonElement firstNumber = phoneNumbers[0];
											o.phonenumber = firstNumber.GetProperty("phoneNumber").ToString();
										}
									} catch {missingProps.Add("phoneNumber");}
									try { o.description = firstOrg.GetProperty("companyDescription").GetString(); } catch {missingProps.Add("companyDescription");}
									o.record_status = Record_Status.GENERATED;
									if (missingProps.Count != 0)
										log.Information($"Eniro org lookup missing props: {string.Join(", ", missingProps)}");
								}
							}
						}
			}
		}
		return status;
	}
}