using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;


[ExtendObjectType(typeof(User))]
public class User_Extension
{
	public bool has_edge([Parent] User user, [Service] Arena_Context context, Table t, int id, Relationship relation)
	{
		if (id == 0) {id = context.current_user_id();}
		return DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user.id, relation, t, id) > 0;
	}
}

[ExtendObjectType(OperationTypeNames.Query)]
public class User_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<User_Query>();

	
	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseProjection]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<User> users([Service] Arena_Context context, Record_Status? record_status, int? id, string guid)
	{
		if (context.is_siteadmin() == false)
		{
			record_status = Record_Status.APPROVED;
		}
		IQueryable<User> q = context.users;
		if (id != null)
		{
			q = q.Where(x => x.id == id);
		}
		if (record_status != null)
		{
			q = q.Where(x => x.record_status == record_status);
		}
		if (guid != null)
		{
			q = q.Where(x => x.keycloak_guid == Guid.Parse(guid));
		}
		return q;
	}


	public IQueryable<User> user_current([Service] Arena_Context context) => context.user_current();
	public IQueryable<User> user_impostor([Service] Arena_Context context) => context.user_current_impostor();

}
