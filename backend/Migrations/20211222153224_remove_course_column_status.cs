using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class remove_course_column_status : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "courses");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "courses",
                type: "integer",
                nullable: true);
        }
    }
}
