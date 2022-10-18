using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class added_course_column_views : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "views",
                table: "courses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "views",
                table: "courses");
        }
    }
}
