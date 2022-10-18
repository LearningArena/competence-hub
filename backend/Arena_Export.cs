using System;
using System.IO;
using System.Text.Json;
using System.IO.Compression;
using Serilog;

namespace Arena;


public static class Arena_Export
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Export));

	//https://www.jitbit.com/alexblog/278-returning-a-zip-file-from-aspnet-mvc-actions---in-pure-net/
	public static MemoryStream testing_export(Arena_Context context)
	{
		var ms = new MemoryStream();
		using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, true))
		{
			foreach (Course c in context.courses)
			{
				string name = c.id.ToString("D10") + "_" + c.title + "_" + DateTime.UtcNow.ToString("yyyyMMdd");
				var file = archive.CreateEntry(name + ".json");
				using (Stream fstream = file.Open())
				using (StreamWriter writer = new StreamWriter(fstream))
				{

					var options = new JsonSerializerOptions
					{
						WriteIndented = true
					};
					/*
					byte[] jsonUtf8Bytes = JsonSerializer.SerializeToUtf8Bytes(c, options);
					*/
					string s = JsonSerializer.Serialize(c, options);
					writer.Write(s);
				}
			}
		}
		log.Information("Memorystream created size = {Length}", ms.Length);
		return ms;
		
	}
}
