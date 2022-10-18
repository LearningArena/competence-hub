using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Serilog;

//https://www.compose.com/articles/code-first-database-design-with-entity-framework-and-postgresql/


namespace Arena;


public class Arena_Context : DbContext
{
	private readonly ILoggerFactory _loggerFactory;
	private readonly Serilog.ILogger log = Log.ForContext<Arena_Context>();
	public readonly IHttpContextAccessor http_context;

	public Arena_Context(ILoggerFactory loggerFactory, IHttpContextAccessor httpContextAccessor)
	{
		_loggerFactory = loggerFactory;
		http_context = httpContextAccessor;
	}

	public DbSet<Fileitem> fileitems { get; set; }
	public DbSet<Tempuser> tempusers { get; set; }
	public DbSet<User> users { get; set; }
	public DbSet<Course> courses { get; set; }
	public DbSet<Inquiry> inquiries { get; set; }
	public DbSet<Keyword> keywords { get; set; }
	public DbSet<Organization> organizations { get; set; }
	public DbSet<Language> languages { get; set; }
	public DbSet<Content> contents { get; set; }
	public DbSet<Attribute> attributes { get; set; }
	public DbSet<Extpoint> extpoints { get; set; }
	public DbSet<Fileitem_User_Edge> fileitem_user_edges { get; set; }
	public DbSet<Course_User_Edge> course_user_edges { get; set; }
	public DbSet<Course_Keyword_Edge> course_keyword_edges { get; set; }
	public DbSet<Organization_User_Edge> organization_user_edges { get; set; }
	public DbSet<Organization_Course_Edge> organization_course_edges { get; set; }
	public DbSet<Inquiry_User_Edge> inquiry_user_edges { get; set; }
	public DbSet<User_Content_Edge> user_content_edges { get; set; }


	//dotnet ef migrations add migration1
	//
	protected override void OnConfiguring(DbContextOptionsBuilder options)
	{
		Arena.require_environment_variable("POSTGRES_HOST");
		Arena.require_environment_variable("POSTGRES_PORT");
		Arena.require_environment_variable("POSTGRES_USER");
		Arena.require_environment_variable("POSTGRES_DB");
		Arena.require_environment_variable("POSTGRES_PASSWORD");
		string host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
		string port = Environment.GetEnvironmentVariable("POSTGRES_PORT"); //Usually 5432
		string user = Environment.GetEnvironmentVariable("POSTGRES_USER");
		string db = Environment.GetEnvironmentVariable("POSTGRES_DB");
		string pw = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
		string s = "Host=" + host + ";Port=" + port + ";Database=" + db + ";Username=" + user + ";Password=" + pw + "";
		log.Verbose("Arena: UseNpgsql: " + s);
		options.UseNpgsql(s);
		options.UseLoggerFactory(_loggerFactory);
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<User>()
			.HasMany(t => t.course_user_edges)
			.WithOne(t => t.user)
			.HasForeignKey(t => t.user_id);
		modelBuilder.Entity<User>()
			.HasMany(t => t.organization_user_edges)
			.WithOne(t => t.user)
			.HasForeignKey(t => t.user_id);
		modelBuilder.Entity<User>()
			.HasMany(t => t.inquiry_user_edges)
			.WithOne(t => t.user)
			.HasForeignKey(t => t.user_id);
		modelBuilder.Entity<User>()
			.HasMany(t => t.fileitem_user_edges)
			.WithOne(t => t.user)
			.HasForeignKey(t => t.user_id);
		modelBuilder.Entity<User>()
			.HasMany(t => t.user_content_edges)
			.WithOne(t => t.user)
			.HasForeignKey(t => t.user_id);

		modelBuilder.Entity<Keyword>()
			.HasMany(t => t.course_keyword_edges)
			.WithOne(t => t.keyword)
			.HasForeignKey(t => t.keyword_id);


		modelBuilder.Entity<Organization>()
			.HasMany(t => t.organization_user_edges)
			.WithOne(t => t.organization)
			.HasForeignKey(t => t.organization_id);
			
		modelBuilder.Entity<Organization>()
			.HasMany(t => t.organization_course_edges)
			.WithOne(t => t.organization)
			.HasForeignKey(t => t.organization_id);

		modelBuilder.Entity<Fileitem>()
			.HasMany(t => t.fileitem_user_edges)
			.WithOne(t => t.fileitem)
			.HasForeignKey(t => t.fileitem_id);

		modelBuilder.Entity<Course>()
			.HasMany(t => t.organization_course_edges)
			.WithOne(t => t.course)
			.HasForeignKey(t => t.course_id);

		modelBuilder.Entity<Course>()
			.HasMany(t => t.course_user_edges)
			.WithOne(t => t.course)
			.HasForeignKey(t => t.course_id);

		modelBuilder.Entity<Course>()
			.HasMany(t => t.course_keyword_edges)
			.WithOne(t => t.course)
			.HasForeignKey(t => t.course_id);

		modelBuilder.Entity<Content>()
			.HasMany(t => t.user_content_edges)
			.WithOne(t => t.content)
			.HasForeignKey(t => t.content_id);


		modelBuilder.Entity<Inquiry>()
			.HasMany(t => t.inquiry_user_edges)
			.WithOne(t => t.inquiry)
			.HasForeignKey(t => t.inquiry_id);

		modelBuilder.Entity<Organization>()
			.HasMany(t => t.inquiries)
			.WithOne(t => t.organization)
			.HasForeignKey(t => t.organization_id);

		modelBuilder.Entity<Organization>()
			.HasMany(t => t.courses)
			.WithOne(t => t.organization)
			.HasForeignKey(t => t.organization_id);

		modelBuilder.Entity<Course_User_Edge>()
			.HasIndex(t => new { t.user_id, t.course_id });

		modelBuilder.Entity<Course_Keyword_Edge>()
			.HasIndex(t => new { t.keyword_id, t.course_id });

		modelBuilder.Entity<Organization_User_Edge>()
			.HasIndex(t => new { t.organization_id, t.user_id });

		modelBuilder.Entity<Organization_Course_Edge>()
			.HasIndex(t => new { t.organization_id, t.course_id });

		modelBuilder.Entity<Inquiry_User_Edge>()
			.HasIndex(t => new { t.inquiry_id, t.user_id });

		modelBuilder.Entity<Fileitem_User_Edge>()
			.HasIndex(t => new { t.fileitem_id, t.user_id });

		modelBuilder.Entity<User_Content_Edge>()
			.HasIndex(t => new { t.user_id, t.content_id });
	}

