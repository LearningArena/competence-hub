using System.Linq;
using System.Data;
using HotChocolate;
using HotChocolate.Types;
using Serilog;


namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Attribute_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Attribute_Mutation>();

	public IQueryable<Attribute> attributes_update([Service] Arena_Context context, int id, string name)
	{
		if (context.is_siteadmin() == false) {return null;}
		Attribute attribute = context.attributes.Where(x => x.id == id).FirstOrDefault();
		if (attribute == null) { return null; }
		if (name != null) { attribute.name = name; }
		context.attributes.Update(attribute);
		context.SaveChanges();
		return context.attributes.Where(x => x.id == id);
	}

	public IQueryable<Attribute> attributes_add([Service] Arena_Context context, string name)
	{
		if (context.is_siteadmin() == false){return null;}
		Attribute attribute = new Attribute
		{
			name = name
		};
		context.attributes.Add(attribute);
		context.SaveChanges();
		return context.attributes.Where(x => x.id == attribute.id);
	}

}
