using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;

using System.Security.Claims;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Query)]
public class Extpoint_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Extpoint_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseProjection]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Extpoint> extpoints([Service] Arena_Context context, Record_Status? record_status, int? id)
	{
		IQueryable<Extpoint> q = context.extpoints;
		if (context.is_siteadmin() == false)
		{
			int user_id = context.current_user_id();
			if (user_id == Arena.USER_ID_GUEST)
			{
				//Guest:
				//Pass filter courses are only approved for guest:
				record_status = Record_Status.APPROVED;
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
		return q;
	}



}
