using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class add_time_columns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "users",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "users",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "organizations",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "organizations",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "keywords",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "keywords",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_created",
                table: "fileitems",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "time_modified",
                table: "fileitems",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "time_created",
                table: "users");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "users");

            migrationBuilder.DropColumn(
                name: "time_created",
                table: "organizations");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "organizations");

            migrationBuilder.DropColumn(
                name: "time_created",
                table: "keywords");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "keywords");

            migrationBuilder.DropColumn(
                name: "time_created",
                table: "fileitems");

            migrationBuilder.DropColumn(
                name: "time_modified",
                table: "fileitems");
        }
    }
}
