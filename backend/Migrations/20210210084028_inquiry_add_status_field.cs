using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class inquiry_add_status_field : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "inquiries",
                type: "integer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "inquiries");
        }
    }
}
