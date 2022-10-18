using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Query)]
public class Record_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Record_Query>();

	public bool has_edge([Service] Arena_Context context, Table t1, int id1, Relationship relation, Table t2, int id2)
	{
		if ((t1 == Table.USERS) && (id1 == 0))
		{
			id1 = context.current_user_id();
		}
		if ((t2 == Table.USERS) && (id2 == 0))
		{
			id2 = context.current_user_id();
		}
		if(id1 <= 0) {return false;}
		if(id2 <= 0) {return false;}
		return DB.has_edge(context.Database.GetDbConnection(), t1, id1, relation, t2, id2) > 0;
	}

}