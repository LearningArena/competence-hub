using System.Data;
using System.Data.Common;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

using Serilog;

using System.Collections.Generic;
using Npgsql;
using System;

//https://www.codeproject.com/Articles/5263745/Return-DataTable-Using-Entity-Framework

namespace Arena;


public static class DB
{
	private static readonly ILogger log = Log.ForContext(typeof(DB));
	
	public static DataTable export_table(this DbContext context, string sqlQuery, params DbParameter[] parameters)
	{
		DataTable dataTable = new DataTable();
		DbConnection connection = context.Database.GetDbConnection();
		DbProviderFactory dbFactory = DbProviderFactories.GetFactory(connection);
		using (var cmd = dbFactory.CreateCommand())
		{
			cmd.Connection = connection;
			cmd.CommandType = CommandType.Text;
			cmd.CommandText = sqlQuery;
			if (parameters != null)
			{
				foreach (var item in parameters)
				{
					cmd.Parameters.Add(item);
				}
			}
			using (DbDataAdapter adapter = dbFactory.CreateDataAdapter())
			{
				adapter.SelectCommand = cmd;
				adapter.Fill(dataTable);
			}
		}
		return dataTable;
	}



	public static void init(IApplicationBuilder app)
	{
		using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
		{
			var context = serviceScope.ServiceProvider.GetRequiredService<Arena_Context>();
			context.Database.Migrate();
			//Testing.db_add_example(context);
		}
	}







	/*
	public static int record_update1(NpgsqlConnection conn, int user_id, Table table, int id, Dictionary<Column, string> values)
	{
		int n = 0;
		using var cmd = new NpgsqlCommand();
		cmd.Connection = conn;
		cmd.CommandType = CommandType.Text;

		
		cmd.Parameters.Add(new NpgsqlParameter("time_modified", DateTime.UtcNow));
		string qparams = "time_modified = @time_modified";
		foreach (KeyValuePair<Column, string> kv in values)
		{
			string c = Columnf.str(kv.Key);
			cmd.Parameters.Add(new NpgsqlParameter(c, kv.Value));
			qparams += $", {c} = @{c}";
		}
		
		string t1 = Tablef.str(table);
		string q = $"UPDATE {t1} T1 SET {qparams} WHERE id = @id ";
		cmd.Parameters.Add(new NpgsqlParameter("id", id));

		// If user_id is provided then that user must have onwership of the record being updated:
		if (user_id > 0)
		{
			string t2 = Tablef.str(table, Table.USERS);
			string c1 = Tablef.str_singular(table) + "_id";
			cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));
			cmd.Parameters.Add(new NpgsqlParameter("relationship", (int)Relationship.AUTHOR));
			q += $"AND EXISTS(SELECT 1 FROM {t2} T2 WHERE {c1} = T1.id AND user_id = @user_id AND relationship = @relationship LIMIT 1)";
		}
		

		cmd.CommandText = q;
		cmd.Connection.Open();
		n = cmd.ExecuteNonQuery();
		cmd.Connection.Close();
		log.Information("record_update({user_id}, {table}, {id}): N = {n}, Q = {q}", user_id, table, id, n, q);
		return n;
	}
	*/



	// Experimental generic update function:
	public static int record_update(NpgsqlConnection conn, int user_id, Table table, int id, Dictionary<string,string> val_str, Dictionary<string,int> val_int)
	{
		// Blocks SQL injections:
		string t1 = Tablef.str(table);
		if (t1 == null) {return -1;}

		int n = 0;
		using var cmd = new NpgsqlCommand();
		cmd.Connection = conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("time_modified", DateTime.UtcNow));
		string qparams = "time_modified = @time_modified";

		if (val_str != null)
		{
			foreach (KeyValuePair<string, string> c in val_str)
			{
				if (Columns.p.ContainsKey(c.Key) == false) 
				{
					throw new Exception("Column not allowed");
				}
				cmd.Parameters.Add(new NpgsqlParameter(c.Key, c.Value));
				qparams += $", {c.Key} = @{c.Key}";
			}
		}

		if (val_int != null)
		{
			foreach (KeyValuePair<string, int> c in val_int)
			{
				if (Columns.p.ContainsKey(c.Key) == false) 
				{
					throw new Exception("Column not allowed");
				}
				cmd.Parameters.Add(new NpgsqlParameter(c.Key, c.Value));
				qparams += $", {c.Key} = @{c.Key}";
			}
		}

