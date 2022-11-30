using System.ComponentModel;

namespace Arena;
public enum Primitive_Result
{
	UNKNOWN,
	SUCCESS,
	KEYCLOAK,
	KEYCLOAK_ERROR,
	KEYCLOAK_TOKEN_ERROR,
	KEYCLOAK_ADMIN_TOKEN_ERROR,
	KEYCLOAK_USERINFO_ERROR,
	KEYCLOAK_AUTH_ERROR,
	DB_NEWUSER_ERROR,
	UNAPPROVED,
	NEED_VERIFICATION,
	
	[Description("You are not logged in")]
	LOGIN_REQUIRED,

	[Description("You are not admin")]
	ADMIN_REQUIRED,

	[Description("You do not own this resource")]
	MISSING_OWNERSHIP,
	
	[Description("This resource does not exist")]
	NOT_FOUND,


	REQUEST_COOLDOWN,
	CLAIM_KEYCLOAK_NOT_FOUND,
	PASSWORD_MISMATCH,
	EMAIL_ALREADY_EXISTS,
};

