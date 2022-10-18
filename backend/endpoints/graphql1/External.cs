using System.Collections.Generic;
using HotChocolate;
using HotChocolate.Types;
using Serilog;

namespace Arena;



[ExtendObjectType(OperationTypeNames.Mutation)]
public class External_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<External_Mutation>();

	public int external_import([Service] Arena_Context context, Extapi.Parser method)
	{
		if (context.is_siteadmin() == false) { return -1; }
		return Arena_Import.external_import(context, method);
	}

}


[ExtendObjectType(OperationTypeNames.Query)]
public class External_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<External_Mutation>();

	[GraphQLType(typeof(AnyType))]
	public List<Course> external_parse([Service] Arena_Context context, Extapi.Parser method)
	{
		if (context.is_siteadmin() == false) { return null; }
		int user_id = context.current_user_id();
		List<Course> courses = Extapi.Externaldata.request_parse(Arena.client, method, Extapi.Endpoints.urls[method]);
		return courses;
	}
}
