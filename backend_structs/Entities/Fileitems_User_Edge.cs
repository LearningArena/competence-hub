using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Arena
{
	public class Fileitem_User_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int fileitem_id { get; set; }
		public int user_id { get; set; }
		public Relationship relationship { get; set; }
		public virtual Fileitem fileitem { get; set; }
		public virtual User user { get; set; }
	}
}