using System;
using System.Linq;
using Serilog;
namespace Arena;

public static class Arena_Mgmnt
{
	private static readonly ILogger log = Log.ForContext(typeof(Arena_Mgmnt));

	public static int courses_cleanup(Arena_Context context)
	{
		// start_date passed by a margin => ARCHIVED (ARCHIVED/DRAFT excluded)
		// TODO: Any potential performance problems with loading big sets?
		var r = context.courses.Where(x => (x.record_status != Record_Status.ARCHIVED &&
											x.record_status != Record_Status.DRAFT &&
											x.start_date < DateTime.UtcNow)).ToList();
		int numChanges = r.Count();
		log.Information($"Cleanup, archiving {numChanges} course(s)");
		r.ForEach(x => x.record_status = Record_Status.ARCHIVED);

		// ARCHIVED and end_date 18 months past => RUBBISH
		r = context.courses.Where(x => (x.record_status != Record_Status.ARCHIVED &&
										x.start_date < DateTime.UtcNow.AddMonths(-18))).ToList();
		numChanges = numChanges + r.Count();
		log.Information($"Cleanup, moving {r.Count()} course(s) to rubbish");
		r.ForEach(x => x.record_status = Record_Status.RUBBISH);
   		context.SaveChanges();

		return numChanges;
	}


}
