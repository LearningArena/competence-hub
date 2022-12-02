using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Arena
{


	// A button for each row where its either add or sync, .i.e idempotent.
	public class Extpoint
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int id { get; set; }
		public Record_Status record_status { get; set; }

		public string name { get; set; } 
		public string url { get; set; } // Which endpoint to receive
		public Extapi.Parser parser { get; set; } // Which parse method to use
		//public int organization_id { get; set; } // Which organization will own this courses
		//public int user_id { get; set; } // Who will own this courses

		// When to receive the data, e.g. Every 02:00
		// DateTime is absolute time point.
		// TODO: Use scheduler types
		// How frequent to syncronize database? (Offset)
		// Which point in time to syncronize database? (Frequnecy)
		//public DateTime sync_time_point {get; set;} 
		//int interval;


	};


	public class External_Test
	{
		public void test1()
		{
			var data = new Extpoint[]
			{
				new Extpoint{id = 1, url="https://susanavet2.skolverket.se/api/1.1/infos/?configuration=kurs", parser=Extapi.Parser.SUSA_NAVET},
				new Extpoint{id = 2, url="https://learning4professionals.se/search?show=24", parser=Extapi.Parser.LEARNING_4_PROFESSIONALS},
				new Extpoint{id = 3, url="https://www.goteborgstekniskacollege.se/utbildningar/yrkeshogskola/utbildningar", parser=Extapi.Parser.GOTEBORGS_TEKNISKA_COLLAGE},
			};
		}
	};



}