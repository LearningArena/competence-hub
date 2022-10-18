using System.Linq;
using System.Data;
using HotChocolate;
using HotChocolate.Types;
using Serilog;


namespace Arena;


[ExtendObjectType(OperationTypeNames.Mutation)]
public class Language_Mutation
{
	private readonly Serilog.ILogger log = Log.ForContext<Language_Mutation>();

	public IQueryable<Language> languages_update([Service] Arena_Context context, int id, string name)
	{
		if (context.is_siteadmin() == false) {return null;}
		Language language = context.languages.Where(x => x.id == id).FirstOrDefault();
		if (language == null) { return null; }
		if (name != null) { language.name = name; }
		context.languages.Update(language);
		context.SaveChanges();
		return context.languages.Where(x => x.id == id);
	}

	public IQueryable<Language> languages_add([Service] Arena_Context context, string name)
	{
		if (context.is_siteadmin() == false){return null;}
		Language language = new Language
		{
			name = name
		};
		context.languages.Add(language);
		context.SaveChanges();
		return context.languages.Where(x => x.id == language.id);
	}

}
