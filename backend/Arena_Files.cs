using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Arena;



public static class Arena_Files
{

	private static readonly ILogger log = Log.ForContext(typeof(Arena_Files));
	public static async Task savefile(string path, IFormFile file)
	{
		log.Information("Saving file {filename} to {path}. Size = {size}", file.FileName, path, file.Length);
		using (Stream stream = new FileStream(".." + path, FileMode.Create))
		{
			await file.CopyToAsync(stream);
		}
	}

	public static void savefile(string path, byte[] bytes)
	{
		log.Information("Saving file {filename} to {path}. Size = {size}", path, path, bytes.Length);
		File.WriteAllBytes(".." + path, bytes);
	}


	//
	// Summery:
	//     This will create a file with a generated filename and write the content to it.
	//     Then a reference to this file will be put into the database.
	public static string refsave(Arena_Context context, int user_id, byte[] content, string file_extension)
	{
		string guid = System.Guid.NewGuid().ToString();
		string path = "/media/" + guid + file_extension;
		Fileitem fileitem = new Fileitem{};
		fileitem.name = guid;
		fileitem.path = path;
		fileitem.kind = Itemkindclass.from_file_extenstion(file_extension);
		log.Information("Adding {@Fileitem}", fileitem);
		context.Add(fileitem);
		context.SaveChanges();
		// If there is a owner for the fileitem:
		if (user_id > 0)
		{
			Fileitem_User_Edge edge = new Fileitem_User_Edge{fileitem_id = fileitem.id, user_id = user_id, relationship = Relationship.AUTHOR};
			log.Information("Adding {@Fileitem_User_Edge}", edge);
			context.fileitem_user_edges.Add(edge);
		}
		context.SaveChanges();
		savefile(path, content);
		return path;
	}


	//
	// Summery:
	//     This will create a file with a specified filename from IFormFile and write the IFormFile content to it.
	//     Then a reference to this file will be put into the database.
	public static async Task refsave(Arena_Context context, IFormFile file, int user_id)
	{
		string guid = System.Guid.NewGuid().ToString();
		string ext = Path.GetExtension(file.FileName);
		//string path = "/media/" + file.FileName;
		string path = "/media/" + guid + ext;
		Fileitem fileitem = new Fileitem{name = file.FileName, path = path, kind = Itemkindclass.from_file_extenstion(ext)};
		log.Information("Adding {@Fileitem}", fileitem);
		context.fileitems.Add(fileitem);
		await context.SaveChangesAsync();
		Fileitem_User_Edge edge = new Fileitem_User_Edge{fileitem_id = fileitem.id, user_id = user_id, relationship = Relationship.AUTHOR};
		log.Information("Adding {@Fileitem_User_Edge}", edge);
		context.fileitem_user_edges.Add(edge);
		await context.SaveChangesAsync();
		await savefile(path, file);
	}





}
