using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Arena.Migrations
{
    public partial class fileitems3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "fileitems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "record_status",
                table: "fileitems",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "fileitem_user_edges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fileitem_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    relationship = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fileitem_user_edges", x => x.id);
                    table.ForeignKey(
                        name: "FK_fileitem_user_edges_fileitems_fileitem_id",
                        column: x => x.fileitem_id,
                        principalTable: "fileitems",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fileitem_user_edges_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fileitem_user_edges_fileitem_id_user_id",
                table: "fileitem_user_edges",
                columns: new[] { "fileitem_id", "user_id" });

            migrationBuilder.CreateIndex(
                name: "IX_fileitem_user_edges_user_id",
                table: "fileitem_user_edges",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fileitem_user_edges");

            migrationBuilder.DropColumn(
                name: "name",
                table: "fileitems");

            migrationBuilder.DropColumn(
                name: "record_status",
                table: "fileitems");
        }
    }
}
