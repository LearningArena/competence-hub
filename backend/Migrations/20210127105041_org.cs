using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class org : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "record_status",
                table: "organizations",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "record_status",
                table: "organizations");
        }
    }
}
