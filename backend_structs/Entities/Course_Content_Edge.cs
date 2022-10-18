using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Course_Content_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }

		[ForeignKey("course")]
		public int course_id { get; set; }

		[ForeignKey("content")]
		public int content_id { get; set; }

		public virtual Course course { get; set; }
		public virtual Content content { get; set; }
	}
}