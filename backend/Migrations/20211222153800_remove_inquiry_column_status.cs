using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class remove_inquiry_column_status : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "inquiries");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "inquiries",
                type: "integer",
                nullable: true);
        }
    }
}