		string q = $"UPDATE {t1} T1 SET {qparams} WHERE id = @id ";
		cmd.Parameters.Add(new NpgsqlParameter("id", id));

		// If user_id is provided then that user must have onwership of the record being updated:
		if (user_id > 0)
		{
			string t2 = Tablef.str(table, Table.USERS);
			string c1 = Tablef.str_singular(table) + "_id";
			cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));
			cmd.Parameters.Add(new NpgsqlParameter("relationship", (int)Relationship.AUTHOR));
			q += $"AND EXISTS(SELECT 1 FROM {t2} T2 WHERE {c1} = T1.id AND user_id = @user_id AND relationship = @relationship LIMIT 1)";
		}
		

		cmd.CommandText = q;
		cmd.Connection.Open();
		n = cmd.ExecuteNonQuery();
		cmd.Connection.Close();
		log.Information("record_update({user_id}, {table}, {id}): N = {n}, Q = {q}", user_id, table, id, n, q);
		return n;
	}



	static public int pair(DbConnection conn, int user_id, Table t1, int id1, Relationship relation, Table t2, int id2, Relationship restriction)
	{
		// Special case for user_id FAVORITE
		if (relation == Relationship.FAVORITE)
		{
			if ((t1 == Table.USERS) && (id1 == 0)){restriction = Relationship.UNKNOWN;}
			if ((t2 == Table.USERS) && (id2 == 0)){restriction = Relationship.UNKNOWN;}
		}
		if (id1 == 0) {id1 = user_id;}
		if (id2 == 0) {id2 = user_id;}

		int n = 0;
		// This prevents duplicates.
		// TODO: Enable SQL UNIQUE for (id1,r,id2)
		n = DB.has_edge(conn, t1, id1, relation, t2, id2);
		if (n < 0) {return n;}
		if (n > 0) {return n;}
		
		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("id1", id1));
		cmd.Parameters.Add(new NpgsqlParameter("id2", id2));
		cmd.Parameters.Add(new NpgsqlParameter("r", (int)relation));
		cmd.Parameters.Add(new NpgsqlParameter("r1", (int)restriction));
		cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));

		string e = Tablef.str(t1,t2);
		if (e == null) {return - 1;}
		string c1 = Tablef.str_singular(t1) + "_id";
		if (c1 == null) {return - 1;}
		string c2 = Tablef.str_singular(t2) + "_id";
		if (c2 == null) {return - 1;}

		if (restriction == Relationship.UNKNOWN)
		{
			// Pair without restriction:
			cmd.CommandText = $"INSERT INTO {e} ({c1},{c2}, relationship) VALUES (@id1, @id2, @r)";
		}
		else
		{
			// Begin conditional SQL query:
			cmd.CommandText = $"INSERT INTO {e} ({c1},{c2}, relationship) SELECT @id1, @id2, @r";
			if (t1 == Table.USERS)
			{
				// Make sure the (user_id) is AUTHOR of (t1) or (t2):
				cmd.CommandText += $" WHERE EXISTS(SELECT 1 FROM {e} WHERE {c1} = @user_id AND relationship = @r1 AND {c2} = @id2)";
			}
			else if (t2 == Table.USERS)
			{
				// Make sure the (user_id) is AUTHOR of (t1) or (t2):
				cmd.CommandText += $" WHERE EXISTS(SELECT 1 FROM {e} WHERE {c2} = @user_id AND relationship = @r1 AND {c1} = @id1)";
			}
			else
			{
				// Make sure the (user_id) is AUTHOR of both (t1) and (t2)
				// TODO: Test this:
				string e1 = Tablef.str(Table.USERS, t1);
				string e2 = Tablef.str(Table.USERS, t2);
				cmd.CommandText += $" WHERE EXISTS(SELECT 1 FROM {e1} WHERE user_id = @user_id AND relationship = @r1)";
				cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e2} WHERE user_id = @user_id AND relationship = @r1)";
			}
		}

		cmd.Connection.Open();
		try{n = cmd.ExecuteNonQuery();}catch{}
		cmd.Connection.Close();
		log.Information("Pairing {t1} {id1} {relation} {t2} {id2}. query={CommandText}, n={n}", t1, id1, relation, t2, id2, cmd.CommandText, n);
		return n;
	}



	static public int unpair(DbConnection conn, int user_id, Table t1, int id1, Relationship relation, Table t2, int id2, Relationship restriction)
	{
		// Special case for user_id FAVORITE
		if (relation == Relationship.FAVORITE)
		{
			if ((t1 == Table.USERS) && (id1 == 0)){restriction = Relationship.UNKNOWN;}
			if ((t2 == Table.USERS) && (id2 == 0)){restriction = Relationship.UNKNOWN;}
		}
		if (id1 == 0) {id1 = user_id;}
		if (id2 == 0) {id2 = user_id;}

		int n = 0;
		n = DB.has_edge(conn, t1, id1, relation, t2, id2);
		if (n < 0) {return n;}
		if (n == 0) {return 1;}

		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("id1", id1));
		cmd.Parameters.Add(new NpgsqlParameter("id2", id2));
		cmd.Parameters.Add(new NpgsqlParameter("r", (int)relation));
		cmd.Parameters.Add(new NpgsqlParameter("r1", (int)Relationship.AUTHOR));
		cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));

		string e = Tablef.str(t1,t2);
		if (e == null) {return - 1;}
		string c1 = Tablef.str_singular(t1) + "_id";
		if (c1 == null) {return - 1;}
		string c2 = Tablef.str_singular(t2) + "_id";
		if (c2 == null) {return - 1;}

		if (restriction == Relationship.UNKNOWN)
		{
			// Unpair without restriction:
			cmd.CommandText = $"DELETE FROM {e} WHERE {c1} = @id1 AND {c2} = @id2 AND relationship = @r";
		}
		else if (t1 == Table.USERS)
		{
			// Make sure the (user_id) is AUTHOR of (t1) or (t2):
			cmd.CommandText = $"DELETE FROM {e} WHERE {c1} = @id1 AND {c2} = @id2 AND relationship = @r";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e} WHERE {c1} = @user_id AND relationship = @r1 AND {c2} = @id2)";
		}
		else if (t2 == Table.USERS)
		{
			// Make sure the (user_id) is AUTHOR of (t1) or (t2):
			cmd.CommandText = $"DELETE FROM {e} WHERE {c1} = @id1 AND {c2} = @id2 AND relationship = @r";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e} WHERE {c2} = @user_id AND relationship = @r1 AND {c1} = @id1)";
		}
		else
		{
			// Make sure the (user_id) is AUTHOR of both (t1) and (t2)
			// TODO: Test this:
			string e1 = Tablef.str(Table.USERS, t1);
			string e2 = Tablef.str(Table.USERS, t2);
			cmd.CommandText = $"DELETE FROM {e} WHERE {c1} = @id1 AND {c2} = @id2 AND relationship = @r";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e1} WHERE user_id = @user_id AND relationship = @r1 AND {c1} = @id1)";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e2} WHERE user_id = @user_id AND relationship = @r1 AND {c2} = @id2)";
		}
		cmd.Connection.Open();
		try{n = cmd.ExecuteNonQuery();}catch{}
		cmd.Connection.Close();
		log.Information("Unpairing {t1} {id1} {relation} {t2} {id2}. query={CommandText}, n={n}", t1, id1, relation, t2, id2, cmd.CommandText, n);
		return n;
	}


	public static int set_record_status(DbConnection conn, int user_id, Table table, int id, Record_Status record_status, Relationship restriction)
	{
		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("s", (int)record_status));
		cmd.Parameters.Add(new NpgsqlParameter("id", id));
		cmd.Parameters.Add(new NpgsqlParameter("r1", (int)restriction));
		cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));
		cmd.Parameters.Add(new NpgsqlParameter("approved", (int)Record_Status.APPROVED));
		string t = Tablef.str(table);
		if (restriction == Relationship.UNKNOWN)
		{
			// UPDATE without restriction:
			cmd.CommandText = $"UPDATE {t} SET record_status = @s WHERE id = @id";
		}
		else
		{
			// Criterias for changing record_status of a record:
			// Criteria 1: User (user_id) must have a specific relation (r1) to record (table,id).
			// Criteria 2: User must be approved.
			string e = Tablef.str(table, Table.USERS);
			string c = Tablef.str_singular(table) + "_id";
			string u = Tablef.str(Table.USERS);
			cmd.CommandText = $"UPDATE {t} SET record_status = @s WHERE id = @id";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e} WHERE {c} = @id AND user_id = @user_id AND relationship = @r1)";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {u} WHERE id = @user_id AND record_status = @approved)";
		}
		int n = 0;
		cmd.Connection.Open();
		try{n = cmd.ExecuteNonQuery();}catch{}
		cmd.Connection.Close();
		log.Information("User {user_id}: {@Table}({id}).record_status := {@Record_Status}, query={CommandText}, n={n}", user_id, table, id, record_status, cmd.CommandText, n);
		return n;
	}


	public static int record_delete(DbConnection conn, int user_id, Table table, int id, Relationship restriction)
	{
		if (table == Table.USERS){return 0;}
		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("id", id));
		cmd.Parameters.Add(new NpgsqlParameter("r1", (int)restriction));
		cmd.Parameters.Add(new NpgsqlParameter("user_id", user_id));
		cmd.Parameters.Add(new NpgsqlParameter("RUBBISH", (int)Record_Status.RUBBISH));
		string t = Tablef.str(table);
		if (restriction == Relationship.UNKNOWN)
		{
			// This branch can be used by admin users. 
			// Simply pass restriction as UNKNOWN to bypass onwership requriement.
			// DELETE without restriction:
			cmd.CommandText = $"DELETE FROM {t} WHERE id = @id AND record_status = @RUBBISH";
		}
		else
		{
			// Criterias for deleting a record:
			// Criteria 1: User (user_id) must have a specific relation (restriction) to record (table,id).
			string e = Tablef.str(table, Table.USERS);
			string c = Tablef.str_singular(table) + "_id";
			cmd.CommandText = $"DELETE FROM {t} WHERE id = @id AND record_status = @RUBBISH";
			cmd.CommandText += $" AND EXISTS(SELECT 1 FROM {e} WHERE {c} = @id AND user_id = @user_id AND relationship = @r1)";
		}
		int n = 0;
		cmd.Connection.Open();
		try{n = cmd.ExecuteNonQuery();}catch{}
		cmd.Connection.Close();
		log.Information("User {user_id}: DELETE {@Table}({id}), query={CommandText}, n={n}", user_id, table, id, cmd.CommandText, n);
		return n;
	}




	//https://stackoverflow.com/questions/14770092/returning-1-or-0-in-specific-sql-query
	static public int has_edge(DbConnection conn, Table t1, int id1, Relationship relation, Table t2, int id2)
	{
		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("id1", id1));
		cmd.Parameters.Add(new NpgsqlParameter("id2", id2));
		cmd.Parameters.Add(new NpgsqlParameter("r", (int)relation));
		string e = Tablef.str(t1, t2);
		if (e == null) {return - 1;}
		string c1 = Tablef.str_singular(t1) + "_id";
		if (c1 == null) {return - 1;}
		string c2 = Tablef.str_singular(t2) + "_id";
		if (c2 == null) {return - 1;}
		cmd.CommandText = $"SELECT 1 FROM {e} WHERE {c1} = @id1 AND {c2} = @id2 AND relationship = @r";
		cmd.Connection.Open();
		int n = (int?)cmd.ExecuteScalar() ?? 0;
		cmd.Connection.Close();
		log.Information("query={CommandText}, n={n}", cmd.CommandText, n);
		return n;
	}



	// Temporary code begin:
	public static int execute(DbConnection conn, string q)
	{
		int n = 0;
		using var cmd = new NpgsqlCommand();
		cmd.Connection = (NpgsqlConnection)conn;
		cmd.CommandType = CommandType.Text;
		cmd.Parameters.Add(new NpgsqlParameter("now", DateTime.UtcNow));
		cmd.CommandText = q;
		cmd.Connection.Open();
		n = cmd.ExecuteNonQuery();
		cmd.Connection.Close();
		log.Information("q=({q}), n=({n}) ", q, n);
		return n;
	}

	public static int set_all_timestamps(DbConnection conn)
	{
		int n = 0;
		try{n = execute(conn, $"UPDATE users SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE users SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE courses SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE courses SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE inquiries SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE inquiries SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE organizations SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE organizations SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE fileitems SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE fileitems SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE keywords SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE keywords SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE tempusers SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE tempusers SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE languages SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE languages SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE contents SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE contents SET time_modified = @now");}catch{}
		try{n = execute(conn, $"UPDATE extpoints SET time_created = @now");}catch{}
		try{n = execute(conn, $"UPDATE extpoints SET time_modified = @now");}catch{}
		return n;
	}
	// Temporary code end.







}
