using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class Organization_User_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int user_id { get; set; }
		public int organization_id { get; set; }
		public virtual User user { get; set; }
		public virtual Organization organization { get; set; }
		public Relationship relationship { get; set; }
	}
}