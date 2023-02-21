using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;


[ExtendObjectType(typeof(Fileitem))]
public class Fileitem_Extension
{
	public bool has_edge([Parent] Fileitem fileitem, [Service] Arena_Context context, Table t, int id, Relationship relation)
	{
		if (id == 0) {id = context.current_user_id();}
		return DB.has_edge(context.Database.GetDbConnection(), Table.FILEITEMS, fileitem.id, relation, t, id) > 0;
	}
}


[ExtendObjectType(OperationTypeNames.Query)]
public class Fileitem_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Fileitem_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Fileitem> fileitems([Service] Arena_Context context, Record_Status? record_status, int? id)
	{
		IQueryable<Fileitem> q = context.fileitems;
		if (id            != null){q = q.Where(x => x.id == id);}
		if (record_status != null){q = q.Where(x => x.record_status == record_status);}
		return q;
	}

}
