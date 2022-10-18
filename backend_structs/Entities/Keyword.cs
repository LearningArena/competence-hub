using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Keyword
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public DateTime time_created { get; set; } = DateTime.UtcNow;
		public DateTime time_modified { get; set; } = DateTime.UtcNow;
		public Record_Status record_status { get; set; } = Record_Status.DRAFT;
		public String name { get; set; }
		public Boolean is_category { get; set; }
		public Boolean is_topic { get; set; }
		public Boolean is_tag { get; set; }
		public virtual ICollection<Course_Keyword_Edge> course_keyword_edges { get; set; }
	}
}