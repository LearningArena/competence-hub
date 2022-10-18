using System;
using System.ComponentModel.DataAnnotations;

namespace Arena
{
	public class Tempuser
	{
		[Key]
		public Guid token { get; set; }
		public DateTime created { get; set; }
		public DateTime expire { get; set; }
		public byte[] payload { get; set; }

	};
}