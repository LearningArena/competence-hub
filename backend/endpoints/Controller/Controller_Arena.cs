/**************************

Routes:
	/uploads
	/table/courses/export
	/test/genverify/{table}/{id}
	/wslog

**************************/

using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Serilog;


namespace Arena;


public class Controller_Arena : Controller
{
	private readonly Serilog.ILogger log = Log.ForContext<Controller_Arena>();
	private readonly Arena_Context _context;
	public Controller_Arena(Arena_Context context)
	{
		_context = context;
	}

	[HttpPost("/uploads")]
	[Consumes("multipart/form-data")]
	[Produces("application/json")]
	public async Task<IActionResult> uploads(IList<IFormFile> files_not_working)
	{
		int user_id = _context.current_user_id(Record_Status.APPROVED);
		if (user_id == Arena.USER_ID_UNAUTHORIZED)
		{
			return Unauthorized();
		}
		foreach (IFormFile file in HttpContext.Request.Form.Files)
		{
			using var transaction = _context.Database.BeginTransaction();
			await Arena_Files.refsave(_context, file, user_id);
			transaction.Commit();
		}
		return NoContent();
	}


	[Obsolete("This is experimental")]
	[HttpGet("/table/courses/export")]
	public IActionResult courses_export()
	{
		if (_context.is_siteadmin() == false){return Unauthorized();}
		return File(Arena_Export.testing_export(_context).ToArray(), "application/zip", "courses_" + DateTime.UtcNow.ToString("yyyyMMdd") + ".zip");
	}


	[HttpGet("/test/genverify/{table}/{id}")]
	public IActionResult test_genverify(string table, int id)
	{
		if (_context.is_siteadmin() == false) { return Content("Unauthorized to non /Siteadmin", "text/html"); }
		string url = _context.generate_hyperlink_verify(table, id);
		return Content("<a href=\"" + url + "/\">" + url + "</a>", "text/html");
	}

	[HttpGet("/wslog")]
	public async Task<IActionResult> wslog()
	{
		if (_context.is_siteadmin() == false){return Unauthorized("You are not /Siteadmin :(");}
		/*
		log.Information("is_siteadmin: {is_siteadmin}", _context.is_siteadmin());
		log.Information("IsWebSocketRequest: {IsWebSocketRequest}", c.WebSockets.IsWebSocketRequest);
		log.Information("WebSocketRequestedProtocols: {WebSocketRequestedProtocols}", c.WebSockets.WebSocketRequestedProtocols);
		log.Information("IHeaderDictionary: {@IHeaderDictionary}", c.Request.Headers);
		*/
		if (HttpContext.WebSockets.IsWebSocketRequest)
		{
			await Misc.Serilog_WS_Sink.accept_ws(HttpContext);
			return new EmptyResult();
		}
		else
		{
			return BadRequest("WebSocket does not work :(");
		}
	}

}


