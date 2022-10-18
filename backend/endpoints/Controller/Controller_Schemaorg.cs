/**************************

Routes:
	/schemaorg/organizations/{id}
	/schemaorg/courses/{id}

**************************/



using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Arena;


public class Controller_Schemaorg : Controller
{
	private readonly Serilog.ILogger log = Log.ForContext<Controller_Schemaorg>();
	private readonly Arena_Context _context;
	public Controller_Schemaorg(Arena_Context context)
	{
		_context = context;
	}


	[HttpGet("/schemaorg/organizations/{id}")]
	public IActionResult schemaorg_organization(int id)
	{
		Organization o = _context.organizations.Where(x => x.id == id).FirstOrDefault();
		if (o == null){return NotFound();}
		String json = Schemaorg.Schemaorg.organization_convert(o).ToString();
		return Content(json, "application/json");
	}

	[HttpGet("/schemaorg/courses/{id}")]
	public IActionResult schemaorg_course(int id)
	{
		Course c = _context.courses.Where(x => x.id == id).Include(x => x.organization).Include(x => x.course_keyword_edges).ThenInclude(s => s.keyword).FirstOrDefault();
		if (c == null){return NotFound();}
		String json = Schemaorg.Schemaorg.course_convert(c).ToString();
		return Content(json, "application/json");
	}
}
