using System.Collections.Generic;

namespace Arena;

public enum Metatype
{
	UNKNOWN,
	STRING,
	INTEGER,
	FLOAT
};



public record Meta
{
	public Metatype type {get; set;}
}



public static class Columns
{
	public static Dictionary<string, Meta> p = new Dictionary<string, Meta>
	{
		{"title", new Meta{type=Metatype.STRING}},
		{"name", new Meta{type=Metatype.STRING}},
		{"description", new Meta{type=Metatype.STRING}},
		{"record_status", new Meta{type=Metatype.INTEGER}},
		{"price", new Meta{type=Metatype.INTEGER}},
	};
}




