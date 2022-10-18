using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Arena.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "courses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    credits = table.Column<int>(type: "integer", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    studyform = table.Column<int>(type: "integer", nullable: true),
                    level = table.Column<int>(type: "integer", nullable: true),
                    online = table.Column<int>(type: "integer", nullable: true),
                    seqf = table.Column<int>(type: "integer", nullable: true),
                    hours = table.Column<int>(type: "integer", nullable: true),
                    hogskolapoang = table.Column<int>(type: "integer", nullable: true),
                    yrkeshogskolepoang = table.Column<int>(type: "integer", nullable: true),
                    type = table.Column<int>(type: "integer", nullable: true),
                    required_tools = table.Column<string>(type: "text", nullable: true),
                    prerequisite = table.Column<string>(type: "text", nullable: true),
                    literature = table.Column<string>(type: "text", nullable: true),
                    verbs = table.Column<string>(type: "text", nullable: true),
                    studypace = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<string>(type: "text", nullable: true),
                    diplomas = table.Column<string>(type: "text", nullable: true),
                    target_group = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    title = table.Column<string>(type: "text", nullable: true),
                    subtitle = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: true),
                    teachers = table.Column<string>(type: "text", nullable: true),
                    bioteachers = table.Column<string>(type: "text", nullable: true),
                    education_provider = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "text", nullable: true),
                    language = table.Column<string>(type: "text", nullable: true),
                    link = table.Column<string>(type: "text", nullable: true),
                    name_of_contact_person = table.Column<string>(type: "text", nullable: true),
                    email_of_contact_person = table.Column<string>(type: "text", nullable: true),
                    image_company_logo = table.Column<string>(type: "text", nullable: true),
                    image_course_banner = table.Column<string>(type: "text", nullable: true),
                    image_teacher = table.Column<string>(type: "text", nullable: true),
                    image_feature = table.Column<string>(type: "text", nullable: true),
                    image_provider = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "keywords",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    is_category = table.Column<bool>(type: "boolean", nullable: false),
                    is_topic = table.Column<bool>(type: "boolean", nullable: false),
                    is_tag = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_keywords", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "organizations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    address = table.Column<string>(type: "text", nullable: true),
                    image_logo = table.Column<string>(type: "text", nullable: true),
                    orgid_se = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organizations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    keycloak_guid = table.Column<Guid>(type: "uuid", nullable: false),
                    preference = table.Column<int>(type: "integer", nullable: false),
                    username = table.Column<string>(type: "text", nullable: true),
                    firstname = table.Column<string>(type: "text", nullable: true),
                    lastname = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "course_properties",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<int>(type: "integer", nullable: false),
                    language = table.Column<int>(type: "integer", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true),
                    course_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_properties", x => x.id);
                    table.ForeignKey(
                        name: "FK_course_properties_courses_course_id",
                        column: x => x.course_id,
                        principalTable: "courses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "course_keyword_edges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    course_id = table.Column<int>(type: "integer", nullable: false),
                    keyword_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_keyword_edges", x => x.id);
                    table.ForeignKey(
                        name: "FK_course_keyword_edges_courses_course_id",
                        column: x => x.course_id,
                        principalTable: "courses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_course_keyword_edges_keywords_keyword_id",
                        column: x => x.keyword_id,
                        principalTable: "keywords",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "course_user_edges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    course_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    relationship = table.Column<int>(type: "integer", nullable: false),
                    grade = table.Column<int>(type: "integer", nullable: true),
                    date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_user_edges", x => x.id);
                    table.ForeignKey(
                        name: "FK_course_user_edges_courses_course_id",
                        column: x => x.course_id,
                        principalTable: "courses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_course_user_edges_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "organization_user_edges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    organization_id = table.Column<int>(type: "integer", nullable: false),
                    relationship = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization_user_edges", x => x.id);
                    table.ForeignKey(
                        name: "FK_organization_user_edges_organizations_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organizations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_organization_user_edges_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_course_keyword_edges_course_id",
                table: "course_keyword_edges",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_course_keyword_edges_keyword_id_course_id",
                table: "course_keyword_edges",
                columns: new[] { "keyword_id", "course_id" });

            migrationBuilder.CreateIndex(
                name: "IX_course_properties_course_id",
                table: "course_properties",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_course_user_edges_course_id",
                table: "course_user_edges",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_course_user_edges_user_id_course_id",
                table: "course_user_edges",
                columns: new[] { "user_id", "course_id" });

            migrationBuilder.CreateIndex(
                name: "IX_organization_user_edges_organization_id_user_id",
                table: "organization_user_edges",
                columns: new[] { "organization_id", "user_id" });

            migrationBuilder.CreateIndex(
                name: "IX_organization_user_edges_user_id",
                table: "organization_user_edges",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "course_keyword_edges");

            migrationBuilder.DropTable(
                name: "course_properties");

            migrationBuilder.DropTable(
                name: "course_user_edges");

            migrationBuilder.DropTable(
                name: "organization_user_edges");

            migrationBuilder.DropTable(
                name: "keywords");

            migrationBuilder.DropTable(
                name: "courses");

            migrationBuilder.DropTable(
                name: "organizations");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
