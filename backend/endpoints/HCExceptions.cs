using HotChocolate;
using HotChocolate.Execution;
using System.Collections;
using System.Reflection;
using System;
using System.Runtime.Serialization;

namespace Arena;

public static class HCExceptions
{
	public static QueryException e(Primitive_Result kind, string msg = "QueryException")
	{
		string code = "ARENA_" + kind.ToString();
		return new QueryException(ErrorBuilder.New().SetMessage(msg).SetCode(code).Build());
		//return new QueryException(ErrorBuilder.New().SetMessage(msg).Build());
		//return new Exception(msg);
	}
};