using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "organization_id",
                table: "inquiries",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_inquiries_organization_id",
                table: "inquiries",
                column: "organization_id");

            migrationBuilder.AddForeignKey(
                name: "FK_inquiries_organizations_organization_id",
                table: "inquiries",
                column: "organization_id",
                principalTable: "organizations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_inquiries_organizations_organization_id",
                table: "inquiries");

            migrationBuilder.DropIndex(
                name: "IX_inquiries_organization_id",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "organization_id",
                table: "inquiries");
        }
    }
}
