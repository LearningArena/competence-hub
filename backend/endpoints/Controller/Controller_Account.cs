/**************************

Routes:
	/account/logout
	/account/claims
	/verify_fromtoken/{token}/{payload}
	/login_fromtoken/{token}/{payload}

**************************/

using System;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Arena;

public class Controller_Account : Controller
{
	private readonly Serilog.ILogger log = Log.ForContext<Controller_Account>();
	private readonly Arena_Context _context;
	public Controller_Account(Arena_Context context)
	{
		_context = context;
	}

	[HttpGet("/account/logout")]
	public IActionResult logout()
	{
		log.Information("SignOutAsync {AuthenticationScheme}, {AuthenticationType}", CookieAuthenticationDefaults.AuthenticationScheme, HttpContext.User.Identity.AuthenticationType);
		bool a1 = HttpContext.User.Identity.IsAuthenticated;
		HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
		bool a2 = HttpContext.User.Identity.IsAuthenticated;
		HttpContext.Response.Headers.Add("Clear-Site-Data","\"cookies\"");
		return Ok($"IsAuthenticated: {a1} -> {a2}");
	}

	[HttpGet("/account/claims")]
	public IActionResult claims()
	{
		IEnumerable<Claim> claims = HttpContext.User.Claims.ToList();
		JsonSerializerOptions options = new()
		{
			ReferenceHandler = ReferenceHandler.IgnoreCycles,
			WriteIndented = true
		};
		string json = JsonSerializer.Serialize(claims, options);
		return Ok(json);
	}


	[HttpGet("/verify_fromtoken/{token}/{payload}")]
	public IActionResult verify_fromtoken(string token, string payload)
	{
		Guid tokenguid = new Guid(Base64UrlTextEncoder.Decode(token));
		Tempuser tempuser = _context.tempusers.Where(x => x.token == tokenguid).FirstOrDefault();
		if (tempuser == null)
		{
			return Content("Could not find tempuser!", "text/html");
		}
		if (DateTime.UtcNow > tempuser.expire)
		{
			return Content("tempuser expired!", "text/html");
		}
		byte[] encrypted = Base64UrlTextEncoder.Decode(payload);
		if (tempuser.payload.SequenceEqual(encrypted) == false)
		{
			return Content("payload mismatch!", "text/html");
		}
		string roundtrip = Cryptor.decrypt(encrypted, Arena.aes.Key, Arena.aes.IV);
		Verify_Info verify = JsonSerializer.Deserialize<Verify_Info>(roundtrip);
		//if (DateTime.UtcNow > verify.expire)
		{
			//return Content ("Payload expired!", "text/html");
		}
		switch (verify.name)
		{
			case Table.UNKNOWN:
				return Content(roundtrip, "text/html");
			case Table.USERS:
				User u = _context.users.Where(x => x.id == verify.id).FirstOrDefault();
				if (u == null) { return Content("User (" + verify.id + ") not found!", "text/html"); }
				u.record_status = verify.status;
				_context.users.Update(u);
				_context.SaveChanges();
				return Content("Updated User (" + u.id + ") record_status to " + verify.status.ToString() + ".", "text/html");
			case Table.ORGANIZATIONS:
				Organization o = _context.organizations.Where(x => x.id == verify.id).FirstOrDefault();
				if (o == null) { return Content("Organization (" + verify.id + ") not found!", "text/html"); }
				o.record_status = verify.status;
				_context.organizations.Update(o);
				_context.SaveChanges();
				return Content("Updated Organization (" + o.id + ") record_status to " + verify.status.ToString() + ".", "text/html");
		}
		return Content("Should not happen", "text/html");
	}


	[HttpGet("/login_fromtoken/{token}/{payload}")]
	public async Task<IActionResult> login_fromtoken(string token, string payload)
	{
		Guid tokenguid = new Guid(Base64UrlTextEncoder.Decode(token));
		Tempuser tempuser = _context.tempusers.Where(x => x.token == tokenguid).FirstOrDefault();
		if (tempuser == null)
		{
			return Content("Could not find tempuser!", "text/html");
		}
		if (DateTime.UtcNow > tempuser.expire)
		{
			return Content("tempuser expired!", "text/html");
		}
		byte[] encrypted = Base64UrlTextEncoder.Decode(payload);
		if (tempuser.payload.SequenceEqual(encrypted) == false)
		{
			return Content("payload mismatch!", "text/html");
		}
		string roundtrip = Cryptor.decrypt(encrypted, Arena.aes.Key, Arena.aes.IV);
		Login_Payload login_payload = JsonSerializer.Deserialize<Login_Payload>(roundtrip);

		string user_id = _context.users.Where(u => u.keycloak_guid == login_payload.keycloak_guid).Select(u => u.id).FirstOrDefault().ToString();

		var claims = new List<Claim>
		{
			new Claim(Arena_Claims.ARENA_USER_ID, user_id),
			new Claim(Arena_Claims.KEYCLOAK_USER_GUID, login_payload.keycloak_guid.ToString()),
		};
		var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
		identity.AddClaims(claims);
		var principal = new ClaimsPrincipal(identity);
		var p = new AuthenticationProperties
		{
			ExpiresUtc = DateTime.UtcNow.AddMonths(3),
			AllowRefresh = true
		};
		await _context.http_context.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, p);

		return Redirect("/");
	}


}


