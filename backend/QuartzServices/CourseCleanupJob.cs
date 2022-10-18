// using Microsoft.Extensions.Logging;
using Serilog;
using Quartz;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.Extensions.DependencyInjection;


// namespace QuartzServices
namespace Arena;
// {
    [DisallowConcurrentExecution]
    public class CourseCleanupJob : IJob
    {
        private readonly Serilog.ILogger _log = Log.ForContext<CourseCleanupJob>();
        private readonly IServiceProvider _provider;

        public CourseCleanupJob(Serilog.ILogger logger, IServiceProvider provider)
        {
            _provider = provider;
            _log = logger;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _log.Information($"CourseCleanupJob Job BEGIN {DateTime.UtcNow}");

            using(var scope = _provider.CreateScope())
            {
                Arena_Context c = scope.ServiceProvider.GetService<Arena_Context>();
                var numChanges = Arena_Mgmnt.courses_cleanup(c);
            }

            _log.Information($"CourseCleanupJob Job END {DateTime.UtcNow}");
        }
    }
// }
