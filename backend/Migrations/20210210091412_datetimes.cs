using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class datetimes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "inquiries",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "inquiries",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "courses",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "courses",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "time_created",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "inquiries");

            migrationBuilder.DropColumn(
                name: "time_created",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "courses");
        }
    }
}
