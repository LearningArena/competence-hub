using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Arena.Migrations
{
    public partial class inquiry1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "inquiries",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inquiries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "inquiry_user_edges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    inquiry_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    relationship = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inquiry_user_edges", x => x.id);
                    table.ForeignKey(
                        name: "FK_inquiry_user_edges_inquiries_inquiry_id",
                        column: x => x.inquiry_id,
                        principalTable: "inquiries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_inquiry_user_edges_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_inquiry_user_edges_inquiry_id_user_id",
                table: "inquiry_user_edges",
                columns: new[] { "inquiry_id", "user_id" });

            migrationBuilder.CreateIndex(
                name: "IX_inquiry_user_edges_user_id",
                table: "inquiry_user_edges",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "inquiry_user_edges");

            migrationBuilder.DropTable(
                name: "inquiries");
        }
    }
}
