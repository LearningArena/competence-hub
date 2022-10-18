using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class Add_Keyword_record_status_column : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "record_status",
                table: "keywords",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "record_status",
                table: "keywords");
        }
    }
}
