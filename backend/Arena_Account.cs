using System;
using System.Linq;
using Serilog;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Arena;

public static class Arena_Account
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Account));
	static public Primitive_Result change_email(Arena_Context context, string new_email)
	{
		int user_id = context.current_user_id();
		if (user_id == 0) {return Primitive_Result.LOGIN_REQUIRED;}
		Keycloak_Access_Token token = Keycloak.token(Arena.config_keycloak_admincli);
		if (token.access_token == null){return Primitive_Result.KEYCLOAK_ADMIN_TOKEN_ERROR;}
		string user_guid = context.claim(Arena_Claims.KEYCLOAK_USER_GUID);
		if (user_guid == null){return Primitive_Result.CLAIM_KEYCLOAK_NOT_FOUND;}
		User arena_user = context.users.FirstOrDefault(t => t.id == user_id);
		if (arena_user == null) {return Primitive_Result.NOT_FOUND;}
		Keycloak_User kc_user = new Keycloak_User
		{
			username = new_email,
			email = new_email,
		};
		using var transaction = context.Database.BeginTransaction();
		log.Information("Transaction begin for user {id}", user_id);
		arena_user.email = new_email;
		arena_user.time_modified = DateTime.UtcNow;
		context.users.Update(arena_user);
		int n = context.SaveChanges();
		if (n <= 0) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		Primitive_Result r = Keycloak.modify_user(Arena.config_keycloak_admincli, kc_user, token.access_token, user_guid);
		if (r != Primitive_Result.SUCCESS) {return r;}
		transaction.Commit();
		return Primitive_Result.SUCCESS;
	}

	static public Primitive_Result change_password(Arena_Context context, string new_password)
	{
		Keycloak_Access_Token token = Keycloak.token(Arena.config_keycloak_admincli);
		if (token.access_token == null){return Primitive_Result.KEYCLOAK_ADMIN_TOKEN_ERROR;}
		string user_guid = context.claim(Arena_Claims.KEYCLOAK_USER_GUID);
		if (user_guid == null){return Primitive_Result.CLAIM_KEYCLOAK_NOT_FOUND;}
		Primitive_Result result = Keycloak.change_password(Arena.config_keycloak_admincli, new_password, token.access_token, user_guid);
		if (result != Primitive_Result.SUCCESS) {return result;}
		context.http_context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
		return Primitive_Result.SUCCESS;
	}

};