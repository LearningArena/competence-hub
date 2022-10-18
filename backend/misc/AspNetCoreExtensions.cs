using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Arena;

public static class AspNetCoreExtensions
{
	public static async Task<string> ToRawString(this HttpRequest request)
	{
		var sb = new StringBuilder();

		var line1 = $"{request.Method} {request.Scheme}://{request.Host}{request.Path} {request.Protocol}";
		sb.AppendLine(line1);

		foreach (var (key, value) in request.Headers)
		{
			var header = $"{key}: {value}";
			sb.AppendLine(header);
		}
		sb.AppendLine();

		using var reader = new StreamReader(request.Body);
		var body = await reader.ReadToEndAsync();
		if (!string.IsNullOrWhiteSpace(body))
			sb.AppendLine(body);

		return sb.ToString();
	}
}


