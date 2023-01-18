using System;
using System.Data;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;



[ExtendObjectType(OperationTypeNames.Mutation)]
public class Organization_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Organization_Mutation>();

	[HotChocolate.Data.UseProjection]
	public IQueryable<Organization> organizations_update([Service] Arena_Context context, int id, string name, string address, string image_logo, string description, string phonenumber, string website, string email)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false)
		{
			int has_edge = DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user_id, Relationship.AUTHOR, Table.ORGANIZATIONS, id);
			if (has_edge <= 0){throw HCExceptions.e(Primitive_Result.MISSING_OWNERSHIP);}
		}
		Organization organization = context.organizations.FirstOrDefault(t => t.id == id);
		if (organization == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (name != null){organization.name = name;}
		if (address != null){organization.address = address;}
		if (image_logo != null){organization.image_logo = image_logo;}
		if (description != null){organization.description = description;}
		if (phonenumber != null){organization.phonenumber = phonenumber;}
		if (website != null){organization.website = website;}
		if (email != null){organization.email = email;}
		organization.time_modified = DateTime.UtcNow;
		context.SaveChanges();
		return context.organizations.Where(x => x.id == id);
	}


	[HotChocolate.Data.UseProjection]
	public IQueryable<Organization> organizations_add([Service] Arena_Context context, string orgid, string name, string address, string image_logo, string description, string phonenumber, string website, string email)
	{
		int user_id = context.current_user_id(Record_Status.APPROVED);
		if (user_id == 0) {throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		//if (Arena_Stringstandard.check_organisationsnummer.IsMatch(orgid) == false) { return null; }
		Organization o = new Organization
		{
			orgid = orgid,
			name = name,
			address = address,
			image_logo = image_logo,
			description = description,
			phonenumber = phonenumber,
			website = website,
			email = email,
			time_created = DateTime.UtcNow
		};
		context.organizations.Add(o);
		context.SaveChanges();
		Organization_User_Edge e = new Organization_User_Edge
		{
			organization_id = o.id,
			user_id = user_id,
			relationship = Relationship.AUTHOR,
		};
		context.organization_user_edges.Add(e);
		context.SaveChanges();
		return context.organizations.Where(x => x.id == o.id);
	}

}
