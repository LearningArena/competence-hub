using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arena.Migrations
{
    public partial class external_id_to_external_stringid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "external_id",
                table: "courses",
                newName: "external_stringid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "external_stringid",
                table: "courses",
                newName: "external_id");
        }
    }
}
