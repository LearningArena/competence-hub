﻿// <auto-generated />
using System;
using Arena;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Arena.Migrations
{
    [DbContext(typeof(Arena_Context))]
    partial class Arena_ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-preview.4.22229.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Arena.Attribute", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.ToTable("attributes");
                });

            modelBuilder.Entity("Arena.Content", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("attribute_id")
                        .HasColumnType("integer");

                    b.Property<string>("content")
                        .HasColumnType("text");

                    b.Property<int>("language_id")
                        .HasColumnType("integer");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("attribute_id");

                    b.HasIndex("language_id");

                    b.ToTable("contents");
                });

            modelBuilder.Entity("Arena.Course", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("bioteachers")
                        .HasColumnType("text");

                    b.Property<string>("category")
                        .HasColumnType("text");

                    b.Property<string>("city")
                        .HasColumnType("text");

                    b.Property<float?>("credits")
                        .HasColumnType("real");

                    b.Property<string>("description")
                        .HasColumnType("text");

                    b.Property<string>("diplomas")
                        .HasColumnType("text");

                    b.Property<string>("education_provider")
                        .HasColumnType("text");

                    b.Property<string>("email_of_contact_person")
                        .HasColumnType("text");

                    b.Property<DateTime?>("end_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("external_stringid")
                        .HasColumnType("text");

                    b.Property<float?>("hogskolapoang")
                        .HasColumnType("real");

                    b.Property<int?>("hours")
                        .HasColumnType("integer");

                    b.Property<string>("image_company_logo")
                        .HasColumnType("text");

                    b.Property<string>("image_course_banner")
                        .HasColumnType("text");

                    b.Property<string>("image_feature")
                        .HasColumnType("text");

                    b.Property<string>("image_provider")
                        .HasColumnType("text");

                    b.Property<string>("image_teacher")
                        .HasColumnType("text");

                    b.Property<bool>("is_favorite")
                        .HasColumnType("boolean");

                    b.Property<string>("language")
                        .HasColumnType("text");

                    b.Property<int?>("level")
                        .HasColumnType("integer");

                    b.Property<string>("link")
                        .HasColumnType("text");

                    b.Property<string>("literature")
                        .HasColumnType("text");

                    b.Property<string>("name_of_contact_person")
                        .HasColumnType("text");

                    b.Property<int?>("online")
                        .HasColumnType("integer");

                    b.Property<int?>("organization_id")
                        .HasColumnType("integer");

                    b.Property<string>("prerequisite")
                        .HasColumnType("text");

                    b.Property<int?>("price")
                        .HasColumnType("integer");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("registration_end_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("registration_start_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("required_tools")
                        .HasColumnType("text");

                    b.Property<int?>("seqf")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("start_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("studyform")
                        .HasColumnType("integer");

                    b.Property<string>("studypace")
                        .HasColumnType("text");

                    b.Property<string>("subtitle")
                        .HasColumnType("text");

                    b.Property<string>("target_group")
                        .HasColumnType("text");

                    b.Property<string>("teachers")
                        .HasColumnType("text");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("title")
                        .HasColumnType("text");

                    b.Property<int?>("type")
                        .HasColumnType("integer");

                    b.Property<string>("verbs")
                        .HasColumnType("text");

                    b.Property<int>("views")
                        .HasColumnType("integer");

                    b.Property<float?>("yrkeshogskolepoang")
                        .HasColumnType("real");

                    b.HasKey("id");

                    b.HasIndex("organization_id");

                    b.ToTable("courses");
                });

            modelBuilder.Entity("Arena.Course_Keyword_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<int>("keyword_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("course_id");

                    b.HasIndex("keyword_id", "course_id");

                    b.ToTable("course_keyword_edges");
                });

            modelBuilder.Entity("Arena.Course_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.Property<int>("user_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("course_id");

                    b.HasIndex("user_id", "course_id");

                    b.ToTable("course_user_edges");
                });

            modelBuilder.Entity("Arena.Extpoint", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<int>("parser")
                        .HasColumnType("integer");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<string>("url")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("extpoints");
                });

            modelBuilder.Entity("Arena.Fileitem", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("kind")
                        .HasColumnType("integer");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<string>("path")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("id");

                    b.ToTable("fileitems");
                });

            modelBuilder.Entity("Arena.Fileitem_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("fileitem_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.Property<int>("user_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("user_id");

                    b.HasIndex("fileitem_id", "user_id");

                    b.ToTable("fileitem_user_edges");
                });

            modelBuilder.Entity("Arena.Inquiry", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("category")
                        .HasColumnType("text");

                    b.Property<string>("description")
                        .HasColumnType("text");

                    b.Property<string>("email_of_contact_person")
                        .HasColumnType("text");

                    b.Property<DateTime?>("end_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("location")
                        .HasColumnType("text");

                    b.Property<string>("name_of_contact_person")
                        .HasColumnType("text");

                    b.Property<int?>("organization_id")
                        .HasColumnType("integer");

                    b.Property<string>("phonenumber_of_contact_person")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("start_date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("studypace")
                        .HasColumnType("text");

                    b.Property<int>("target")
                        .HasColumnType("integer");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("title")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.HasIndex("organization_id");

                    b.ToTable("inquiries");
                });

            modelBuilder.Entity("Arena.Inquiry_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("inquiry_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.Property<string>("title")
                        .HasColumnType("text");

                    b.Property<int>("user_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("user_id");

                    b.HasIndex("inquiry_id", "user_id");

                    b.ToTable("inquiry_user_edges");
                });

            modelBuilder.Entity("Arena.Keyword", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<bool>("is_category")
                        .HasColumnType("boolean");

                    b.Property<bool>("is_tag")
                        .HasColumnType("boolean");

                    b.Property<bool>("is_topic")
                        .HasColumnType("boolean");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("id");

                    b.ToTable("keywords");
                });

            modelBuilder.Entity("Arena.Language", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.ToTable("languages");
                });

            modelBuilder.Entity("Arena.Organization", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("address")
                        .HasColumnType("text");

                    b.Property<int>("country_code")
                        .HasColumnType("integer");

                    b.Property<string>("description")
                        .HasColumnType("text");

                    b.Property<string>("email")
                        .HasColumnType("text");

                    b.Property<string>("image_logo")
                        .HasColumnType("text");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.Property<string>("orgid")
                        .HasColumnType("text");

                    b.Property<string>("phonenumber")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("website")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("organizations");
                });

            modelBuilder.Entity("Arena.Organization_Course_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<int>("organization_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("course_id");

                    b.HasIndex("organization_id", "course_id");

                    b.ToTable("organization_course_edges");
                });

            modelBuilder.Entity("Arena.Organization_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("organization_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.Property<int>("user_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("user_id");

                    b.HasIndex("organization_id", "user_id");

                    b.ToTable("organization_user_edges");
                });

            modelBuilder.Entity("Arena.Tempuser", b =>
                {
                    b.Property<Guid>("token")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("expire")
                        .HasColumnType("timestamp with time zone");

                    b.Property<byte[]>("payload")
                        .HasColumnType("bytea");

                    b.HasKey("token");

                    b.ToTable("tempusers");
                });

            modelBuilder.Entity("Arena.User", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("email")
                        .HasColumnType("text");

                    b.Property<string>("firstname")
                        .HasColumnType("text");

                    b.Property<Guid>("keycloak_guid")
                        .HasColumnType("uuid");

                    b.Property<string>("lastname")
                        .HasColumnType("text");

                    b.Property<int>("preference")
                        .HasColumnType("integer");

                    b.Property<int>("preference_language")
                        .HasColumnType("integer");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<byte[]>("salthash")
                        .HasColumnType("bytea");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("username")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("Arena.User_Content_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("content_id")
                        .HasColumnType("integer");

                    b.Property<int>("relationship")
                        .HasColumnType("integer");

                    b.Property<int>("user_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("content_id");

                    b.HasIndex("user_id", "content_id");

                    b.ToTable("user_content_edges");
                });

            modelBuilder.Entity("Arena.Content", b =>
                {
                    b.HasOne("Arena.Attribute", "attribute")
                        .WithMany()
                        .HasForeignKey("attribute_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.Language", "language")
                        .WithMany()
                        .HasForeignKey("language_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("attribute");

                    b.Navigation("language");
                });

            modelBuilder.Entity("Arena.Course", b =>
                {
                    b.HasOne("Arena.Organization", "organization")
                        .WithMany("courses")
                        .HasForeignKey("organization_id");

                    b.Navigation("organization");
                });

            modelBuilder.Entity("Arena.Course_Keyword_Edge", b =>
                {
                    b.HasOne("Arena.Course", "course")
                        .WithMany("course_keyword_edges")
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.Keyword", "keyword")
                        .WithMany("course_keyword_edges")
                        .HasForeignKey("keyword_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("course");

                    b.Navigation("keyword");
                });

            modelBuilder.Entity("Arena.Course_User_Edge", b =>
                {
                    b.HasOne("Arena.Course", "course")
                        .WithMany("course_user_edges")
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.User", "user")
                        .WithMany("course_user_edges")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("course");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Arena.Fileitem_User_Edge", b =>
                {
                    b.HasOne("Arena.Fileitem", "fileitem")
                        .WithMany("fileitem_user_edges")
                        .HasForeignKey("fileitem_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.User", "user")
                        .WithMany("fileitem_user_edges")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("fileitem");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Arena.Inquiry", b =>
                {
                    b.HasOne("Arena.Organization", "organization")
                        .WithMany("inquiries")
                        .HasForeignKey("organization_id");

                    b.Navigation("organization");
                });

            modelBuilder.Entity("Arena.Inquiry_User_Edge", b =>
                {
                    b.HasOne("Arena.Inquiry", "inquiry")
                        .WithMany("inquiry_user_edges")
                        .HasForeignKey("inquiry_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.User", "user")
                        .WithMany("inquiry_user_edges")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("inquiry");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Arena.Organization_Course_Edge", b =>
                {
                    b.HasOne("Arena.Course", "course")
                        .WithMany("organization_course_edges")
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.Organization", "organization")
                        .WithMany("organization_course_edges")
                        .HasForeignKey("organization_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("course");

                    b.Navigation("organization");
                });

            modelBuilder.Entity("Arena.Organization_User_Edge", b =>
                {
                    b.HasOne("Arena.Organization", "organization")
                        .WithMany("organization_user_edges")
                        .HasForeignKey("organization_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.User", "user")
                        .WithMany("organization_user_edges")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("organization");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Arena.User_Content_Edge", b =>
                {
                    b.HasOne("Arena.Content", "content")
                        .WithMany("user_content_edges")
                        .HasForeignKey("content_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Arena.User", "user")
                        .WithMany("user_content_edges")
                        .HasForeignKey("user_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("content");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Arena.Content", b =>
                {
                    b.Navigation("user_content_edges");
                });

            modelBuilder.Entity("Arena.Course", b =>
                {
                    b.Navigation("course_keyword_edges");

                    b.Navigation("course_user_edges");

                    b.Navigation("organization_course_edges");
                });

            modelBuilder.Entity("Arena.Fileitem", b =>
                {
                    b.Navigation("fileitem_user_edges");
                });

            modelBuilder.Entity("Arena.Inquiry", b =>
                {
                    b.Navigation("inquiry_user_edges");
                });

            modelBuilder.Entity("Arena.Keyword", b =>
                {
                    b.Navigation("course_keyword_edges");
                });

            modelBuilder.Entity("Arena.Organization", b =>
                {
                    b.Navigation("courses");

                    b.Navigation("inquiries");

                    b.Navigation("organization_course_edges");

                    b.Navigation("organization_user_edges");
                });

            modelBuilder.Entity("Arena.User", b =>
                {
                    b.Navigation("course_user_edges");

                    b.Navigation("fileitem_user_edges");

                    b.Navigation("inquiry_user_edges");

                    b.Navigation("organization_user_edges");

                    b.Navigation("user_content_edges");
                });
#pragma warning restore 612, 618
        }
    }
}
