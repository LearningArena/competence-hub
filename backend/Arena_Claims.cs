using System.Collections.Generic;
using System.Security.Claims;


namespace Arena;


public static class Arena_Claims
{
	public const string ARENA_USER_ID = "ARENA_USER_ID";
	public const string ARENA_USER_ID_IMPOSTOR = "ARENA_USER_ID_IMPOSTOR";
	public const string KEYCLOAK_USER_GUID = "KEYCLOAK_USER_GUID";
	public const string KEYCLOAK_USER_ACCESS_TOKEN = "KEYCLOAK_USER_ACCESS_TOKEN";

	public static ClaimsPrincipal impersonate(ClaimsPrincipal current, int user_id)
	{
		//https://stackoverflow.com/questions/24587414/how-to-update-a-claim-in-asp-net-identity
		ClaimsIdentity i = current.Identity as ClaimsIdentity;
		if (user_id == -1)
		{
			Claim c = i.FindFirst(ARENA_USER_ID_IMPOSTOR);
			i.RemoveClaim(c);
			i.RemoveClaim(i.FindFirst(ARENA_USER_ID));
			i.AddClaim(new Claim(ARENA_USER_ID, c.Value.ToString()));
		}
		else if (user_id > 0)
		{
			Claim c = current.FindFirst(ARENA_USER_ID);
			i.RemoveClaim(c);
			i.AddClaim(new Claim(ARENA_USER_ID_IMPOSTOR, c.Value));
			i.AddClaim(new Claim(ARENA_USER_ID, user_id.ToString()));
		}
		List<ClaimsIdentity> identities = new List<ClaimsIdentity>{i};
		ClaimsPrincipal principal = new ClaimsPrincipal(identities);
		return principal;
	}


};

