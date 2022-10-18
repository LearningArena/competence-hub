using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Arena
{
	public class Inquiry_User_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int inquiry_id { get; set; }
		public int user_id { get; set; }
		public Relationship relationship { get; set; }
		public string title { get; set; }
		public virtual Inquiry inquiry { get; set; }
		public virtual User user { get; set; }
	}
}