using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace Arena;




[ExtendObjectType(typeof(Course))]
public class Course_Extension
{
	private readonly Serilog.ILogger log = Log.ForContext<Course_Extension>();

	public bool has_edge([Parent] Course course, [Service] Arena_Context context, Table t, int id, Relationship relation)
	{
		if (id == 0) {id = context.current_user_id();}
		return DB.has_edge(context.Database.GetDbConnection(), Table.COURSES, course.id, relation, t, id) > 0;
	}

	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Fileitem> fileitem_image_company_logo([Parent] Course course, [Service] Arena_Context context)
	{
		return context.fileitems.Where(x => x.path == course.image_company_logo);
	}

	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Fileitem> fileitem_image_course_banner([Parent] Course course, [Service] Arena_Context context)
	{
		return context.fileitems.Where(x => x.path == course.image_course_banner);
	}

	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Fileitem> fileitem_image_teacher([Parent] Course course, [Service] Arena_Context context)
	{
		return context.fileitems.Where(x => x.path == course.image_teacher);
	}

	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Fileitem> fileitem_image_feature([Parent] Course course, [Service] Arena_Context context)
	{
		return context.fileitems.Where(x => x.path == course.image_feature);
	}

	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Fileitem> fileitem_image_provider([Parent] Course course, [Service] Arena_Context context)
	{
		return context.fileitems.Where(x => x.path == course.image_provider);
	}

}
