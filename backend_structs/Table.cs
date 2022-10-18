using System;

namespace Arena
{
	[Flags]
	public enum Table
	{
		UNKNOWN,
		USERS,
		ORGANIZATIONS,
		COURSES,
		INQUIRIES,
		FILEITEMS,
		KEYWORDS,
		TEMPUSERS,
		LANGUAGES,
		CONTENTS,
		EXTPOINTS,

/*
		COURSE_USER_EDGES,
		INQUIRIES_USER_EDGES,
		FILEITEMS_USER_EDGES,
		ORGANIZATIONS_USER_EDGES,
		*/

	}

	public static class Tablef
	{
		public static string str(Table table)
		{
			switch(table)
			{
			// Plain tables:
			case Table.USERS:return "users";
			case Table.COURSES:return "courses";
			case Table.INQUIRIES:return "inquiries";
			case Table.ORGANIZATIONS:return "organizations";
			case Table.FILEITEMS:return "fileitems";
			case Table.KEYWORDS:return "keywords";
			case Table.TEMPUSERS:return "tempusers";
			case Table.LANGUAGES:return "languages";
			case Table.CONTENTS:return "contents";
			case Table.EXTPOINTS:return "extpoints";

			// Many to Many relation tables:
			// Double cases to make sure its symetrical palindrom (t1,relation,t2) <=> (t2,relation,t1).
			case Table.COURSES | (Table)((int)Table.USERS << 16):
			case Table.USERS | (Table)((int)Table.COURSES << 16):
			return "course_user_edges";
			case Table.INQUIRIES | (Table)((int)Table.USERS << 16):
			case Table.USERS | (Table)((int)Table.INQUIRIES << 16):
			return "inquiry_user_edges";
			case Table.FILEITEMS | (Table)((int)Table.USERS << 16):
			case Table.USERS | (Table)((int)Table.FILEITEMS << 16):
			return "fileitem_user_edges";
			case Table.ORGANIZATIONS | (Table)((int)Table.USERS << 16):
			case Table.USERS | (Table)((int)Table.ORGANIZATIONS << 16):
			return "organization_user_edges";
			case Table.ORGANIZATIONS | (Table)((int)Table.COURSES << 16):
			case Table.COURSES | (Table)((int)Table.ORGANIZATIONS << 16):
			return "organization_course_edges";
			case Table.COURSES | (Table)((int)Table.KEYWORDS << 16):
			case Table.KEYWORDS | (Table)((int)Table.COURSES << 16):
			return "course_keyword_edges";
			case Table.CONTENTS | (Table)((int)Table.USERS << 16):
			case Table.USERS | (Table)((int)Table.CONTENTS << 16):
			return "user_content_edges";
			}
			return null;
		}
		public static string str(Table t1, Table t2)
		{
			return str(t1 | (Table)((int)t2 << 16));
		}

		public static string str_singular(Table table)
		{
			switch(table)
			{
			case Table.USERS:return "user";
			case Table.COURSES:return "course";
			case Table.INQUIRIES:return "inquiry";
			case Table.ORGANIZATIONS:return "organization";
			case Table.FILEITEMS:return "fileitem";
			case Table.KEYWORDS:return "keyword";
			case Table.LANGUAGES:return "language";
			case Table.CONTENTS:return "content";
			case Table.EXTPOINTS:return "extpoint";
			}
			return null;
		}





	};



}