	public string claim(string claimtype) => http_context.HttpContext.User.Claims.Where(c => c.Type == claimtype).Select(x => x.Value).FirstOrDefault();
	public bool is_siteadmin() => claim("/Siteadmin") != null;
	public int claim_int_or_default(string claimtype, int def = Arena.USER_ID_GUEST)
	{
		int val = def;
		Int32.TryParse(claim(claimtype), out val);
		return val;
	}

	public int current_user_id() => claim_int_or_default(Arena_Claims.ARENA_USER_ID, Arena.USER_ID_GUEST);
	public int current_user_id_impostor() => claim_int_or_default(Arena_Claims.ARENA_USER_ID_IMPOSTOR, Arena.USER_ID_GUEST);

	public int current_user_id(Record_Status record_status)
	{
		int user_id = current_user_id();
		if (user_id == Arena.USER_ID_GUEST) {return Arena.USER_ID_GUEST;}
		if (users.Any(x => (x.id == user_id) && (x.record_status == record_status)))
		{
			return user_id;
		}
		return Arena.USER_ID_UNAUTHORIZED;
	}

	public async Task<bool> impersonate(int user_id)
	{
		if (is_siteadmin() == false){return false;}
		ClaimsPrincipal principal = Arena_Claims.impersonate(http_context.HttpContext.User, user_id);
		await http_context.HttpContext.SignInAsync(principal, Arena.authentication_properties);
		return true;
	}

	public IQueryable<User> user_current()
	{
		int user_id = current_user_id();
		if (user_id == Arena.USER_ID_GUEST) {return null;}
		var q = users.Where(x => x.id == user_id);
		return q;
	}

	public IQueryable<User> user_current_impostor()
	{
		int user_id = current_user_id_impostor();
		if (user_id == Arena.USER_ID_GUEST) {return null;}
		var q = users.Where(x => x.id == user_id);
		return q;
	}

	public IQueryable<Organization> organizations_by_current_user(Relationship relationship)
	{
		int user_id = current_user_id();
		if (user_id == Arena.USER_ID_GUEST) {return null;}
		var q = organizations.Where(x => x.organization_user_edges.Any(y => y.user_id == user_id && y.relationship == relationship));
		return q;
	}

	public string generate_hyperlink_verify(string table, int id)
	{
		TimeSpan duration = TimeSpan.FromMinutes(1);
		Verify_Info v = new Verify_Info
		{
			id = id,
			//expire = DateTime.UtcNow.Add(duration), 
			status = Record_Status.APPROVED
		};
		switch(table)
		{
		case "users":
			v.name = Table.USERS;
			break;
		case "organization":
			v.name = Table.ORGANIZATIONS;
			break;
		}
		string s = JsonSerializer.Serialize(v);
		Tempuser u = new Tempuser
		{
			token = Guid.NewGuid(),
			created = DateTime.UtcNow,
			expire = DateTime.UtcNow.Add(duration),
			payload = Cryptor.encrypt(s, Arena.aes.Key, Arena.aes.IV),
		};
		
		string url = "/verify_fromtoken/" + Base64UrlTextEncoder.Encode(u.token.ToByteArray()) + "/" + Base64UrlTextEncoder.Encode(u.payload);
		tempusers.Add(u);
		SaveChanges();
		return url;
	}


	public string generate_hyperlink_login_from_user(User user)
	{
		if (user == null)
		{
			return null;
		}
		Login_Payload payload = new Login_Payload
		{
			keycloak_guid = user.keycloak_guid
		};
		string s = JsonSerializer.Serialize(payload);
		Tempuser u = new Tempuser
		{
			token = Guid.NewGuid(),
			created = DateTime.UtcNow,
			expire = DateTime.UtcNow.Add(TimeSpan.FromMinutes(10)),
			payload = Cryptor.encrypt(s, Arena.aes.Key, Arena.aes.IV),
		};
		string url = "/login_fromtoken/" + Base64UrlTextEncoder.Encode(u.token.ToByteArray()) + "/" + Base64UrlTextEncoder.Encode(u.payload);
		tempusers.Add(u);
		SaveChanges();
		return url;
	}


	public void increment_views(Table t, int id)
	{
		switch(t)
		{
		case Table.COURSES:
			Database.ExecuteSqlRaw("UPDATE courses SET views = views + 1 WHERE id = @p0", id);
			break;
		}
	}


}

