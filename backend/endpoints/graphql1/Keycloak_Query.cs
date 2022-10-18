using HotChocolate;
using HotChocolate.Types;
using Serilog;
using System.Collections.Generic;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Query)]
public class Keycloak_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Keycloak_Query>();


	[GraphQLType(typeof(AnyType))]
	public Keycloak_Userinfo keycloak_userinfo([Service] Arena_Context context) => Keycloak.userinfo(Arena.config_keycloak_admincli, context.claim(Arena_Claims.KEYCLOAK_USER_ACCESS_TOKEN));

	[GraphQLType(typeof(AnyType))]
	public List<Keycloak_User1> keycloak_users([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false){return null;}
		Keycloak_Access_Token token = Keycloak.token(Arena.config_keycloak_admincli);
		return Keycloak.users(Arena.config_keycloak_admincli, token.access_token);
	}

	[GraphQLType(typeof(AnyType))]
	public Keycloak_Access_Token keycloak_admincli_token([Service] Arena_Context context)
	{
		if (context.is_siteadmin() != true) { return null; }
		return Keycloak.token(Arena.config_keycloak_admincli);
	}


}
