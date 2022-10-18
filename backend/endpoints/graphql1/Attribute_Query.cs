using System;
using System.Linq;
using System.Collections.Generic;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Data;
using HotChocolate.Types.Relay;
using HotChocolate.Data.Projections;
using Serilog;

namespace Arena;

	
[ExtendObjectType(OperationTypeNames.Query)]
public class Attribute_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Attribute_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseProjection]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Attribute> attributes([Service] Arena_Context context, Record_Status? record_status, int? id)
	{
		IQueryable<Attribute> q = context.attributes;
		if (id != null){q = q.Where(x => x.id == id);}
		if (record_status != null){q = q.Where(x => x.record_status == record_status);}
		return q;
	}


}
