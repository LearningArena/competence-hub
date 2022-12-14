using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using HotChocolate;

namespace Arena
{
	public class Inquiry
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public Record_Status record_status { get; set; }
		
		[GraphQLDescription("Autogenerated fields")]
		public DateTime time_created { get; set; }
		public DateTime time_modified { get; set; }

		[GraphQLDescription("What are you looking for?")]
		public int target { get; set; }

		[GraphQLDescription("Earliest date to start")]
		public DateTime? start_date { get; set; }

		[GraphQLDescription("Latest date to end")]
		public DateTime? end_date { get; set; }
		public string title { get; set; }
		public string description { get; set; }
		public string category { get; set; }
		public string name_of_contact_person { get; set; }
		public string email_of_contact_person { get; set; }

		[GraphQLDescription("Telephone of contact person")]
		public string phonenumber_of_contact_person { get; set; }

		[GraphQLDescription("Desired place for education")]
		public string location { get; set; }

		[GraphQLDescription("Desired studypace")]
		public string studypace { get; set; }


		[HotChocolate.Data.UseFiltering]
		public virtual ICollection<Inquiry_User_Edge> inquiry_user_edges { get; set; }


		[ForeignKey("organization")]
		public int? organization_id {get; set;}
		public virtual Organization organization { get; set; }
	}
}