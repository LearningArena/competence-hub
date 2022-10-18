using System;
using System.Linq;
using System.Data;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;


namespace Arena;



[ExtendObjectType(OperationTypeNames.Mutation)]
public class Fileitem_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Fileitem_Mutation>();

	[HotChocolate.Data.UseProjection]
	public IQueryable<Fileitem> fileitems_update([Service] Arena_Context context, int id, string name)
	{
		int user_id = context.current_user_id();
		if (user_id <= 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false)
		{
			int has_edge = DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user_id, Relationship.AUTHOR, Table.FILEITEMS, id);
			if (has_edge <= 0){throw HCExceptions.e(Primitive_Result.MISSING_OWNERSHIP);}
		}
		Fileitem fileitem = context.fileitems.FirstOrDefault(t => t.id == id);
		if (fileitem == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (name != null) { fileitem.name = name; }
		fileitem.time_modified = DateTime.UtcNow;
		context.fileitems.Update(fileitem);
		context.SaveChanges();
		return context.fileitems.Where(x => x.id == id);
	}


	[HotChocolate.Data.UseProjection]
	public IQueryable<Fileitem> fileitems_add([Service] Arena_Context context, string name)
	{
		if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		Fileitem fileitem = new Fileitem
		{
			record_status = Record_Status.DRAFT,
			name = name,
			time_created = DateTime.UtcNow
		};
		context.fileitems.Add(fileitem);
		context.SaveChanges();
		return context.fileitems.Where(x => x.id == fileitem.id);
	}

}
