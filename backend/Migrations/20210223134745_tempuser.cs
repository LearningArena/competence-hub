using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Arena.Migrations
{
    public partial class tempuser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tempusers",
                columns: table => new
                {
                    token = table.Column<Guid>(type: "uuid", nullable: false),
                    created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    expire = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    payload = table.Column<byte[]>(type: "bytea", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tempusers", x => x.token);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tempusers");
        }
    }
}
