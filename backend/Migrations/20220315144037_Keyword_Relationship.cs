using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arena.Migrations
{
    public partial class Keyword_Relationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "relationship",
                table: "course_keyword_edges",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "relationship",
                table: "course_keyword_edges");
        }
    }
}
