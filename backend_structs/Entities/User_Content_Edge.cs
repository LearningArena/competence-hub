using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arena
{
	public class User_Content_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public Relationship relationship { get; set; }
		
		[ForeignKey("user")]
		public int user_id { get; set; }

		[ForeignKey("content")]
		public int content_id { get; set; }

		public virtual User user { get; set; }
		public virtual Content content { get; set; }
	}
}