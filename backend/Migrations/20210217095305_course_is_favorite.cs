using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class course_is_favorite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_favorite",
                table: "courses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_favorite",
                table: "courses");
        }
    }
}
