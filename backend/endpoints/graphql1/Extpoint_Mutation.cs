using System.Data;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;


namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Extpoint_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Extpoint_Mutation>();

	[HotChocolate.Data.UseProjection]
	public IQueryable<Extpoint> extpoints_update([Service] Arena_Context context, int id, string name, string url, Extapi.Parser? parser)
	{
		int user_id = context.current_user_id();
		if (user_id == 0){throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		Extpoint extpoint = context.extpoints.FirstOrDefault(t => t.id == id);
		if (extpoint == null) {throw HCExceptions.e(Primitive_Result.NOT_FOUND);}
		if (name != null){extpoint.name = name;}
		if (url != null){extpoint.url = url;}
		if (parser != null){extpoint.parser = (Extapi.Parser)parser;}
		context.SaveChanges();
		return context.extpoints.Where(x => x.id == id);
	}


	[HotChocolate.Data.UseProjection]
	public IQueryable<Extpoint> extpoints_add([Service] Arena_Context context, string url)
	{
		int user_id = context.current_user_id();
		if (user_id == 0) {throw HCExceptions.e(Primitive_Result.LOGIN_REQUIRED);}
		if (context.is_siteadmin() == false){throw HCExceptions.e(Primitive_Result.ADMIN_REQUIRED);}
		Extpoint o = new Extpoint
		{
			url = url
		};
		context.extpoints.Add(o);
		context.SaveChanges();
		return context.extpoints.Where(x => x.id == o.id);
	}


}
