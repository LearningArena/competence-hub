
using System;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace Misc;

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme

Basic authentication scheme

The "Basic" HTTP authentication scheme is defined in RFC 7617, which transmits credentials as user ID/password pairs, encoded using base64.
Security of basic authentication

As the user ID and password are passed over the network as clear text (it is base64 encoded, but base64 is a reversible encoding), 
the basic authentication scheme is not secure. HTTPS/TLS should be used with basic authentication. 
Without these additional security enhancements, basic authentication should not be used to protect sensitive or valuable information.
*/
public static class HTTP_Basic_Authentication
{
	public static string[] cred(HttpRequest request)
	{
		string a = request.Headers.Authorization.ToString();
		if (a == null){return null;}
		var r = new Regex(@"Basic (.*)");
		if (r.IsMatch(a) == false){return null;}
		string cred64 = a.Remove(0,6);
		if (cred64.Length <= 0){return null;}
		string cred = Encoding.UTF8.GetString(Convert.FromBase64String(cred64));
		if (cred == null){return null;}
		string[] credv = cred.Split(":", 2);
		if (credv == null){return null;}
		if (credv.Length != 2){return null;}
		return credv;
	}

	public static void challange(HttpResponse response, string realm = "Pluto")
	{
		response.Headers.Add("WWW-Authenticate", $"Basic realm=\"{realm}\", charset=\"UTF-8\"");
		response.StatusCode = (int) HttpStatusCode.Unauthorized;
	}
}


