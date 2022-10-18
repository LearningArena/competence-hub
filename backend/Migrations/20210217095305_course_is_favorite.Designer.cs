﻿// <auto-generated />
using System;
using Arena;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Arena.Migrations
{
    [DbContext(typeof(Arena_Context))]
    [Migration("20210217095305_course_is_favorite")]
    partial class course_is_favorite
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityByDefaultColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("Arena.Course", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("bioteachers")
                        .HasColumnType("text");

                    b.Property<string>("category")
                        .HasColumnType("text");

                    b.Property<string>("city")
                        .HasColumnType("text");

                    b.Property<int?>("credits")
                        .HasColumnType("integer");

                    b.Property<string>("description")
                        .HasColumnType("text");

                    b.Property<string>("diplomas")
                        .HasColumnType("text");

                    b.Property<string>("education_provider")
                        .HasColumnType("text");

                    b.Property<string>("email_of_contact_person")
                        .HasColumnType("text");

                    b.Property<DateTime?>("end_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int?>("hogskolapoang")
                        .HasColumnType("integer");

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

                    b.Property<string>("price")
                        .HasColumnType("text");

                    b.Property<int>("record_status")
                        .HasColumnType("integer");

                    b.Property<string>("required_tools")
                        .HasColumnType("text");

                    b.Property<int?>("seqf")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("start_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int?>("status")
                        .HasColumnType("integer");

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
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("title")
                        .HasColumnType("text");

                    b.Property<int?>("type")
                        .HasColumnType("integer");

                    b.Property<string>("verbs")
                        .HasColumnType("text");

                    b.Property<int?>("yrkeshogskolepoang")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("organization_id");

                    b.ToTable("courses");
                });

            modelBuilder.Entity("Arena.Course_Keyword_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<int>("keyword_id")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.HasIndex("course_id");

                    b.HasIndex("keyword_id", "course_id");

                    b.ToTable("course_keyword_edges");
                });

            modelBuilder.Entity("Arena.Course_Property", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<int>("language")
                        .HasColumnType("integer");

                    b.Property<int>("name")
                        .HasColumnType("integer");

                    b.Property<string>("value")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.HasIndex("course_id");

                    b.ToTable("course_properties");
                });

            modelBuilder.Entity("Arena.Course_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("course_id")
                        .HasColumnType("integer");

                    b.Property<DateTime>("date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int?>("grade")
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

            modelBuilder.Entity("Arena.Inquiry", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("category")
                        .HasColumnType("text");

                    b.Property<string>("description")
                        .HasColumnType("text");

                    b.Property<string>("email_of_contact_person")
                        .HasColumnType("text");

                    b.Property<DateTime?>("end_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("location")
                        .HasColumnType("text");

                    b.Property<string>("name_of_contact_person")
                        .HasColumnType("text");

                    b.Property<int?>("organization_id")
                        .HasColumnType("integer");

                    b.Property<string>("phonenumber_of_contact_person")
                        .HasColumnType("text");

                    b.Property<DateTime?>("start_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int?>("status")
                        .HasColumnType("integer");

                    b.Property<string>("studypace")
                        .HasColumnType("text");

                    b.Property<int>("target")
                        .HasColumnType("integer");

                    b.Property<DateTime>("time_created")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("time_modified")
                        .HasColumnType("timestamp without time zone");

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
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

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
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<bool>("is_category")
                        .HasColumnType("boolean");

                    b.Property<bool>("is_tag")
                        .HasColumnType("boolean");

                    b.Property<bool>("is_topic")
                        .HasColumnType("boolean");

                    b.Property<string>("name")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("keywords");
                });

            modelBuilder.Entity("Arena.Organization", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

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

                    b.Property<string>("website")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("organizations");
                });

            modelBuilder.Entity("Arena.Organization_User_Edge", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

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

            modelBuilder.Entity("Arena.User", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

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

                    b.Property<string>("username")
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("users");
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
                        .WithMany("course_keyword_edge")
                        .HasForeignKey("keyword_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("course");

                    b.Navigation("keyword");
                });

            modelBuilder.Entity("Arena.Course_Property", b =>
                {
                    b.HasOne("Arena.Course", "course")
                        .WithMany("course_properties")
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("course");
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

            modelBuilder.Entity("Arena.Course", b =>
                {
                    b.Navigation("course_keyword_edges");

                    b.Navigation("course_properties");

                    b.Navigation("course_user_edges");
                });

            modelBuilder.Entity("Arena.Inquiry", b =>
                {
                    b.Navigation("inquiry_user_edges");
                });

            modelBuilder.Entity("Arena.Keyword", b =>
                {
                    b.Navigation("course_keyword_edge");
                });

            modelBuilder.Entity("Arena.Organization", b =>
                {
                    b.Navigation("courses");

                    b.Navigation("inquiries");

                    b.Navigation("organization_user_edges");
                });

            modelBuilder.Entity("Arena.User", b =>
                {
                    b.Navigation("course_user_edges");

                    b.Navigation("inquiry_user_edges");

                    b.Navigation("organization_user_edges");
                });
#pragma warning restore 612, 618
        }
    }
}
