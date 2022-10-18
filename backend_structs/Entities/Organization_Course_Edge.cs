using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Organization_Course_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int course_id { get; set; }
		public int organization_id { get; set; }

		public virtual Course course { get; set; }
		public virtual Organization organization { get; set; }


		public Relationship relationship { get; set; }
	}
}