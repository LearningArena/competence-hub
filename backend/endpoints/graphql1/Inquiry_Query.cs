using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena
{

	[ExtendObjectType(typeof(Inquiry))]
	public class Inquiry_Extension
	{
		private readonly Serilog.ILogger log = Log.ForContext<Course_Extension>();
		public bool has_edge([Parent] Inquiry inquiry, [Service] Arena_Context context, Table t, int id, Relationship relation)
		{
			if (id == 0) {id = context.current_user_id();}
			return DB.has_edge(context.Database.GetDbConnection(), Table.INQUIRIES, inquiry.id, relation, t, id) > 0;
		}
	}

	
	[ExtendObjectType(OperationTypeNames.Query)]
	public class Inquiry_Query
	{
		private readonly Serilog.ILogger log = Log.ForContext<Inquiry_Query>();

		[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
		[HotChocolate.Data.UseFiltering]
		[HotChocolate.Data.UseSorting]
		public IQueryable<Inquiry> inquiries([Service] Arena_Context context, Record_Status? record_status, int? id, Relationship? current_user_relationship)
		{
			IQueryable<Inquiry> q = context.inquiries;
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
					q = q.Where(x => (x.record_status == Record_Status.APPROVED) || x.inquiry_user_edges.Any(y => y.user_id == user_id && r.Contains(y.relationship)));
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
			if (current_user_relationship != null)
			{
				//Pass filter for e.g. being AUTHOR or MEMBER of courses
				int user_id = context.current_user_id(Record_Status.APPROVED);
				q = q.Where(x => x.inquiry_user_edges.Any(y => y.relationship == current_user_relationship && y.user_id == user_id));
			}
			return q;
		}




	}
}