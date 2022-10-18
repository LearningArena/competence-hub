using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Course_Keyword_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int course_id { get; set; }
		public int keyword_id { get; set; }
		public Relationship relationship { get; set; } = Relationship.UNKNOWN;

		
		public virtual Course course { get; set; }
		public virtual Keyword keyword { get; set; }
	}
}