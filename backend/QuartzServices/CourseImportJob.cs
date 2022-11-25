using Serilog;
using Quartz;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;


// namespace QuartzServices
namespace Arena;

[DisallowConcurrentExecution]
public class CourseImportJob : IJob
{
    private readonly Serilog.ILogger _log = Log.ForContext<CourseImportJob>();
    private readonly IServiceProvider _provider;

    public CourseImportJob(Serilog.ILogger logger, IServiceProvider provider)
    {
        _provider = provider;
        _log = logger;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _log.Information($"CourseImportJob Job BEGIN {DateTime.UtcNow}");

        using(var scope = _provider.CreateScope())
        {
            Arena_Context c = scope.ServiceProvider.GetService<Arena_Context>();
            var numChanges = 0;
            foreach (KeyValuePair<Extapi.Parser, string> src in Extapi.Endpoints.urls)
            {
                if (src.Key != Extapi.Parser.SUSA_NAVET) { continue; } // TODO: Remove! Eventually ...
                try
                {
                    numChanges += Arena_Import.external_import(c, src.Key);//);
                }
                catch (Exception ex) {
                    _log.Error($"CourseImportJob, exception for {src.Key} caught: " + ex.Message);
                    _log.Information("{LogType}, {ImportEvent}, {InfoType}, {ID}, {URL}, {More}",
                        Extapi.Externaldata.LOGTYPE_FILE_PREFIX+src.Key.ToString(),
                        "Exception",
                        "",
                        "",
                        "",
                        "{exception : " + ex.Message + "}");
                }
            }                
        }

        _log.Information($"CourseImportJob Job END {DateTime.UtcNow}");
    }
}
