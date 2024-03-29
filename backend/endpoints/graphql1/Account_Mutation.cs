using System;
using System.Data;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using System.ComponentModel.DataAnnotations;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Mutation)]
public class Account_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Account_Mutation>();

	[GraphQLType(typeof(AnyType))]
	public Arena_Return_Message login([Service] Arena_Context context, string username, string password)
	{
		// Is Arena_Return_Message reasonable?
		// TODO: Make something more simplier. 
		Arena_Return_Message message = new Arena_Return_Message{};

		Account account = Arena.authenticate(context, username, password);
		if (account.status != Primitive_Result.SUCCESS) 
		{
			//throw HCExceptions.e(account.status);
			message.status = account.status;
			message.text = "Login failed.";
			return message;
		}
		Arena.signin(context.http_context.HttpContext, account);


		string x = account.keycloak_userinfo.groups.Find(x => x == "/Siteadmin");
		if (x != null)
		{
			message.text = "Logged in successful. This user is /Siteadmin.";
		}
		else if (account.user.record_status != Record_Status.APPROVED)
		{
			switch (account.user.record_status)
			{
				case Record_Status.UNAPPROVED:
					message.status = Primitive_Result.UNAPPROVED;
					message.text = "This user has been unapproved";
					return message;
				case Record_Status.NEEDVERIFICATION:
					message.status = Primitive_Result.NEED_VERIFICATION;
					message.text = "This user need verification";
					return message;
				case Record_Status.DRAFT:
					//Draft user has no logic to it yet...
					message.status = Primitive_Result.SUCCESS;
					message.text = "Logged in successful. User is a draft";
					break;
				default:
					return message;
			};
		}
		else
		{
			message.status = Primitive_Result.SUCCESS;
			message.text = "Logged in successful";
		};
		return message;
	}


	public async Task<bool> logout([Service] Arena_Context context)
	{
		log.Information("SignOutAsync {AuthenticationScheme}, {AuthenticationType}", CookieAuthenticationDefaults.AuthenticationScheme, context.http_context.HttpContext.User.Identity.AuthenticationType);
		await context.http_context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
		return context.http_context.HttpContext.User.Identity.IsAuthenticated;
	}

	public Primitive_Result register([Service] Arena_Context context, string email, string password, string firstname, string lastname, string orgname, string orgid, int? preference, Country_Code_ISO_3166_1? preference_language, string org_address, string org_description, string org_email, string org_image_logo, string org_phonenumber, string org_website)
	{
		if (Misc.Regexs.organisationsnummer.IsMatch(orgid) == false)
		{
			return Primitive_Result.REGISTER_ORGID_INVALID;
		}
		orgid = orgid.Replace("-", "");
		Keycloak_Access_Token token1 = Keycloak.token(Arena.config_keycloak_admincli);
		if (token1.access_token == null)
		{
			//Keycloak_Response_Register r = new Keycloak_Response_Register { };
			//r.errorMessage = "error:" + token1.error + ". error_description:" + token1.error_description;
			//r.status = token1.status;
			return Primitive_Result.KEYCLOAK_ACCESS_TOKEN_NULL;
		}
		Keycloak_Response_Register result = Keycloak.register(Arena.config_keycloak_admincli, token1.access_token, email, password, firstname, lastname);
		switch(result.status)
		{
		case HttpStatusCode.Created:
			break;
		case HttpStatusCode.Conflict:
			return Primitive_Result.EMAIL_ALREADY_EXISTS;
		default:
			return Primitive_Result.KEYCLOAK_NOT_CREATED;
		}
		
		Keycloak_Access_Token token2 = Keycloak.login(Arena.config_keycloak_arenaclient, email, password);
		if (token2.access_token == null)
		{
			return Primitive_Result.KEYCLOAK_ACCESS_TOKEN_NULL;
		}
		Keycloak_Userinfo userinfo = Keycloak.userinfo(Arena.config_keycloak_admincli, token2.access_token);
		if (userinfo.sub == null)
		{
			return Primitive_Result.KEYCLOAK_USERINFO_SUB_NULL;
		}
		User user = new User
		{
			keycloak_guid = Guid.Parse(userinfo.sub),
			preference = preference ?? 0, //null coalescing operator, x = (possiblyNullValue ?? valueIfNull)
			firstname = firstname,
			lastname = lastname,
			username = email,
			preference_language = preference_language ?? Country_Code_ISO_3166_1.SE,
			email = email,
			record_status = Record_Status.NEEDVERIFICATION,
			time_created = DateTime.UtcNow,
		};
		context.users.Add(user);
		context.SaveChanges();

		if (orgid != null)
		{
			Organization organization = context.organizations.Where(x => x.orgid == orgid).FirstOrDefault();
			Relationship relationship = Relationship.MEMBER;
			//Organization organization = context.organizations.Where(x => x.organization_user_edges.Any(y => y.organization.orgid == orgid)).FirstOrDefault();
			if (organization == null)
			{
				organization = new Organization
				{
					name = orgname,
					orgid = orgid,
					address = org_address,
					description = org_description,
					email = org_email,
					image_logo = org_image_logo,
					phonenumber = org_phonenumber,
					website = org_website,
					record_status = Record_Status.NEEDVERIFICATION
				};
				context.organizations.Add(organization);
				context.SaveChanges();
				relationship = Relationship.AUTHOR;
			}
			Organization_User_Edge edge = new Organization_User_Edge
			{
				organization_id = organization.id,
				user_id = user.id,
				relationship = relationship
			};
			context.organization_user_edges.Add(edge);
			context.SaveChanges();
		}

		
		if (new EmailAddressAttribute().IsValid(email) == false)
		{
			return Primitive_Result.SUCCESS_EMAIL_INVALID;
		}

		bool success = Arena_Email.postmark_register(user, orgid);
		if (success == false)
		{
			return Primitive_Result.SUCCESS_SEND_EMAIL_FAIL;
		}
		return Primitive_Result.SUCCESS;
	}

	public bool forgot_password_email([Service] Arena_Context context, string email)
	{
		bool success = Arena_Email.send_forgot_password_email(context, email);
		return success;
	}

	public Primitive_Result change_password([Service] Arena_Context context, string new_password)
	{
		return Arena_Account.change_password(context, new_password);
	}

	public Primitive_Result change_email([Service] Arena_Context context, string new_email)
	{
		return Arena_Account.change_email(context, new_email);
	}

	public async Task<bool> impersonate([Service] Arena_Context context, int id) => await context.impersonate(id);
	public async Task<bool> impersonate_revert([Service] Arena_Context context)  => await context.impersonate(-1);

}
