using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Pair_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Pair_Mutation>();

	[GraphQLDescription("Idempotent pairing (table,row) to a another (table,row) in specificed relationship. Returns 1 successful.")]
	public int pair([Service] Arena_Context context, Table t1, int id1, Relationship relation, Table t2, int id2)
	{
		int user_id = context.current_user_id();
		if (user_id == 0) { return -1; }
		DbConnection conn = context.Database.GetDbConnection();
		// Setting restriction to Relationship.UNKNOWN disables restriction.
		// Setting restriction to Relationship.AUTHOR enables restriction such that user_id must be a AUTHOR of (t1,id1) and (t2,id2).
		Relationship restriction = context.is_siteadmin() ? Relationship.UNKNOWN : Relationship.AUTHOR;
		int n = DB.pair(conn, user_id, t1, id1, relation, t2, id2, restriction);
		return n;
	}


	[GraphQLDescription("Idempotent unpairing (table,row) to a another (table,row) in specificed relationship. Returns 1 successful.")]
	public int unpair([Service] Arena_Context context, Table t1, int id1, Relationship relation, Table t2, int id2)
	{
		int user_id = context.current_user_id();
		if (user_id == 0) { return -1; }
		DbConnection conn = context.Database.GetDbConnection();
		// Setting restriction to Relationship.UNKNOWN disables restriction.
		// Setting restriction to Relationship.AUTHOR enables restriction such that user_id must be a AUTHOR of (t1,id1) and (t2,id2).
		Relationship restriction = context.is_siteadmin() ? Relationship.UNKNOWN : Relationship.AUTHOR;
		int n = DB.unpair(conn, user_id, t1, id1, relation, t2, id2, restriction);
		return n;
	}



}
