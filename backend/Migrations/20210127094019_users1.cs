using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class users1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "preference_language",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "preference_language",
                table: "users");
        }
    }
}
