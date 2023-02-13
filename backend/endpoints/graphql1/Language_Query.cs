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
public class Language_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Keyword_Query>();

	[HotChocolate.Types.UsePaging(MaxPageSize = Arena.MAX_PAGES, IncludeTotalCount = true)]
	[HotChocolate.Data.UseFiltering]
	[HotChocolate.Data.UseSorting]
	public IQueryable<Language> languages([Service] Arena_Context context, Record_Status? record_status, int? id)
	{
		IQueryable<Language> q = context.languages;
		if (id != null){q = q.Where(x => x.id == id);}
		if (record_status != null){q = q.Where(x => x.record_status == record_status);}
		return q;
	}


}
