using System.IO;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using System.Net;

using Microsoft.Extensions.Configuration;

using Serilog;

namespace Arena;



public class Keycloak_Config
{
	public string realm { get; set; }
	public string auth_server_url { get; set; }
	public string resource { get; set; }
	public string credentials_secret { get; set; }

	public void import_jsonfile(string filename)
	{
		IConfiguration c = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile(filename).Build();
		realm = c["realm"];
		auth_server_url = c["auth-server-url"];
		resource = c["resource"];
		credentials_secret = c["credentials:secret"];
	}

};


public class Keycloak_Access_Token
{
	public string access_token { get; set; }
	public string token_type { get; set; }
	public long expires_in { get; set; }
	public string error { get; set; }
	public string error_description { get; set; }
	public HttpStatusCode status { get; set; }
}

public class Keycloak_Credential
{
	public string type { get; set; }
	public string value { get; set; }
	public bool temporary { get; set; }
}

public class Keycloak_User
{
	public string email { get; set; }
	public string enabled { get; set; }
	public string username { get; set; }
	public string firstName { get; set; }
	public string lastName { get; set; }

	public List<Keycloak_Credential> credentials { get; set; }

};

public class Keycloak_Response_Register
{
	public string errorMessage { get; set; }
	public HttpStatusCode status { get; set; }
};

public class Keycloak_Userinfo
{
	public string sub { get; set; }
	public bool email_verified { get; set; }
	public string preferred_username { get; set; }
	public List<string> groups { get; set; }
	public string error { get; set; }
	public string error_description { get; set; }

};

//{"manageGroupMembership":true,"view":true,"mapRoles":true,"impersonate":false,"manage":true}


public class Keycloak_Useraccess
{
	public bool manageGroupMembership { get; set; }
	public bool view { get; set; }
	public bool mapRoles { get; set; }
	public bool impersonate { get; set; }
	public bool manage { get; set; }
}

public class Keycloak_User1
{
	public string id { get; set; }
	public ulong createdTimestamp { get; set; }
	public string username { get; set; }
	public bool enabled { get; set; }
	public bool totp { get; set; }
	public bool emailVerified { get; set; }
	public string email { get; set; }
	public int notBefore { get; set; }

	public Keycloak_Useraccess access { get; set; }
}


public class Keycloak
{

	private static readonly ILogger log = Log.ForContext(typeof(Arena_Email));

