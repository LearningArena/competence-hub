using HotChocolate;
using HotChocolate.Types;

namespace Arena;


[ExtendObjectType(OperationTypeNames.Query)]
public class Eniro_Query
{
	[GraphQLType(typeof(AnyType))]
	public Organization OrgFromSearchstring([Service] Arena_Context context, string searchString)
	{
		Organization o = new Organization{};
		o.email = "HEJ!";
		Primitive_Result r = Arena_Eniro.OrgFromSearchstring(context, searchString, o);
		switch(r)
		{
			case Primitive_Result.SUCCESS: return o;
			case Primitive_Result.NOT_FOUND: throw HCExceptions.e(r);
			case Primitive_Result.REQUEST_COOLDOWN: throw HCExceptions.e(r);
		}
		return null;
	}


}
