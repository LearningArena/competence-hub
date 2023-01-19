using System;
using System.Linq;

using HotChocolate;
using HotChocolate.Types;

using Serilog;

namespace Arena;


[ExtendObjectType(OperationTypeNames.Query)]
public class Course_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Course_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseProjection]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Course> courses([Service] Arena_Context context, Record_Status? record_status, int? id, int[] keywords, Relationship? current_user_relationship)
	{
		IQueryable<Course> q = context.courses;
		if (context.is_siteadmin() == false)
		{
			int user_id = context.current_user_id();
			if (user_id == Arena.USER_ID_GUEST)
			{
				//Guest:
				//Pass filter courses are only approved for guest:
				record_status = Record_Status.APPROVED;
			}
			else
			{
				//Logged in non admin:
				//Pass filter courses that has you as AUHTOR or MEMBER:
				Relationship[] r = {Relationship.AUTHOR, Relationship.MEMBER};
				q = q.Where(x => (x.record_status == Record_Status.APPROVED) || x.course_user_edges.Any(y => y.user_id == user_id && r.Contains(y.relationship)));
			}
		}
		if (id != null)
		{
			//Pass filter courses by id:
			q = q.Where(x => x.id == id);
			context.increment_views(Table.COURSES, (int)id);
		}
		if (record_status != null)
		{
			//Pass filter courses by record_status:
			q = q.Where(x => x.record_status == record_status);
		}
		if (keywords != null)
		{
			//Pass filter courses by keywords:
			q = q.Where(x => x.course_keyword_edges.Where(y => keywords.Contains(y.keyword_id)).Count() == keywords.Length );
		}
		if (current_user_relationship != null)
		{
			//Pass filter for e.g. being AUTHOR or MEMBER of courses
			int user_id = context.current_user_id(Record_Status.APPROVED);
			q = q.Where(x => x.course_user_edges.Any(y => y.relationship == current_user_relationship && y.user_id == user_id));
		}
		return q;
	}

	[HotChocolate.Types.UseOffsetPaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseProjection]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Course> courses_offset([Service] Arena_Context context, Record_Status? record_status, int? id, int[] keywords, Relationship? current_user_relationship)
	{
		return courses(context, record_status, id, keywords, current_user_relationship);
	}

	public IQueryable<string> course_providers([Service] Arena_Context context, Record_Status? record_Status)
	{
		IQueryable<string> q = context.courses
			.Where(x => x.record_status == record_Status)
			.Select(x => x.education_provider)
			.Distinct();
		return q;
	}

	public IQueryable<string> course_locations([Service] Arena_Context context, Record_Status? record_Status)
	{
		IQueryable<string> q = context.courses
			.Where(x => x.record_status == record_Status)
			.Select(x => x.city)
			.Distinct();
		return q;
	}
}
