using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Arena.Migrations
{
    /// <inheritdoc />
    public partial class CourseAddImportSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "import_source",
                table: "courses",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "import_source",
                table: "courses");
        }
    }
}
