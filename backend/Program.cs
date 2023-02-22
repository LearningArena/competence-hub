using System;
using System.IO;
using System.Security.Principal;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Filters;
using Serilog.Sinks.PostgreSQL;
using Serilog.Sinks.PostgreSQL.ColumnWriters;
using NpgsqlTypes;
using Misc;
using Quartz;


//Arena_Sink.startbeats();
Log.Logger = new LoggerConfiguration()
	.WriteTo.Console()
	.WriteTo.Serilog_WS_Sink()
	.CreateBootstrapLogger();

{
	string s = "\n";
	foreach (System.Collections.DictionaryEntry env in Environment.GetEnvironmentVariables())
	{
		string name = (string)env.Key;
		string value = (string)env.Value;
		s += name + "=" + value + "\n";
		//Log.Information("{0}={1}", name, value);
	}
	Log.Information("Found these environment variables:" + s);
}

Arena.Arena_Email.get_environment_values();



Arena.Arena.config_keycloak_arenaclient = new Arena.Keycloak_Config()
{
	realm = Environment.GetEnvironmentVariable("keycloak_arenaclient_realm"),
	auth_server_url = Environment.GetEnvironmentVariable("keycloak_arenaclient_auth_server_url"),
	resource = Environment.GetEnvironmentVariable("keycloak_arenaclient_resource"),
	credentials_secret = Environment.GetEnvironmentVariable("keycloak_arenaclient_credentials_secret"),
};
Arena.Arena.config_keycloak_admincli = new Arena.Keycloak_Config()
{
	realm = Environment.GetEnvironmentVariable("keycloak_admincli_realm"),
	auth_server_url = Environment.GetEnvironmentVariable("keycloak_admincli_auth_server_url"),
	resource = Environment.GetEnvironmentVariable("keycloak_admincli_resource"),
	credentials_secret = Environment.GetEnvironmentVariable("keycloak_admincli_credentials_secret"),
};


{
	// PostmarkClient requires a token which is used to connect to external service:
	// This can not check if token is invalid.
	// An email need to be sent to verify if token is invalid:
	//Arena.require_environment_variable("POSTMARK_SERVER_TOKEN");
	string a = Environment.GetEnvironmentVariable("POSTMARK_SERVER_TOKEN");
	Arena.Arena_Email.init(a);
}


WebApplicationBuilder builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
	Args = args,
	ApplicationName = typeof(Program).Assembly.FullName,
	ContentRootPath = Directory.GetCurrentDirectory(),
	EnvironmentName = Environments.Production,
	WebRootPath = "../wwwroot"
});

string connectionString = "SERVER=" + Environment.GetEnvironmentVariable("POSTGRES_HOST") +
						";PORT=" + Environment.GetEnvironmentVariable("POSTGRES_PORT") +
						";DATABASE=" + Environment.GetEnvironmentVariable("POSTGRES_DB") +
						";USER ID=" + Environment.GetEnvironmentVariable("POSTGRES_USER") +
						";PASSWORD=" + Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
IDictionary<string, ColumnWriterBase> columnWriters = new Dictionary<string, ColumnWriterBase>
{
    { "message", new RenderedMessageColumnWriter(NpgsqlDbType.Text) },
	{ "raise_date", new TimestampColumnWriter(NpgsqlDbType.TimestampTz) }
};
builder.Host.UseSerilog((ctx, lc) => lc.
	WriteTo.Console().
	WriteTo.Serilog_WS_Sink().
	WriteTo.Logger(lc => lc
		.Filter.ByIncludingOnly(Serilog.Filters.Matching.WithProperty<string>("LogType", w => w.StartsWith(Extapi.Externaldata.LOGTYPE_FILE_PREFIX)))
		.WriteTo.File("log_import_.csv",
						outputTemplate: "{Timestamp:yyyy-MM-dd'T'HH:mm:sszzz}, {Level:u3}, {Message:lj}{NewLine}",
						rollingInterval: RollingInterval.Month,
						retainedFileCountLimit: 3)).
	WriteTo.Logger(lc => lc
		.Filter.ByIncludingOnly(Serilog.Filters.Matching.WithProperty<string>("LogType", w => w.StartsWith(Extapi.Externaldata.LOGTYPE_SYSTEM_PREFIX)))
		.WriteTo.PostgreSQL(
						connectionString,
						"log",
						columnWriters,
						needAutoCreateTable: true,
						useCopy: false
						))
);
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);
builder.Services.AddHttpContextAccessor();
builder.Services.AddRouting();
builder.Services.AddDbContext<Arena.Arena_Context>(ServiceLifetime.Transient);
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
	options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
	options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = "Keycloak";
})
.AddCookie(options =>
{
	//Allow frontend team to login from a localhost:
	//This might reduce security and should be turned off in production:
	options.Cookie.HttpOnly = false;
	options.Cookie.SameSite = SameSiteMode.None;
	options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
	options.Cookie.IsEssential = true;
});
builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();
 
    var courseImportJobKey = new JobKey("CourseImportJob");
    q.AddJob<Arena.CourseImportJob>(opts => opts.WithIdentity(courseImportJobKey));
    q.AddTrigger(opts => opts
        .ForJob(courseImportJobKey)
        .WithIdentity("CourseImportJob-trigger")
		.WithCronSchedule("0 45 4 ? * *")); // TODO: Twice a week at 04:45 (SUSA finishes at 03:45). Format "<sec> <min> <hour> <day-month> <month> <day-week>"
});
builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();
 
    var courseCleanupJobKey = new JobKey("CourseCleanupJob");
    q.AddJob<Arena.CourseCleanupJob>(opts => opts.WithIdentity(courseCleanupJobKey));
    q.AddTrigger(opts => opts
        .ForJob(courseCleanupJobKey)
        .WithIdentity("CourseCleanupJob-trigger")
		.WithCronSchedule("0 45 6 ? * WED,SAT")); // Twice a week at 06:45, after above import should be done
});
builder.Services.AddQuartzHostedService(
    q => q.WaitForJobsToComplete = true);

Arena.GraphQL_Services.setup(builder.Services);


WebApplication app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
	app.UseDeveloperExceptionPage();
}

Arena.DB.init(app);

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


/*
app.UseCors(x => x
	.AllowAnyOrigin()
	.AllowAnyMethod()
	.AllowAnyHeader());
*/
app.UseSerilogRequestLogging();
app.UseForwardedHeaders();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();
app.UseWebSockets();
app.UseFileServer();
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
	FileProvider = new PhysicalFileProvider(System.IO.Path.Combine(app.Environment.ContentRootPath, "../media")),
	RequestPath = "/media",
});
app.UseStaticFiles(new StaticFileOptions
{
	FileProvider = new PhysicalFileProvider(System.IO.Path.Combine(app.Environment.ContentRootPath, "../devzone")),
	RequestPath = "/devzone",
	OnPrepareResponse = x => Arena.Arena.OnPrepareResponse_Authentication(app, x)
});
app.UseEndpoints(endpoints =>
{
	endpoints.MapGraphQL();
	endpoints.MapDefaultControllerRoute();
	endpoints.MapFallbackToFile("/index.html");
});


app.Run();
