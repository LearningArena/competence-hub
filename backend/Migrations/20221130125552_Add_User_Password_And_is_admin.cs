using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arena.Migrations
{
    /// <inheritdoc />
    public partial class Add_User_Password_And_is_admin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "salthash",
                table: "users",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "salthash",
                table: "users");
        }
    }
}
