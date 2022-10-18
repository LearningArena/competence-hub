using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class course_registrationdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "price",
                table: "courses");

            migrationBuilder.AddColumn<int>(
                name: "price",
                table: "courses",
                type: "integer",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "registration_end_date",
                table: "courses",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "registration_start_date",
                table: "courses",
                type: "timestamp without time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "registration_end_date",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "registration_start_date",
                table: "courses");

            migrationBuilder.AlterColumn<string>(
                name: "price",
                table: "courses",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
