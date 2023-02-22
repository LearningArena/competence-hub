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

	// TODO: Store this elsewhere because its not only for email:
	public static string HOST_NAME = "";
	public static string PRODUCT_NAME = "";
	public static string EMAIL_SUPPORT_ADDRESS = "";
	public static string EMAIL_SUPPORT_NAME = "";
	public static string COMPANY_NAME = "";
	public static string COMPANY_ADDRESS = "";
	public static string EMAIL_NOREPLY_ADDRESS = "";
	public static string action_verify_url = "";

	public static int POSTMARK_TEMPLATE_8_Reset_password_SE = 0;
	public static int POSTMARK_TEMPLATE_8_Reset_password_EN = 0;
	public static int POSTMARK_TEMPLATE_7_Quotation_request_SE = 0;
	public static int POSTMARK_TEMPLATE_7_Quotation_request_EN = 0;
	public static int POSTMARK_TEMPLATE_2_Account_verification_SE = 0;
	public static int POSTMARK_TEMPLATE_2_Account_verification_EN = 0;
	public static int POSTMARK_TEMPLATE_4_Copy_quotation_request_SE = 0;
	public static int POSTMARK_TEMPLATE_4_Copy_quotation_request_EN = 0;
	public static int POSTMARK_TEMPLATE_9_Welcome_mail_SE = 0;
	public static int POSTMARK_TEMPLATE_9_Welcome_mail_EN = 0;
	public static int POSTMARK_TEMPLATE_1_Account_not_verified_SE = 0;
	public static int POSTMARK_TEMPLATE_1_Account_not_verified_EN = 0;
	public static int POSTMARK_TEMPLATE_10_System_Verification = 0;



	public static void get_environment_values()
	{
		Arena_Email.PRODUCT_NAME          = Environment.GetEnvironmentVariable("PRODUCT_NAME");
		Arena_Email.HOST_NAME             = Environment.GetEnvironmentVariable("HOST_NAME");
		Arena_Email.COMPANY_NAME          = Environment.GetEnvironmentVariable("COMPANY_NAME");
		Arena_Email.COMPANY_ADDRESS       = Environment.GetEnvironmentVariable("COMPANY_ADDRESS");
		Arena_Email.EMAIL_SUPPORT_ADDRESS = Environment.GetEnvironmentVariable("EMAIL_SUPPORT_ADDRESS");
		Arena_Email.EMAIL_SUPPORT_NAME    = Environment.GetEnvironmentVariable("EMAIL_SUPPORT_NAME");
		Arena_Email.EMAIL_NOREPLY_ADDRESS = Environment.GetEnvironmentVariable("EMAIL_NOREPLY_ADDRESS");

		Arena_Email.POSTMARK_TEMPLATE_1_Account_not_verified_EN = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_1_Account_not_verified_EN") ?? POSTMARK_TEMPLATE_1_Account_not_verified_EN.ToString());
		Arena_Email.POSTMARK_TEMPLATE_1_Account_not_verified_SE = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_1_Account_not_verified_SE") ?? POSTMARK_TEMPLATE_1_Account_not_verified_SE.ToString());
		Arena_Email.POSTMARK_TEMPLATE_10_System_Verification    = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_10_System_Verification")    ?? POSTMARK_TEMPLATE_10_System_Verification.ToString());
		Arena_Email.POSTMARK_TEMPLATE_2_Account_verification_EN = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_2_Account_verification_EN") ?? POSTMARK_TEMPLATE_2_Account_verification_EN.ToString());
		Arena_Email.POSTMARK_TEMPLATE_2_Account_verification_SE = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_2_Account_verification_SE") ?? POSTMARK_TEMPLATE_2_Account_verification_SE.ToString());
		Arena_Email.POSTMARK_TEMPLATE_9_Welcome_mail_EN         = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_9_Welcome_mail_EN")         ?? POSTMARK_TEMPLATE_9_Welcome_mail_EN.ToString());
		Arena_Email.POSTMARK_TEMPLATE_9_Welcome_mail_SE         = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_9_Welcome_mail_SE")         ?? POSTMARK_TEMPLATE_9_Welcome_mail_SE.ToString());
		Arena_Email.POSTMARK_TEMPLATE_7_Quotation_request_EN    = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_7_Quotation_request_EN")    ?? POSTMARK_TEMPLATE_7_Quotation_request_EN.ToString());
		Arena_Email.POSTMARK_TEMPLATE_7_Quotation_request_SE    = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_7_Quotation_request_SE")    ?? POSTMARK_TEMPLATE_7_Quotation_request_SE.ToString());
		Arena_Email.POSTMARK_TEMPLATE_8_Reset_password_EN       = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_8_Reset_password_EN")       ?? POSTMARK_TEMPLATE_8_Reset_password_EN.ToString());
		Arena_Email.POSTMARK_TEMPLATE_8_Reset_password_SE       = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_8_Reset_password_SE")       ?? POSTMARK_TEMPLATE_8_Reset_password_SE.ToString());

		//Arena_Email.POSTMARK_TEMPLATE_11_No_reply_reply_EN     = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_11_No_reply_reply_EN"));
		//Arena_Email.POSTMARK_TEMPLATE_11_No_reply_reply_SE     = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_11_No_reply_reply_SE"));
		//Arena_Email.POSTMARK_TEMPLATE_3_Activation_EN          = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_3_Activation_EN"));
		//Arena_Email.POSTMARK_TEMPLATE_3_Activation_SE          = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_3_Activation_SE"));
		//Arena_Email.POSTMARK_TEMPLATE_4_Copy_quotation_request_= Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_4_Copy_quotation_request_"));
		//Arena_Email.POSTMARK_TEMPLATE_4_Copy_quotation_request_= Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_4_Copy_quotation_request_"));
		//Arena_Email.POSTMARK_TEMPLATE_5_New_inquiry_EN         = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_5_New_inquiry_EN"));
		//Arena_Email.POSTMARK_TEMPLATE_5_New_inquiry_SE         = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_5_New_inquiry_SE"));
		//Arena_Email.POSTMARK_TEMPLATE_6_New_password_SE        = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_6_New_password_SE"));
		//Arena_Email.POSTMARK_TEMPLATE_6_New_password_EN        = Int32.Parse(Environment.GetEnvironmentVariable("POSTMARK_TEMPLATE_6_New_password_EN"));
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
		try
		{
			PostmarkResponse result = client.SendMessageAsync(message).Result;
			log.Information("{@PostmarkResponse}", result);
			return result.Status == PostmarkStatus.Success;
		}
		catch(Exception e)
		{
			log.Information("{@PostmarkResponseException}", e);
		}
		return false;
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
				message.TemplateId = POSTMARK_TEMPLATE_8_Reset_password_SE;
				break;
			case Country_Code_ISO_3166_1.GB:
				message.TemplateId = POSTMARK_TEMPLATE_8_Reset_password_EN;
				break;
			default:
				message.TemplateId = POSTMARK_TEMPLATE_8_Reset_password_EN;
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
					m.TemplateId = POSTMARK_TEMPLATE_7_Quotation_request_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = POSTMARK_TEMPLATE_7_Quotation_request_EN;
					break;
				default:
					m.TemplateId = POSTMARK_TEMPLATE_7_Quotation_request_EN;
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
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = POSTMARK_TEMPLATE_4_Copy_quotation_request_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = POSTMARK_TEMPLATE_4_Copy_quotation_request_EN;
					break;
				default:
					m.TemplateId = POSTMARK_TEMPLATE_4_Copy_quotation_request_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = u.email;
			m.TemplateModel = new
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
			bool result = send(m);
			if (result == false) {return false;}
		}
		return true;
	}




	public static bool postmark_register(User user, string orgid)
	{
		log.Information("Sending email for {@User} and {orgid}", user, orgid);
		{
			var m = new TemplatedPostmarkMessage();
			switch (user.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = POSTMARK_TEMPLATE_2_Account_verification_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = POSTMARK_TEMPLATE_2_Account_verification_EN;
					break;
				default:
					m.TemplateId = POSTMARK_TEMPLATE_2_Account_verification_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = user.email;
			m.TemplateId = POSTMARK_TEMPLATE_2_Account_verification_EN;
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
			bool result = send(m);
			if (result == false) {return false;}
		}

		// System admin email
		{
			var m = new TemplatedPostmarkMessage();
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = "support@kompetensmatchning.se";
			m.TemplateId = POSTMARK_TEMPLATE_10_System_Verification;
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
			bool result = send(m);
			if (result == false) {return false;}
		}
		return true;
	}





	public static bool send_verify_email(User u, Record_Status status)
	{
		log.Information("Sending verify email for {@User} with {@Record_Status}", u, status);
		if (status == Record_Status.APPROVED)
		{
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = POSTMARK_TEMPLATE_9_Welcome_mail_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = POSTMARK_TEMPLATE_9_Welcome_mail_EN;
					break;
				default:
					m.TemplateId = POSTMARK_TEMPLATE_9_Welcome_mail_EN;
					break;
			}
			m.From = EMAIL_NOREPLY_ADDRESS;
			m.To = u.email;
			m.TemplateId = POSTMARK_TEMPLATE_9_Welcome_mail_SE;
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
			bool result = send(m);
			if (result == false) {return false;}
		}
		else if (status == Record_Status.UNAPPROVED)
		{
			var m = new TemplatedPostmarkMessage();
			switch (u.preference_language)
			{
				case Country_Code_ISO_3166_1.SE:
					m.TemplateId = POSTMARK_TEMPLATE_1_Account_not_verified_SE;
					break;
				case Country_Code_ISO_3166_1.GB:
					m.TemplateId = POSTMARK_TEMPLATE_1_Account_not_verified_EN;
					break;
				default:
					m.TemplateId = POSTMARK_TEMPLATE_1_Account_not_verified_EN;
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
			bool result = send(m);
			if (result == false) {return false;}
		}
		return true;
	}






}
