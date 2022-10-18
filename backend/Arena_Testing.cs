using System;

namespace Arena;

public static class Testing
{

	public static void db_add_example(Arena_Context context)
	{
		var students = new User[]
		{
		new User{lastname="Carson",firstname="Alexander"},
		new User{lastname="Meredith",firstname="Alonso"},
		new User{lastname="Arturo",firstname="Anand"},
		new User{lastname="Gytis",firstname="Barzdukas"},
		new User{lastname="Yan",firstname="Li"},
		new User{lastname="Peggy",firstname="Justice"},
		new User{lastname="Laura",firstname="Norman"},
		new User{lastname="Nino",firstname="Olivetto"}
		};

		var courses = new Course[]
		{
		new Course{id=1050,title="Chemistry",category="Science"},
		new Course{id=4022,title="Microeconomics",category="Economics"},
		new Course{id=4041,title="Macroeconomics",category="Economics"},
		new Course{id=1045,title="Calculus",category="Math"},
		new Course{id=3141,title="Trigonometry",category="Math"},
		new Course{id=2021,title="Composition"},
		new Course{id=2042,title="Literature"}
		};

		var keywords = new Keyword[]
		{
			new Keyword{name="Artificiell Intelligens",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Bränsle",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Certifiering",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Design",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Digitalisering",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Energi",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Ekonomi",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Hållbarhet",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Produktion",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Ledarskap",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Miljö",is_category=true,is_tag=true,is_topic=true},
			new Keyword{name="Säkerhet",is_category=true,is_tag=true,is_topic=true},
			
			new Keyword{name="Math"},
			new Keyword{name="C#",is_tag=true},
			new Keyword{name="C++",is_tag=true},
			new Keyword{name="C",is_tag=true},
			new Keyword{name="Q#",is_tag=true},
			new Keyword{name="Java",is_tag=true},
			new Keyword{name="JavaScript",is_tag=true},
			new Keyword{name="TypeScript",is_tag=true},
			new Keyword{name="Elm",is_tag=true},
			new Keyword{name="Rust",is_tag=true},
			new Keyword{name="Python",is_tag=true},
			new Keyword{name="Julia",is_tag=true},
		};

		var course_keyword_edges = new Course_Keyword_Edge[]
		{
			new Course_Keyword_Edge{keyword_id=1, course_id=1045},
			new Course_Keyword_Edge{keyword_id=1, course_id=3141},
			new Course_Keyword_Edge{keyword_id=2, course_id=4022},
			new Course_Keyword_Edge{keyword_id=2, course_id=4041},
		};

		var enrollments = new Course_User_Edge[]
		{
		new Course_User_Edge{user_id=1,course_id=1050},
		new Course_User_Edge{user_id=1,course_id=4022},
		new Course_User_Edge{user_id=1,course_id=4041},
		new Course_User_Edge{user_id=2,course_id=1045},
		new Course_User_Edge{user_id=2,course_id=3141},
		new Course_User_Edge{user_id=2,course_id=2021},
		new Course_User_Edge{user_id=3,course_id=1050},
		new Course_User_Edge{user_id=4,course_id=1050},
		new Course_User_Edge{user_id=4,course_id=4022},
		new Course_User_Edge{user_id=5,course_id=4041},
		new Course_User_Edge{user_id=6,course_id=1045},
		new Course_User_Edge{user_id=7,course_id=3141},
		};




		foreach (Keyword s in keywords)
		{
			context.keywords.Add(s);
		}
		context.SaveChanges();
		foreach (User s in students)
		{
			context.users.Add(s);
		}
		context.SaveChanges();
		foreach (Course c in courses)
		{
			context.courses.Add(c);
		}
		context.SaveChanges();
		foreach (Course_Keyword_Edge s in course_keyword_edges)
		{
			context.course_keyword_edges.Add(s);
		}
		context.SaveChanges();
		foreach (Course_User_Edge e in enrollments)
		{
			context.course_user_edges.Add(e);
		}
		context.SaveChanges();
	}


}
