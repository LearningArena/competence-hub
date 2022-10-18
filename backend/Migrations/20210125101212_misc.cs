using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class misc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email_of_contact_person",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "end_date",
                table: "inquiries",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "location",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "name_of_contact_person",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phonenumber_of_contact_person",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "start_date",
                table: "inquiries",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "studypace",
                table: "inquiries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "courses",
                type: "integer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "email_of_contact_person",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "end_date",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "location",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "name_of_contact_person",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "phonenumber_of_contact_person",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "start_date",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "studypace",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "status",
                table: "courses");
        }
    }
}
