using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class mig1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "orgid_se",
                table: "organizations",
                newName: "orgid");

            migrationBuilder.AddColumn<int>(
                name: "country_code",
                table: "organizations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "organizations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phonenumber",
                table: "organizations",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country_code",
                table: "organizations");

            migrationBuilder.DropColumn(
                name: "description",
                table: "organizations");

            migrationBuilder.DropColumn(
                name: "orgid",
                table: "organizations");

            migrationBuilder.RenameColumn(
                name: "phonenumber",
                table: "organizations",
                newName: "orgid_se");
        }
    }
}
