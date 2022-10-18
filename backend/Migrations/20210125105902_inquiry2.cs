using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class inquiry2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "category",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "inquiries",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "category",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "description",
                table: "inquiries");
        }
    }
}
