using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Content
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public Record_Status record_status { get; set; }
		public String name { get; set; }
		public String content { get; set; }

		[ForeignKey("language")]
		public int language_id { get; set; }

		[ForeignKey("attribute")]
		public int attribute_id { get; set; }

		public virtual Language language { get; set; }
		public virtual Attribute attribute { get; set; }
		public virtual ICollection<User_Content_Edge> user_content_edges { get; set; }
	}
}