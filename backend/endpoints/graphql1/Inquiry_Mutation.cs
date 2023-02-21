using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using System.Data;
using Serilog;
using Microsoft.EntityFrameworkCore;


namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Inquiry_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Inquiry_Mutation>();


	public IQueryable<Inquiry> inquiry_add([Service] Arena_Context context, int? target, Record_Status? record_status, DateTime? start_date, DateTime? end_date,
	string title, string description, string category, string name_of_contact_person, string email_of_contact_person, string phonenumber_of_contact_person, string location, string studypace, int? organization_id)
	{
		int r; //The number of state entries written to the database.
		int user_id = context.current_user_id(Record_Status.APPROVED);
		if (user_id == 0) {throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		
		using var transaction = context.Database.BeginTransaction();
		log.Information("Transaction begin for user {id}", user_id);

		Inquiry inquiry = new Inquiry
		{
			target = target ?? 0,
			start_date = start_date,
			end_date = end_date,
			title = title,
			description = description,
			category = category,
			name_of_contact_person = name_of_contact_person,
			email_of_contact_person = email_of_contact_person,
			phonenumber_of_contact_person = phonenumber_of_contact_person,
			location = location,
			studypace = studypace,
			organization_id = organization_id,
			time_created = DateTime.UtcNow,
			record_status = record_status ?? Record_Status.DRAFT,
		};

		context.inquiries.Add(inquiry);
		r = context.SaveChanges();
		log.Information("Transaction Inquiry {id} added. Entrires written: {r}", inquiry.id, r);

		//Make this user author of this inquiry:
		{
			Inquiry_User_Edge edge = new Inquiry_User_Edge
			{
				inquiry_id = inquiry.id,
				user_id = user_id,
				relationship = Relationship.AUTHOR,
			};
			context.inquiry_user_edges.Add(edge);
			r = context.SaveChanges();
			log.Information("Transaction Inquiry_User_Edge {id} added. Entrires written: {r}", edge.id, r);
		}

		transaction.Commit();
		log.Information("Transaction commited");

		return context.inquiries.Where(t => t.id == inquiry.id);
	}


	public IQueryable<Inquiry> inquiries_update([Service] Arena_Context context, int id, int? status, Record_Status? record_status, int? target, DateTime? start_date, DateTime? end_date,
	string title, string description, string category, string name_of_contact_person, string email_of_contact_person, string phonenumber_of_contact_person, string location, string studypace)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false)
		{
			int has_edge = DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user_id, Relationship.AUTHOR, Table.INQUIRIES, id);
			if (has_edge <= 0){throw HCExceptions.e(Primitive_Result.MISSING_OWNERSHIP);}
		}
		Inquiry inquiry = context.inquiries.FirstOrDefault(t => t.id == id);
		if (inquiry == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (target != null) { inquiry.target = target ?? 0; }
		if (start_date != null) { inquiry.start_date = start_date; }
		if (end_date != null) { inquiry.end_date = end_date; }
		if (title != null) { inquiry.title = title; }
		if (description != null) { inquiry.description = description; }
		if (category != null) { inquiry.category = category; }
		if (name_of_contact_person != null) { inquiry.name_of_contact_person = name_of_contact_person; }
		if (email_of_contact_person != null) { inquiry.email_of_contact_person = email_of_contact_person; }
		if (phonenumber_of_contact_person != null) { inquiry.phonenumber_of_contact_person = phonenumber_of_contact_person; }
		if (location != null) { inquiry.location = location; }
		if (studypace != null) { inquiry.studypace = studypace; }
		inquiry.record_status = record_status ?? Record_Status.DRAFT;
		inquiry.time_modified = DateTime.UtcNow;
		context.inquiries.Update(inquiry);
		context.SaveChanges();
		return context.inquiries.Where(x => x.id == id);
	}

}
