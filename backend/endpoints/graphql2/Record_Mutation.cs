using System.Linq;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Npgsql;

namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Record_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Record_Mutation>();

	public int record_remove_unsafe([Service] Arena_Context context, Table table, int id)
	{
		int user_id = context.current_user_id();
		NpgsqlConnection conn = (NpgsqlConnection)context.Database.GetDbConnection();
		Relationship restriction = context.is_siteadmin() ? Relationship.UNKNOWN : Relationship.AUTHOR;
		int n = 0;
		n = record_set_status(context, table, id, Record_Status.RUBBISH);
		if (n <= 0) {return 0;}
		n = DB.record_delete(conn, user_id, table, id, restriction);
		return n;
	}

	public int record_remove([Service] Arena_Context context, Table table, int id)
	{
		int user_id = context.current_user_id();
		NpgsqlConnection conn = (NpgsqlConnection)context.Database.GetDbConnection();
		Relationship restriction = context.is_siteadmin() ? Relationship.UNKNOWN : Relationship.AUTHOR;
		int n = DB.record_delete(conn, user_id, table, id, restriction);
		return n;
	}

	public int record_set_status([Service] Arena_Context context, Table table, int id, Record_Status record_status)
	{
		int user_id = context.current_user_id();
		NpgsqlConnection conn = (NpgsqlConnection)context.Database.GetDbConnection();
		Relationship restriction = context.is_siteadmin() ? Relationship.UNKNOWN : Relationship.AUTHOR;
		int n = DB.set_record_status(conn, user_id, table, id, record_status, restriction);
		// Send mail to APPROVED user:
		if ((n > 0) && (table == Table.USERS) && (record_status == Record_Status.APPROVED))
		{
			User user = context.users.Where(x => x.id == id).FirstOrDefault();
			if (new EmailAddressAttribute().IsValid(user.email))
			{
				Arena_Email.send_verify_email(user, record_status);
			}
		}
		return n;
	}




	public int record_update([Service] Arena_Context context, Table table, int[] ids, Dictionary<string,string> val_str, Dictionary<string,int> val_int)
	{
		NpgsqlConnection conn = (NpgsqlConnection)context.Database.GetDbConnection();
		int user_id = -1;
		if(context.is_siteadmin() == false)
		{
			user_id = context.current_user_id();
			if (user_id == 0) {return -1;}
		}
		int r = 0;
		for(int i = 0; i < ids.Length; ++i)
		{
			r += DB.record_update(conn, user_id, table, ids[i], val_str, val_int);
		}
		return r;
	}

	/*
	Example GraphQL mutation:
	mutation
	{
		record_update(table:COURSES,id:88,values:[{key:TITLE,value:"Speaker course"},{key:DESCRIPTION,value:"Speaker design"}])
	}
	public int record_update1([Service] Arena_Context context, Table table, int id, Dictionary<Column, string> values)
	{
		NpgsqlConnection conn = (NpgsqlConnection)context.Database.GetDbConnection();
		int user_id = -1;
		if(context.is_siteadmin() == false)
		{
			user_id = context.current_user_id();
			if (user_id == 0) {return -1;}
		}
		return DB.record_update1(conn, user_id, table, id, values);
	}
	*/


}
