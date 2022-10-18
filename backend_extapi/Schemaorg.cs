using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;

using Schema.NET;



// https://schema.org/docs/documents.html
// https://github.com/RehanSaeed/Schema.NET
// 
namespace Schemaorg
{
	public static class Schemaorg
	{
		public static Organization organization_convert(Arena.Organization o)
		{
			if (o == null){return null;}
			Uri SameAs;
			Uri.TryCreate(o.website, UriKind.RelativeOrAbsolute, out SameAs);
			var organization = new Organization()
			{
				//TODO: Add rest of them
				Address = o.address,
				LegalName = o.name,
				VatID = o.orgid,
				SameAs = SameAs
			};
			
			return organization;
		}


		public static Values<String, Uri> property_keyword_convert(ICollection<Arena.Course_Keyword_Edge> k)
		{
			return k.Select(x => x.keyword.name).ToList();
		}

		public static Course course_convert(Arena.Course c)
		{
			var course = new Course()
			{
				//TODO: Add rest of them
				Name = c.title,
				Description = c.description,
				Provider = organization_convert(c.organization),
				Keywords = property_keyword_convert(c.course_keyword_edges),
			};
			return course;
		}
	};


}