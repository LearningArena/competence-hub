using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class course : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "organization_id",
                table: "courses",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_courses_organization_id",
                table: "courses",
                column: "organization_id");

            migrationBuilder.AddForeignKey(
                name: "FK_courses_organizations_organization_id",
                table: "courses",
                column: "organization_id",
                principalTable: "organizations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_courses_organizations_organization_id",
                table: "courses");

            migrationBuilder.DropIndex(
                name: "IX_courses_organization_id",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "organization_id",
                table: "courses");
        }
    }
}