	static public Keycloak_Access_Token login(Keycloak_Config c, string username, string password)
	{
		var grant = new List<KeyValuePair<string, string>>();
		grant.Add(new KeyValuePair<string, string>("username", username));
		grant.Add(new KeyValuePair<string, string>("password", password));
		grant.Add(new KeyValuePair<string, string>("grant_type", "password"));
		grant.Add(new KeyValuePair<string, string>("client_id", c.resource));
		grant.Add(new KeyValuePair<string, string>("client_secret", c.credentials_secret));
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, c.auth_server_url + "realms/" + c.realm + "/protocol/openid-connect/token");
		req.Content = new FormUrlEncodedContent(grant);
		HttpResponseMessage response = Arena.Send(req);
		string json = response.Content.ReadAsStringAsync().Result;
		Keycloak_Access_Token token = JsonSerializer.Deserialize<Keycloak_Access_Token>(json);
		//await HttpContext.Response.WriteAsync(r);
		return token;
	}


	//Return value can be used to register new users and much more etc.
	static public Keycloak_Access_Token token(Keycloak_Config c)
	{
		var grant = new List<KeyValuePair<string, string>>();
		grant.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
		grant.Add(new KeyValuePair<string, string>("client_id", c.resource));
		grant.Add(new KeyValuePair<string, string>("client_secret", c.credentials_secret));
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, c.auth_server_url + "realms/" + c.realm + "/protocol/openid-connect/token");
		req.Content = new FormUrlEncodedContent(grant);
		HttpResponseMessage response = Arena.Send(req);
		string json = response.Content.ReadAsStringAsync().Result;
		Keycloak_Access_Token token = JsonSerializer.Deserialize<Keycloak_Access_Token>(json);
		token.status = response.StatusCode;
		return token;
	}

	static public Keycloak_Response_Register register(Keycloak_Config c, string access_token, string email, string password, string firstName, string lastName)
	{
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, c.auth_server_url + "admin/realms/" + c.realm + "/users");
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
		//string payload = "{\"username\":\""+ email +"\",\"email\":\"demo2@gmail.com\", \"enabled\":\"true\",\"credentials\":[{\"type\":\"password\",\"value\":\"test123\",\"temporary\":false}]}";
		//Fill out a new user to be registered:
		Keycloak_User user = new Keycloak_User
		{
			username = email,
			email = email,
			firstName = firstName,
			lastName = lastName,
			enabled = "true",
			credentials = new List<Keycloak_Credential>()
		};

		user.credentials.Add(new Keycloak_Credential { type = "password", value = password, temporary = false });
		string user_json = JsonSerializer.Serialize(user);
		req.Content = new StringContent(user_json, Encoding.UTF8, "application/json");
		HttpResponseMessage r = Arena.Send(req);
		string response = r.Content.ReadAsStringAsync().Result;
		//Assume response is json if non empty:
		//If register is successful response will be empty:
		Keycloak_Response_Register result = new Keycloak_Response_Register { };
		if (response.Length > 0)
		{
			result = JsonSerializer.Deserialize<Keycloak_Response_Register>(response);
		}
		//Should be (201 created) if register is successfull:
		result.status = r.StatusCode;
		return result;
	}

	static public Primitive_Result change_password(Keycloak_Config c, string new_password, string access_token, string keycloak_guid)
	{
		log.Information("access_token: {access_token}", access_token);
		log.Information("keycloak_guid: {keycloak_guid}", keycloak_guid);
		string uri = c.auth_server_url + "admin/realms/" + c.realm + "/users/" + keycloak_guid + "/reset-password";
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Put, uri);
		log.Information("HttpRequestMessage: {uri}", uri);
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
		Keycloak_Credential cred = new Keycloak_Credential
		{
			type = "password",
			temporary = false,
			value = new_password
		};
		string user_json = JsonSerializer.Serialize(cred);
		req.Content = new StringContent(user_json, Encoding.UTF8, "application/json");
		HttpResponseMessage r = Arena.Send(req);
		string response = r.Content.ReadAsStringAsync().Result;
		log.Information(response);
		Keycloak_Response_Register result = new Keycloak_Response_Register { };
		if (response.Length > 0)
		{
			result = JsonSerializer.Deserialize<Keycloak_Response_Register>(response);
		}
		if (r.StatusCode != HttpStatusCode.NoContent){return Primitive_Result.KEYCLOAK_ERROR;}
		return Primitive_Result.SUCCESS;
	}

	static public Keycloak_Userinfo userinfo(Keycloak_Config c, string access_token)
	{
		Keycloak_Userinfo userinfo = null;
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, c.auth_server_url + "realms/" + c.realm + "/protocol/openid-connect/userinfo");
		req.Content = new StringContent("", Encoding.UTF8, "application/x-www-form-urlencoded");
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
		HttpResponseMessage response = Arena.Send(req);
		string response_content = response.Content.ReadAsStringAsync().Result;
		//Assume response is json if non empty:
		//If register is successful response will be empty:????
		if (response_content.Length > 0)
		{
			userinfo = JsonSerializer.Deserialize<Keycloak_Userinfo>(response_content);
		}
		return userinfo;
	}


	//https://stackoverflow.com/questions/55535440/how-to-get-users-from-keycloak-rest-api/55539390
	static public List<Keycloak_User1> users(Keycloak_Config c, string access_token)
	{
		List<Keycloak_User1> users = null;
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Get, c.auth_server_url + "admin/realms/" + c.realm + "/users");
		req.Content = new StringContent("", Encoding.UTF8, "application/x-www-form-urlencoded");
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
		HttpResponseMessage response = Arena.Send(req);
		string response_content = response.Content.ReadAsStringAsync().Result;
		if (response_content.Length > 0)
		{
			users = JsonSerializer.Deserialize<List<Keycloak_User1>>(response_content);
		}
		return users;
	}


	// To change username one must enable:
	// Edit username = on
	// https://afll-lab.testbed.se/auth/admin/master/console/#/realms/arenarealm/login-settings
	static public Primitive_Result modify_user(Keycloak_Config c, Keycloak_User user, string access_token, string keycloak_guid)
	{
		log.Information("access_token: {access_token}", access_token);
		log.Information("keycloak_guid: {keycloak_guid}", keycloak_guid);
		string uri = c.auth_server_url + "admin/realms/" + c.realm + "/users/" + keycloak_guid;
		HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Put, uri);
		req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
		log.Information("HttpRequestMessage: {uri}", uri);
		req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
		//https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-ignore-properties?pivots=dotnet-6-0
		JsonSerializerOptions options = new()
		{
			DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
		};
		string user_json = JsonSerializer.Serialize(user, options);

		req.Content = new StringContent(user_json, Encoding.UTF8, "application/json");
		log.Information(req.ToRawString().Result);

		HttpResponseMessage r = Arena.Send(req);
		log.Information(r.ToRawString().Result);

		string response = r.Content.ReadAsStringAsync().Result;
		log.Information(response);

		Keycloak_Response_Register result = new Keycloak_Response_Register { };
		if (response.Length > 0)
		{
			result = JsonSerializer.Deserialize<Keycloak_Response_Register>(response);
		}
		result.status = r.StatusCode;
		if (r.StatusCode != HttpStatusCode.NoContent) {return Primitive_Result.KEYCLOAK_ERROR;}

		return Primitive_Result.SUCCESS;
	}

}
