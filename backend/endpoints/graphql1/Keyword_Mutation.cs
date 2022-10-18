using System;
using System.Data;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Serilog;

namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Keyword_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Keyword_Mutation>();

	[HotChocolate.Data.UseProjection]
	public IQueryable<Keyword> keywords_update([Service] Arena_Context context, int id, string name, Record_Status? record_status)
	{
		if (context.is_siteadmin() == false) {return null;}
		Keyword keyword = context.keywords.Where(x => x.id == id).FirstOrDefault();
		if (keyword == null){return null;}
		if (name != null){keyword.name = name;}
		if (record_status != null){keyword.record_status = (Record_Status)record_status;}
		keyword.time_modified = DateTime.UtcNow;
		context.SaveChanges();
		return context.keywords.Where(x => x.id == id);
	}

	[HotChocolate.Data.UseProjection]
	public IQueryable<Keyword> keywords_add([Service] Arena_Context context, string name)
	{
		if (context.is_siteadmin() == false){return null;}
		Keyword keyword = new Keyword
		{
			record_status = Record_Status.DRAFT,
			name = name,
			time_created = DateTime.UtcNow
		};
		context.keywords.Add(keyword);
		context.SaveChanges();
		return context.keywords.Where(x => x.id == keyword.id);
	}

}
