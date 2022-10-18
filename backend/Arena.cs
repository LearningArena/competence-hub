using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authentication.Cookies;
using Serilog;

namespace Arena;



public class Account
{
	public User user {get; set;}
	public Keycloak_Access_Token keycloak_token {get; set;}
	public Keycloak_Userinfo keycloak_userinfo {get; set;}
	public Primitive_Result status {get; set;}
	public string status_text {get; set;}
};


public static class Arena
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena));
	public const int USER_ID_GUEST = 0;
	public const int USER_ID_UNAUTHORIZED = 0;
	public const int MAX_PAGES = 500;

	public static AuthenticationProperties authentication_properties = new AuthenticationProperties
	{
		ExpiresUtc = DateTime.UtcNow.AddMonths(3),
		AllowRefresh = true
	};

	//Use a shared HttpClient for performance reason:
	//https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/
	public static HttpClient client = new HttpClient();
	static public IConfiguration config_github { get; set; }

	//These configuration must be set to use Keycloak:
	static public Keycloak_Config config_keycloak_admincli;
	static public Keycloak_Config config_keycloak_arenaclient;

	static public Aes aes = Aes.Create();


	//Must of the configurations depends heavily on environment variables 
	//so we use this function to help deployers to know if a environment variable is missing:
	static public void require_environment_variable(string name)
	{
		if (Environment.GetEnvironmentVariable(name) == null)
		{
			Log.Error("Missing environment variable: " + name + "");
			Environment.Exit(1);
		}
	}

	static public HttpResponseMessage Send(HttpRequestMessage request)
	{
		//HttpRequestMessage req = request;
		HttpResponseMessage response = client.SendAsync(request).Result;
		string msg = "HTTP Client Send:\n";
		msg += "Request:\n" + request.ToString() + "\n";
		if (request.Content != null)
		{
			msg += request.Content.ReadAsStringAsync().Result + "\n\n";
		}
		msg += "response:\n" + response.ToString() + "\n";
		if (response.Content != null)
		{
			msg += response.Content.ReadAsStringAsync().Result + "\n\n";
		}
		//Replace password and client secret
		Log.Debug(msg);
		return response;
	}



	static public void OnPrepareResponse_Authentication(WebApplication app, StaticFileResponseContext x)
	{
		// https://www.roundthecode.com/dotnet/how-to-add-basic-authentication-to-asp-net-core-application
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
		// https://dev.to/j_sakamoto/how-can-i-protect-static-files-with-authorization-on-asp-net-core-4l0o#static-files-middleware-builtin-aspnet-core-provides-a-good-hook-point
		using(var scope = app.Services.CreateScope())
		{
			Arena_Context c = scope.ServiceProvider.GetRequiredService<Arena_Context>();
			if (c.is_siteadmin()){return;}
			string[] cred = Misc.HTTP_Basic_Authentication.cred(x.Context.Request);
			if (cred == null){goto challange;}
			if (cred[0] == "dummy" && cred[1] == "dummy"){return;}
			Account account = Arena.authenticate(c, cred[0], cred[1]);
			if (account.status != Primitive_Result.SUCCESS){goto challange;}
			if (account.keycloak_userinfo.groups.Find(x => x == "/Siteadmin").Any() == false){goto challange;}
			Arena.signin(c.http_context.HttpContext, account);
			return;
		}
		challange:
		Misc.HTTP_Basic_Authentication.challange(x.Context.Response);
	}


	// This will set cookie to remember all claims.
	static public void signin(HttpContext context, Account account)
	{
		var claims = new List<Claim>
		{
			new Claim(Arena_Claims.KEYCLOAK_USER_ACCESS_TOKEN, account.keycloak_token.access_token),
			new Claim(Arena_Claims.KEYCLOAK_USER_GUID, account.keycloak_userinfo.sub),
			new Claim(Arena_Claims.ARENA_USER_ID, account.user.id.ToString()),
		};
		string x = account.keycloak_userinfo.groups.Find(x => x == "/Siteadmin");
		if (x != null)
		{
			claims.Add(new Claim(x, x));
		}
		var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
		var principal = new ClaimsPrincipal(identity);
		context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, Arena.authentication_properties);
	}


	// 1. Authenticate username and password from keycloak.
	// 2. Create a user in postgres if not exist.
	static public Account authenticate(Arena_Context context, string username, string password)
	{
		Account account = new Account{};
		account.keycloak_token = Keycloak.login(Arena.config_keycloak_arenaclient, username, password);
		if (account.keycloak_token.access_token == null)
		{
			account.status = Primitive_Result.KEYCLOAK_TOKEN_ERROR;
			account.status_text = account.keycloak_token.error + ": " + account.keycloak_token.error_description;
			return account;
		}
		account.keycloak_userinfo = Keycloak.userinfo(Arena.config_keycloak_admincli, account.keycloak_token.access_token);
		if (account.keycloak_userinfo == null)
		{
			account.status = Primitive_Result.KEYCLOAK_USERINFO_ERROR;
			account.status_text = "Can not get keycloak userinfo";
			return account;
		}

		//Check if we have a user in Arena database, if so then store user id in a claim:
		account.user = context.users.Where(x => x.keycloak_guid == Guid.Parse(account.keycloak_userinfo.sub)).FirstOrDefault();
		if (account.user == null)
		{
			account.user = new User
			{
				keycloak_guid = Guid.Parse(account.keycloak_userinfo.sub),
				preference = 1,
				firstname = username,
				lastname = username,
				username = username,
				email = username,
				record_status = Record_Status.NEEDVERIFICATION,
			};
			context.Add(account.user);
			int r = context.SaveChanges();
			if (r == 1)
			{
				log.Information("Added {@User} to PostgreSQL", account.user);
			}
			else
			{
				log.Error("Adding {@User} to PostgreSQL failed", account.user);
				account.status = Primitive_Result.DB_NEWUSER_ERROR;
				account.status_text = "Adding {@User} to PostgreSQL failed";
				return account;
			}
		}

		account.status = Primitive_Result.SUCCESS;
		return account;
	}



}
