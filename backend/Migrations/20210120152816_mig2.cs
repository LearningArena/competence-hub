using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class mig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "organizations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "website",
                table: "organizations",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "email",
                table: "organizations");

            migrationBuilder.DropColumn(
                name: "website",
                table: "organizations");
        }
    }
}
