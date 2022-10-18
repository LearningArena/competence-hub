using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class remove_unused_columns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date",
                table: "course_user_edges");

            migrationBuilder.DropColumn(
                name: "grade",
                table: "course_user_edges");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date",
                table: "course_user_edges",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "grade",
                table: "course_user_edges",
                type: "integer",
                nullable: true);
        }
    }
}
