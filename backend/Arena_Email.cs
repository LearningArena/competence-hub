using System.Linq;
using System.Threading.Tasks;
using PostmarkDotNet;
using System.Data;
using Serilog;
using System;
using System.IO;

namespace Arena;




public static class Arena_Email
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Email));
	public static PostmarkClient client = null;
	public static string HOST_NAME = "";
	public static string PRODUCT_NAME = "";
	public static string EMAIL_SUPPORT_ADDRESS = "";
	public static string EMAIL_SUPPORT_NAME = "";
	public static string COMPANY_NAME = "";
	public static string COMPANY_ADDRESS = "";
	public static string EMAIL_NOREPLY_ADDRESS = "";
	public static string action_verify_url = "";

	public static int TemplateId_forgot_password_SE = 0;
	public static int TemplateId_forgot_password_GB = 0;
	public static int TemplateId_Quatation_Request_SE = 0;
	public static int TemplateId_Quatation_Request_GB = 0;
	public static int TemplateId_Register_Request_SE = 0;
	public static int TemplateId_Register_Request_GB = 0;
	public static int TemplateId_AccountVerification_SE = 0;
	public static int TemplateId_AccountVerification_EN = 0;
	public static int TemplateId_Copy_quotation_request = 0;
	public static int TemplateId_Welcome_Email_SE = 0;
	public static int TemplateId_Welcome_Email_EN = 0;
	public static int TemplateId_Account_not_verified_SE = 0;
	public static int TemplateId_Account_not_verified_EN = 0;
	public static int TemplateId_System_admin_email = 0;



	public static void get_environment_values()
	{
		Arena_Email.PRODUCT_NAME          = Environment.GetEnvironmentVariable("PRODUCT_NAME");
		Arena_Email.HOST_NAME             = Environment.GetEnvironmentVariable("HOST_NAME");
		Arena_Email.COMPANY_NAME          = Environment.GetEnvironmentVariable("COMPANY_NAME");
		Arena_Email.COMPANY_ADDRESS       = Environment.GetEnvironmentVariable("COMPANY_ADDRESS");
		Arena_Email.EMAIL_SUPPORT_ADDRESS = Environment.GetEnvironmentVariable("EMAIL_SUPPORT_ADDRESS");
		Arena_Email.EMAIL_SUPPORT_NAME    = Environment.GetEnvironmentVariable("EMAIL_SUPPORT_NAME");
		Arena_Email.EMAIL_NOREPLY_ADDRESS = Environment.GetEnvironmentVariable("EMAIL_NOREPLY_ADDRESS");
	}

	public static void init(string token)
	{
		Arena_Email.client = new PostmarkClient(token);
		//TODO: This does not fail even if token is invalid.
	}

	public static bool send(TemplatedPostmarkMessage message)
	{
		// This can fail if token is invalid:
		// Raises if token is invalid:
		// PostmarkDotNet.Exceptions.PostmarkValidationException : The Server Token you provided in the X-Postmark-Server-Token request header was invalid. Please verify that you are using a valid token.
		// TODO: Handle exception here:
		PostmarkResponse result = client.SendMessageAsync(message).Result;
		log.Information("{@PostmarkResponse}", result);
		return result.Status == PostmarkStatus.Success;
	}

	public static bool send_forgot_password_email(Arena_Context context, string email)
	{
		User user = context.users.Where(x => x.email == email).FirstOrDefault();
		log.Information("Found {@user}", user);
		if (user == null) { return false; }
		string host = context.http_context.HttpContext.Request.Host.Value;
		string hyperlink = context.generate_hyperlink_login_from_user(user);
		log.Information("Generated url: host: {host} + loginpath: {hyperlink}", host, hyperlink);
		if (hyperlink == null) { return false; }
		var message = new TemplatedPostmarkMessage();
		message.From = EMAIL_NOREPLY_ADDRESS;
		message.To = email;
		message.TemplateModel = new
		{
			product_url = host,
			product_name = PRODUCT_NAME,
			name = "Name",
			username = email,
			action_reset_password_url = host + hyperlink,
			support_email = EMAIL_SUPPORT_ADDRESS,
			sender_name = EMAIL_SUPPORT_NAME,
			company_name = COMPANY_NAME,
			company_address = host
		};
		switch (user.preference_language)
		{
			case Country_Code_ISO_3166_1.SE:
				message.TemplateId = TemplateId_forgot_password_SE;
				break;
			case Country_Code_ISO_3166_1.GB:
				message.TemplateId = TemplateId_forgot_password_GB;
				break;
			default:
				message.TemplateId = TemplateId_forgot_password_GB;
				break;
		}
		return send(message);
	}


	// Send quotation request to course email_of_contact_person.
	// If check is true then send a email copy to current logged in user.
	public static bool send_quotation_request(Arena_Context context, int course_id, string request_message_value, bool check)
	{
		Course course = context.courses.FirstOrDefault(course => course.id == course_id);
		log.Information("Found {@Course}", course);
		if (course == null){return false;}

		User u = context.user_current().FirstOrDefault();
		log.Information("Found {@User}", u);
		if (u == null){return false;}

		Organization org = context.organizations_by_current_user(Relationship.AUTHOR).FirstOrDefault();
		log.Information("Found {@Organization}", org);
		if (org == null){return false;}

		string host = context.http_context.HttpContext.Request.Host.Value;

		{
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = TemplateId_Quatation_Request_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = TemplateId_Quatation_Request_GB;
					break;
				default:
					m.TemplateId = TemplateId_Quatation_Request_GB;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = course.email_of_contact_person;
			m.TemplateModel = new
			{
				product_url = host,
				product_name = PRODUCT_NAME,
				name = course.name_of_contact_person,
				request_name = u.firstname + " " + u.lastname,
				course = course.title,
				request_message = request_message_value,
				request_company = org.name,
				request_email = u.email,
				support_email = EMAIL_SUPPORT_ADDRESS,
				sender_name = EMAIL_SUPPORT_NAME,
				company_name = COMPANY_NAME,
				company_address = host
			};
			bool result = send(m);
			if (result == false) {return false;}
		}

		if (check == true)
		{
			// Copy quotation request
			var message_copy = new TemplatedPostmarkMessage();
			message_copy.From = EMAIL_NOREPLY_ADDRESS;
			message_copy.To = u.email;
			message_copy.TemplateId = TemplateId_Copy_quotation_request;
			message_copy.TemplateModel = new
			{
				product_url = host,
				product_name = PRODUCT_NAME,
				name = u.firstname + " " + u.lastname,
				request_receiver_email = course.email_of_contact_person,
				course = course.title,
				request_message = request_message_value,
				support_email = EMAIL_SUPPORT_ADDRESS,
				sender_name = EMAIL_SUPPORT_NAME,
				company_name = COMPANY_NAME,
				company_address = host
			};
			// TODO: Handle return value
			send(message_copy);
		}
		return true;
	}




	public static void postmark_register(User user, string orgid)
	{
		log.Information("Sending email for {@User} and {orgid}", user, orgid);
		{
			var m = new TemplatedPostmarkMessage();
			switch (user.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = TemplateId_AccountVerification_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = TemplateId_AccountVerification_EN;
					break;
				default:
					m.TemplateId = TemplateId_AccountVerification_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = user.email;
			m.TemplateId = TemplateId_AccountVerification_EN;
			m.TemplateModel = new
			{
				product_url = HOST_NAME,
				product_name = PRODUCT_NAME,
				name = user.firstname + " " + user.lastname,
				support_email = EMAIL_SUPPORT_ADDRESS,
				sender_name = EMAIL_SUPPORT_NAME,
				company_name = COMPANY_NAME,
				company_address = COMPANY_ADDRESS
			};
			send(m);
		}

		// System admin email
		{
			var m = new TemplatedPostmarkMessage();
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = "support@kompetensmatchning.se";
			m.TemplateId = TemplateId_System_admin_email;
			m.TemplateModel = new
			{
				product_url = HOST_NAME,
				product_name = PRODUCT_NAME,
				registration_name = user.firstname + " " + user.lastname,
				registration_email = user.email,
				registration_org_number = orgid,
				action_verify_url = action_verify_url,
				company_name = COMPANY_NAME,
				company_address = COMPANY_ADDRESS
			};
			send(m);
		}

	}





	public static void send_verify_email(User u, Record_Status status)
	{
		log.Information("Sending verify email for {@User} with {@Record_Status}", u, status);
		if (status == Record_Status.APPROVED)
		{
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = TemplateId_Welcome_Email_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = TemplateId_Welcome_Email_EN;
					break;
				default:
					m.TemplateId = TemplateId_Welcome_Email_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = u.email;
			m.TemplateId = TemplateId_Welcome_Email_SE;
			m.TemplateModel = new
			{
				product_url = HOST_NAME,
				product_name = PRODUCT_NAME,
				name = u.firstname + " " + u.lastname,
				username = u.username,
				action_login_url = Path.Combine(HOST_NAME, "login"),
				support_email = EMAIL_SUPPORT_ADDRESS,
				sender_name = EMAIL_SUPPORT_NAME,
				company_name = COMPANY_NAME,
				company_address = COMPANY_ADDRESS
			};
			send(m);
		}
		else if (status == Record_Status.UNAPPROVED)
		{
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = TemplateId_Account_not_verified_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = TemplateId_Account_not_verified_EN;
					break;
				default:
					m.TemplateId = TemplateId_Account_not_verified_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = u.email;
			m.TemplateModel = new
			{
				product_url = HOST_NAME,
				product_name = PRODUCT_NAME,
				name = u.firstname + " " + u.lastname,
				support_email = EMAIL_SUPPORT_ADDRESS,
				sender_name = EMAIL_SUPPORT_NAME,
				company_name = COMPANY_NAME,
				company_address = COMPANY_ADDRESS
			};
			var result_unverified_se = send(m);
		}
	}






}
