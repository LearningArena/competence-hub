using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;


[ExtendObjectType(typeof(Keyword))]
public class Keyword_Extension
{
	private readonly Serilog.ILogger log = Log.ForContext<Keyword_Extension>();
	public bool has_edge([Parent] Keyword keyword, [Service] Arena_Context context, Table t, int id, Relationship relation)
	{
		if (id == 0) {id = context.current_user_id();}
		return DB.has_edge(context.Database.GetDbConnection(), Table.KEYWORDS, keyword.id, relation, t, id) > 0;
	}
}


[ExtendObjectType(OperationTypeNames.Query)]
public class Keyword_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Keyword_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Keyword> keywords([Service] Arena_Context context, Record_Status? record_status, int? id)
	{
		IQueryable<Keyword> q = context.keywords;
		if (id != null){q = q.Where(x => x.id == id);}
		if (record_status != null){q = q.Where(x => x.record_status == record_status);}
		return q;
	}


}
