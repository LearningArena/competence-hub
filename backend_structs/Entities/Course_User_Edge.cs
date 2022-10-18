using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HotChocolate;

namespace Arena
{

	[GraphQLDescription(@"The enrollment entity represents the relationship between the student and the course.")]
	public class Course_User_Edge
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public int course_id { get; set; }
		public int user_id { get; set; }
		public Relationship relationship { get; set; }
		public virtual Course course { get; set; }
		public virtual User user { get; set; }
	}
}