using System;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.EntityFrameworkCore;

namespace Arena;




[ExtendObjectType(OperationTypeNames.Mutation)]
public class Course_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Course_Mutation>();


	public IQueryable<Course> course_add([Service] Arena_Context context, string title, float? credits, DateTime? start_date,
		DateTime? end_date, DateTime? registration_start_date, DateTime? registration_end_date, Studyform? studyform, string required_tools, string prerequisite, string literature, int? level,
		string verbs, string studypace, int? price, int? online, string diplomas, string description, string subtitle,
		string teachers, string bioteachers, string category, string education_provider, string city, string language,
		string link, string name_of_contact_person, string email_of_contact_person, string image_provider, string image_feature, string[] keywords,
		int? seqf,
		int? hours,
		int? hogskolapoang,
		int? yrkeshogskolepoang,
		int? type,
		Record_Status? record_status,
		int? organization_id
		)
	{
		int r; //The number of state entries written to the database.
		int user_id = context.current_user_id(Record_Status.APPROVED);
		if (user_id == 0) {throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}

		// Get the first org from the current user if no organization_id is provided
		if (organization_id == null)
		{
			log.Information("No organization provided. Checking if user belongs to an organization.");
			Organization organization = context.organizations.Where(x => x.organization_user_edges.Any(y => y.user_id == user_id)).FirstOrDefault();
			if (organization == null) { log.Information("No organization found for current user."); }
			else
			{
				organization_id = organization.id;
				log.Information("Found organization with id {id} and name {name} for current user.", organization.id);
			}
		}

		using var transaction = context.Database.BeginTransaction();
		log.Information("Transaction begin for user {id}", user_id);

		Course course = new Course
		{
			title = title,
			category = category,
			education_provider = education_provider,
			credits = credits,
			start_date = start_date,
			end_date = end_date,
			registration_start_date = registration_start_date,
			registration_end_date = registration_end_date,
			studyform = studyform,
			required_tools = required_tools,
			prerequisite = prerequisite,
			literature = literature,
			level = level,
			verbs = verbs,
			studypace = studypace,
			price = price,
			online = online,
			diplomas = diplomas,
			description = description,
			subtitle = subtitle,
			teachers = teachers,
			bioteachers = bioteachers,
			city = city,
			language = language,
			link = link,
			seqf = seqf,
			hours = hours,
			hogskolapoang = hogskolapoang,
			yrkeshogskolepoang = yrkeshogskolepoang,
			type = type,
			name_of_contact_person = name_of_contact_person,
			email_of_contact_person = email_of_contact_person,
			image_provider = Arena_DataURL.refsave_image(context, image_provider, user_id),
			image_feature = Arena_DataURL.refsave_image(context, image_feature, user_id),
			organization_id = organization_id,
			time_created = DateTime.UtcNow,
			record_status = record_status ?? Record_Status.DRAFT,
		};


		context.courses.Add(course);
		r = context.SaveChanges();
		log.Information("Transaction Course {id} added. Entries written: {r}", course.id, r);

		//Experimental search engine feature:
		if (category != null)
		{
			Keyword keyword = new Keyword
			{
				is_category = true,
				name = category
			};
			context.keywords.Add(keyword);
			r = context.SaveChanges();
			log.Information("Transaction Keyword {id} added. Entries written: {r}", keyword.id, r);
			Course_Keyword_Edge edge = new Course_Keyword_Edge
			{
				course_id = course.id,
				keyword_id = keyword.id,
			};
			context.course_keyword_edges.Add(edge);
			r = context.SaveChanges();
			log.Information("Transaction Course_Keyword_Edge {id} added. Entries written: {r}", edge.id, r);
		}

		//Make this user author of this course:
		{
			var edge = new Course_User_Edge
			{
				course_id = course.id,
				user_id = user_id,
				relationship = Relationship.AUTHOR,
			};
			context.course_user_edges.Add(edge);
			r = context.SaveChanges();
			log.Information("Transaction Course_User_Edge {id} added. Entries written: {r}", edge.id, r);
		}

		if (organization_id != null)
		{
			//Make the provided/found organization author of this course:
			var edge = new Organization_Course_Edge
			{
				course_id = course.id,
				organization_id = organization_id.Value,
				relationship = Relationship.AUTHOR,
			};
			context.organization_course_edges.Add(edge);
			r = context.SaveChanges();
			log.Information("Transaction Organization_Course_Edge {id} added. Entries written: {r}", edge.id, r);
		}

		transaction.Commit();
		log.Information("Transaction commited");

		return context.courses.Where(t => t.id == course.id);
	}
	
	
	[HotChocolate.Data.UseFirstOrDefault]
	public IQueryable<Course> course_copy([Service] Arena_Context context, int id)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false)
		{
			int has_edge = DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user_id, Relationship.AUTHOR, Table.COURSES, id);
			if (has_edge <= 0){throw HCExceptions.e(Primitive_Result.MISSING_OWNERSHIP);}
		}
		Course course = context.courses.FirstOrDefault(t => t.id == id);
		if (course == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		course.id = 0;
		context.courses.Add(course);
		context.SaveChanges();
		return context.courses.Where(x => x.id == course.id);
	}


	public IQueryable<Course> courses_update([Service] Arena_Context context, string title, float? credits, DateTime? start_date,
		DateTime? end_date, DateTime? registration_start_date, DateTime? registration_end_date, Studyform? studyform, string required_tools, string prerequisite, string literature, int? level,
		string verbs, string studypace, int? price, int? online, string diplomas, string description, string subtitle,
		string teachers, string bioteachers, string category, string education_provider, string city, string language,
		string link, string name_of_contact_person, string email_of_contact_person, string image_provider, string image_feature, string[] keywords,
		int? seqf, int? hours, int? hogskolapoang, int? yrkeshogskolepoang, int? type, Record_Status? record_status, int? organization_id, int id)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false)
		{
			int has_edge = DB.has_edge(context.Database.GetDbConnection(), Table.USERS, user_id, Relationship.AUTHOR, Table.COURSES, id);
			if (has_edge <= 0){throw HCExceptions.e(Primitive_Result.MISSING_OWNERSHIP);}
		}
		Course course = context.courses.FirstOrDefault(t => t.id == id);
		if (course == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (title != null){course.title = title;}
		if (credits != null){course.credits = credits;}
		if (start_date != null){course.start_date = start_date;}
		if (end_date != null){course.end_date = end_date;}
		if (registration_start_date != null){course.registration_start_date = registration_start_date;}
		if (registration_end_date != null){course.registration_end_date = registration_end_date;}
		if (studyform != null){course.studyform = studyform;}
		if (required_tools != null){course.required_tools = required_tools;}
		if (prerequisite != null){course.prerequisite = prerequisite;}
		if (literature != null){course.literature = literature;}
		if (level != null){course.level = level;}
		if (verbs != null){course.verbs = verbs;}
		if (studypace != null){course.studypace = studypace;}
		if (price != null){course.price = price;}
		if (online != null){course.online = online;}
		if (diplomas != null){course.diplomas = diplomas;}
		if (description != null){course.description = description;}
		if (subtitle != null){course.subtitle = subtitle;}
		if (teachers != null){course.teachers = teachers;}
		if (bioteachers != null){course.bioteachers = bioteachers;}
		if (category != null){course.category = category;}
		if (education_provider != null){course.education_provider = education_provider;}
		if (city != null){course.city = city;}
		if (language != null){course.language = language;}
		if (link != null){course.link = link;}
		if (seqf != null){course.seqf = seqf;}
		if (hours != null){course.hours = hours;}
		if (hogskolapoang != null){course.hogskolapoang = hogskolapoang;}
		if (yrkeshogskolepoang != null){course.yrkeshogskolepoang = yrkeshogskolepoang;}
		if (type != null){course.type = type;}
		if (name_of_contact_person != null){course.name_of_contact_person = name_of_contact_person;}
		if (email_of_contact_person != null){course.email_of_contact_person = email_of_contact_person;}
		if (organization_id != null){course.organization_id = organization_id;}
		// Use image file if image string is "data:image" :
		if (image_provider != null){course.image_provider = Arena_DataURL.refsave_image(context, image_provider, user_id);}
		if (image_feature != null){course.image_feature = Arena_DataURL.refsave_image(context, image_feature, user_id);}
		if (record_status != null){course.record_status = (Record_Status)record_status;}
		//Autogenerated fields values:
		course.time_modified = DateTime.UtcNow;
		context.courses.Update(course);
		context.SaveChanges();
		return context.courses.Where(x => x.id == course.id);
	}


	//Temporary function to convert base64 to image files.
	public Course convert_image_course([Service] Arena_Context context, int id)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		Course course = context.courses.FirstOrDefault(t => t.id == id);
		if (course == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		using var transaction = context.Database.BeginTransaction();
		course.image_provider = Arena_DataURL.refsave_image(context, course.image_provider, user_id);
		course.image_feature = Arena_DataURL.refsave_image(context, course.image_feature, user_id);
		context.courses.Update(course);
		context.SaveChanges();
		transaction.Commit();
		return course;
	}

	public int convert_image_courses([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		using var transaction = context.Database.BeginTransaction();
		var courses = context.courses.ToList();
		foreach(Course course in courses)
		{
			int user_id = context.course_user_edges.Where(x => (x.course_id == course.id) && (x.relationship == Relationship.AUTHOR)).Select(x => x.user_id).FirstOrDefault();
			log.Information("Found author {user_id}", user_id);
			course.image_provider = Arena_DataURL.refsave_image(context, course.image_provider, user_id);
			course.image_feature = Arena_DataURL.refsave_image(context, course.image_feature, user_id);
			//course.image_company_logo = Arena_DataURL.refsave_image(context, course.image_company_logo, user_id);
			//course.image_teacher = Arena_DataURL.refsave_image(context, course.image_teacher, user_id);
			//course.image_course_banner = Arena_DataURL.refsave_image(context, course.image_course_banner, user_id);
			context.courses.Update(course);
		}
		context.SaveChanges();
		transaction.Commit();
		return 0;
	}

	public int courses_generated_empty([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false) { return -1; }
		var r = context.courses.Where(x => (x.record_status == Record_Status.GENERATED));
		int count = r.Count();
		context.courses.RemoveRange(r);
		context.SaveChanges();
		return count;
	}

	public int courses_rubbish_empty([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false) { return -1; }
		var r = context.courses.Where(x => (x.record_status == Record_Status.RUBBISH));
		int count = r.Count();
		context.courses.RemoveRange(r);
		context.SaveChanges();
		return count;
	}

	public int courses_cleanup([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false) { return -1; }

		return Arena_Mgmnt.courses_cleanup(context);
	}

	public bool quotation_request([Service] Arena_Context context, int course_id, string request_message_value, bool check)
	{
		bool success = Arena_Email.send_quotation_request(context, course_id, request_message_value, check);
		return success;
	}


}
