using System;
using System.Net;
using System.Net.Http;
using Serilog;

namespace Misc;

public static class UrlValidator
{
    private static readonly ILogger log = Log.ForContext(typeof(UrlValidator));

    public static bool isValidUrl(HttpClient client, string url)
    {
        // Ensure url starts with http
        if (!url.StartsWith("http"))
        {
            url = $"http://{url}";
        }
        // Get url status code
        HttpStatusCode status_code = HttpStatusCode.NotFound;
        try
        {
            status_code = client.SendAsync(new HttpRequestMessage(HttpMethod.Head, url)).GetAwaiter().GetResult().StatusCode;
        }
        catch (Exception e)
        {
            log.Information($"Exception caught during URL validation {e.StackTrace}");
        }

        // Return true for status code OK (200)
        if (status_code == HttpStatusCode.OK)
        {
            return true;
        }

        return false;
    }
}