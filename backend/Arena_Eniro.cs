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
	public static Primitive_Result OrgFromSearchstring(Arena_Context context, string searchString, Organization o)
	{
		Primitive_Result status = Primitive_Result.NOT_FOUND;
		if (lastCall.AddMilliseconds(RETRY_MS) > DateTime.Now)
			status = Primitive_Result.REQUEST_COOLDOWN;
		else
		{
			lastCall = DateTime.Now;
			HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, $"https://www.eniro.se/{searchString}/företag");
			HttpResponseMessage r = Arena.Send(req);
			string response = r.Content.ReadAsStringAsync().Result;

			MatchCollection mc = Regex.Matches(response, @"NEXT_DATA.*application\/json.*?>(.*)<\/script");
			if (mc.Count > 0 && mc[0].Groups.Count > 1 && mc[0].Groups[1].Captures.Count > 0)
			{
				string resString = mc[0].Groups[1].Captures[0].ToString().Trim(' ', '\n');
				JsonElement json = JsonDocument.Parse(resString).RootElement;
				if (json.TryGetProperty("props", out var props) && props.ValueKind != JsonValueKind.Null)
				{
					if (props.TryGetProperty("pageProps", out var pageProps) && pageProps.ValueKind != JsonValueKind.Null)
					{
						if (pageProps.TryGetProperty("initialState", out var state) && state.ValueKind != JsonValueKind.Null)
							if (state.TryGetProperty("companyHits", out var hits) && hits.ValueKind != JsonValueKind.Null)
							{
								int numHits = hits.GetInt32();
								if (numHits > 0 && state.TryGetProperty("companies", out var companies) && companies.GetArrayLength() > 0)
								{
									JsonElement firstOrg = companies[0]; // most keys have different names from Arena.Organization ...
									if (firstOrg.TryGetProperty("organisationNumber", out var orgNumber))
									{
										// currently requiring org id, should we relax this? - some hits have good info even though lacking org number ...
										status = Primitive_Result.SUCCESS;
										List<string> missingProps = new List<string> {};
										o.orgid = orgNumber.GetString();
										try { o.name = firstOrg.GetProperty("name").GetString(); } catch {missingProps.Add("name");}
										try {
											if (firstOrg.TryGetProperty("products", out var products) && products.GetArrayLength() > 0)
											{
												for (int pIx = 0; pIx < products.GetArrayLength(); pIx++)
												{
													if ( products[pIx].GetProperty("name").GetString() == "homepage")
													{
														o.website = products[pIx].GetProperty("url").GetString();
													}
													else if ( products[pIx].GetProperty("name").GetString() == "email")
													{
														o.email = products[pIx].GetProperty("link").GetString();
													}
												}
											}
										} catch { missingProps.Add("website/email"); }
										try {
											if (firstOrg.TryGetProperty("addresses", out var addresses) && addresses.GetArrayLength() > 0)
											{
												JsonElement firstAddress = addresses[0];
												o.address = firstAddress.GetProperty("streetName") + " " +
															firstAddress.GetProperty("streetNumber") + ", " +
															firstAddress.GetProperty("postalCode") + " " +
															firstAddress.GetProperty("postalArea");
											}
										} catch {missingProps.Add("adress");}
										try {
											if (firstOrg.TryGetProperty("phones", out var phones) && phones.GetArrayLength() > 0)
											{
												JsonElement firstNumber = phones[0];
												o.phonenumber = firstNumber.GetProperty("number").ToString();
											}
										} catch {missingProps.Add("phonenumber");}
										// try { o.description = ...
										o.record_status = Record_Status.GENERATED;
										// Console.WriteLine("5\n\t" + o.orgid + "\n\t" + o.name + "\n\t" + o.address + "\n\t" + o.phonenumber + "\n\t" + o.record_status);
										if (missingProps.Count != 0)
											log.Information($"Eniro org lookup for {searchString} missing props: {string.Join(", ", missingProps)}");
									}
								}
							}
					}
				}
			}
		}
		return status;
	}
}