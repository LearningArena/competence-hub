using System;

namespace Arena
{

	public class Verify_Info
	{
		public int id { get; set; }
		public Table name  { get; set; }
		public Record_Status status  { get; set; }

	};


	public class Login_Payload
	{
		public Guid keycloak_guid { get; set; }

	};



}
