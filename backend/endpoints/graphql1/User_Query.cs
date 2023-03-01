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
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<User> users([Service] Arena_Context context)
	{
		if(context.current_user_id() == Arena.USER_ID_GUEST)
		{
			return null;
		}
		Record_Status? record_status = null;
		if (context.is_siteadmin() == false)
		{
			record_status = Record_Status.APPROVED;
		}
		IQueryable<User> q = context.users;
		if (record_status != null)
		{
			q = q.Where(x => x.record_status == record_status);
		}
		return q;
	}


	public IQueryable<User> user_current([Service] Arena_Context context) => context.user_current();
	public IQueryable<User> user_impostor([Service] Arena_Context context) => context.user_current_impostor();

}
