using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class inquiry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "target",
                table: "inquiries",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "target",
                table: "inquiries");
        }
    }
}
