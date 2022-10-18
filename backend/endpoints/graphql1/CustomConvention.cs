using HotChocolate.Types;
using HotChocolate.Data.Filters;
using HotChocolate.Types.Filters;
using HotChocolate.Data.Filters.Expressions;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using HotChocolate.Language;

namespace Arena;


// https://github.com/ChilliCream/hotchocolate/blob/develop/website/src/docs/hotchocolate/api-reference/extending-filtering.md#extending-iqueryable
public class QueryableStringInvariantEqualsHandler : QueryableStringOperationHandler
{
	public QueryableStringInvariantEqualsHandler(InputParser inputParser) : base(inputParser){}
	private static readonly MethodInfo _toLower = typeof(string).GetMethods().Single(x => x.Name == nameof(string.ToLower) &&x.GetParameters().Length == 0);
	protected override int Operation => DefaultFilterOperations.Equals;
	public override Expression HandleOperation(QueryableFilterContext context,HotChocolate.Data.Filters.IFilterOperationField field,IValueNode value,object parsedValue)
	{
		Expression property = context.GetInstance();
		if (parsedValue is string str)
		{
			return Expression.Equal(Expression.Call(property, _toLower),Expression.Constant(str.ToLower()));
		}
		throw new InvalidOperationException();
	}
}

public class QueryableStringInvariantContainsHandler : QueryableStringOperationHandler
{
	public QueryableStringInvariantContainsHandler(InputParser inputParser) : base(inputParser){}
	private static readonly MethodInfo _toLower = typeof(string).GetMethods().Single(x => x.Name == nameof(string.ToLower) &&x.GetParameters().Length == 0);
	protected override int Operation => DefaultFilterOperations.Contains;
	public override Expression HandleOperation(QueryableFilterContext context,HotChocolate.Data.Filters.IFilterOperationField field,IValueNode value,object parsedValue)
	{
		Expression property = context.GetInstance();
		if (parsedValue is string str)
		{
			//https://stackoverflow.com/questions/51004669/convert-expression-tree-from-equal-to-contains
			var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] {typeof(string)});
			return Expression.Call(Expression.Call(property, _toLower), containsMethod, Expression.Constant(str.ToLower()));
		}
		throw new InvalidOperationException();
	}
}

