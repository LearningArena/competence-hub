using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Query)]
public class Tempuser_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Tempuser_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Tempuser> tempusers([Service] Arena_Context context)
	{
		if (context.is_siteadmin() == false) {return null;}
		return context.tempusers.OrderBy(t => t.created);
	}


}
