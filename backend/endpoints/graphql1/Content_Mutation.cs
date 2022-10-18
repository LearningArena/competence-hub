using System.Linq;
using System.Data;
using HotChocolate;
using HotChocolate.Types;
using Serilog;


namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Content_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Content_Mutation>();

	public IQueryable<Content> contents_update([Service] Arena_Context context, int id, string name)
	{
		if (context.is_siteadmin() == false) {return null;}
		Content content = context.contents.Where(x => x.id == id).FirstOrDefault();
		if (content == null) { return null; }
		if (name != null) { content.name = name; }
		context.contents.Update(content);
		context.SaveChanges();
		return context.contents.Where(x => x.id == id);
	}

	public IQueryable<Content> contents_add([Service] Arena_Context context, string name)
	{
		if (context.is_siteadmin() == false){return null;}
		Content content = new Content
		{
			name = name
		};
		context.contents.Add(content);
		context.SaveChanges();
		return context.contents.Where(x => x.id == content.id);
	}

}
