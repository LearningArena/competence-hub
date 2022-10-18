using HotChocolate;
using HotChocolate.Types;
using Serilog;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Mutation)]
public class Keycloak_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Keycloak_Mutation>();

	public Primitive_Result keycloak_modify_user([Service] Arena_Context context, Keycloak_User user)
	{
		Keycloak_Access_Token token = Keycloak.token(Arena.config_keycloak_admincli);
		if (token.access_token == null){throw HCExceptions.e(Primitive_Result.KEYCLOAK_TOKEN_ERROR);}
		string user_guid = context.claim(Arena_Claims.KEYCLOAK_USER_GUID);
		if (user_guid == null){throw HCExceptions.e(Primitive_Result.CLAIM_KEYCLOAK_NOT_FOUND);}
		Primitive_Result r = Keycloak.modify_user(Arena.config_keycloak_admincli, user, token.access_token, user_guid);
		if (r != Primitive_Result.SUCCESS) {throw HCExceptions.e(r);}
		return r;
	}



	[GraphQLType(typeof(AnyType))]
	public Keycloak_Userinfo keycloak_login([Service] Arena_Context context, string username, string password)
	{
		Keycloak_Access_Token token = Keycloak.login(Arena.config_keycloak_arenaclient, username, password);
		if (token.access_token == null){throw HCExceptions.e(Primitive_Result.KEYCLOAK_TOKEN_ERROR);}
		Keycloak_Userinfo userinfo = Keycloak.userinfo(Arena.config_keycloak_admincli, token.access_token);
		if (userinfo == null){throw HCExceptions.e(Primitive_Result.KEYCLOAK_USERINFO_ERROR);}
		return userinfo;
	}

	[GraphQLType(typeof(AnyType))]
	public Keycloak_Response_Register keycloak_admincli_register([Service] Arena_Context context, string access_token, string email, string password, string firstname, string lastname)
	{
		if (context.is_siteadmin() != true) { return null; }
		return Keycloak.register(Arena.config_keycloak_admincli, access_token, email, password, firstname, lastname);
	}

}
