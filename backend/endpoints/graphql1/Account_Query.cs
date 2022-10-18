using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using HotChocolate;
using HotChocolate.Types;
using Serilog;
using Microsoft.AspNetCore.Http;


namespace Arena;

	
[ExtendObjectType(OperationTypeNames.Query)]
public class Account_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Account_Query>();

	[GraphQLType(typeof(AnyType))]
	public IEnumerable<Claim> claims([Service] Arena_Context context, [Service] IHttpContextAccessor http) => http.HttpContext.User.Claims.ToList();
	[GraphQLType(typeof(AnyType))]
	public IEnumerable<ClaimsIdentity> identities([Service] Arena_Context context) => context.http_context.HttpContext.User.Identities;
	public int user_id([Service] Arena_Context context) => context.current_user_id();

	public int? impostor_id([Service] Arena_Context context) => context.current_user_id_impostor();

	public bool authenticated([Service] IHttpContextAccessor contextAccessor) => contextAccessor.HttpContext.User.Identity.IsAuthenticated;
	






}
