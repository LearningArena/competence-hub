using System;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Mutation)]
public class User_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<User_Mutation>();

	public IQueryable<User> users_update([Service] Arena_Context context, int id,
		int? preference,
		string firstname,
		string lastname,
		Country_Code_ISO_3166_1? preference_language
	)
	{
		if (id == 0){id = context.current_user_id();}
		else if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		if (id <= 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		User user = context.users.FirstOrDefault(t => t.id == id);
		if (user == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (preference != null){user.preference = (int)preference;}
		if (firstname != null){user.firstname = firstname;}
		if (lastname != null){user.lastname = lastname;}
		if (preference_language != null){user.preference_language = (Country_Code_ISO_3166_1)preference_language;}
		user.time_modified = DateTime.UtcNow;
		context.SaveChanges();
		return context.users.Where(x => x.id == id);
	}


}
