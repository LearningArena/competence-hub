/**************************
This file will probably be removed.

Routes:
	/dbview/table
	/dbview/table/{tablename}
	/dbview/column


**************************/

using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Arena;



public class Controller_dbview : Controller
{
	private readonly Serilog.ILogger log = Log.ForContext<Controller_dbview>();
	private readonly Arena_Context _context;
	public Controller_dbview(Arena_Context context)
	{
		_context = context;
	}

	[HttpGet("/dbview/table")]
	public IActionResult tables()
	{
		if (_context.is_siteadmin() == false){return Unauthorized();}
		var t = _context.Database.GetDbConnection().GetSchema("Tables");
		return Content(Misc.HTML_DataTable.create_table(t), "text/html");
	}


	[HttpGet("/dbview/table/{tablename}")]
	public IActionResult table(String tablename)
	{
		if (_context.is_siteadmin() == false){return Unauthorized();}
		var t = DB.export_table(_context, "SELECT * FROM \"" + tablename + "\"");
		return Content(Misc.HTML_DataTable.create_table(t), "text/html");
	}


	[HttpGet("/dbview/column")]
	public IActionResult columns()
	{
		if (_context.is_siteadmin() == false){return Unauthorized();}
		string fields = "table_name,column_name,is_nullable,data_type,character_octet_length,udt_name,is_identity";
		string db = Environment.GetEnvironmentVariable("POSTGRES_DB");
		var t = DB.export_table(_context, "SELECT " + fields + " FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = '" + db + "' and table_schema = 'public' ORDER BY table_name");
		//var t = DB.export_table(_context, "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = 'postgres' and table_schema = 'public' ORDER BY table_name");
		return Content(Misc.HTML_DataTable.create_table(t), "text/html");
	}

}


