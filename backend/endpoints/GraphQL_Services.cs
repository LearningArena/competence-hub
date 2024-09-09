using Microsoft.Extensions.DependencyInjection;
using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Data.Filters.Expressions;
using System;



namespace Arena;

public static class GraphQL_Services
{
	public static void setup(IServiceCollection services)
	{
		services
		.AddGraphQLServer()
			.AddAuthorization()
			//.AddType<Course_Resolver>()
			.AddType(new UuidType(defaultFormat: 'D'))
			.AddType<User_Extension>()
			.AddType<Course_Extension>()
			.AddQueryType()
			.AddTypeExtension<Chatbot_Query>()
			.AddTypeExtension<Course_Query>()
			.AddTypeExtension<User_Query>()
			.AddTypeExtension<Account_Query>()
			.AddTypeExtension<Inquiry_Query>()
			.AddTypeExtension<Organization_Query>()
			.AddTypeExtension<Keyword_Query>()
			.AddTypeExtension<Allabolag_Query>()
			.AddTypeExtension<Fileitem_Query>()
			.AddTypeExtension<Tempuser_Query>()
			.AddTypeExtension<Language_Query>()
			.AddTypeExtension<Content_Query>()
			.AddTypeExtension<Attribute_Query>()
			.AddTypeExtension<Extpoint_Query>()
			.AddTypeExtension<External_Query>()
			.AddTypeExtension<Record_Query>()
			.AddTypeExtension<Eniro_Query>()
			.AddTypeExtension<Keycloak_Query>()
			.AddMutationType()
			.AddTypeExtension<User_Mutation>()
			.AddTypeExtension<Account_Mutation>()
			.AddTypeExtension<Organization_Mutation>()
			.AddTypeExtension<Keyword_Mutation>()
			.AddTypeExtension<Course_Mutation>()
			.AddTypeExtension<Inquiry_Mutation>()
			.AddTypeExtension<Fileitem_Mutation>()
			.AddTypeExtension<Pair_Mutation>()
			.AddTypeExtension<Record_Mutation>()
			.AddTypeExtension<Language_Mutation>()
			.AddTypeExtension<Content_Mutation>()
			.AddTypeExtension<Attribute_Mutation>()
			.AddTypeExtension<External_Mutation>()
			.AddTypeExtension<Extpoint_Mutation>()
			.AddTypeExtension<Keycloak_Mutation>()
			//.AddType<User>()
			//.AddType<Course_User_Edge>()
			.AddType<Course_Extension>()
			.AddType<Organization_Extension>()
			.AddType<Inquiry_Extension>()
			.AddType<Fileitem_Extension>()
			.AddType<Keyword_Extension>()

			.AddProjections()
			.AddSorting()
			.AddFiltering()
			//https://github.com/ChilliCream/hotchocolate/blob/develop/website/src/docs/hotchocolate/api-reference/extending-filtering.md#extending-iqueryable
			.AddConvention<HotChocolate.Data.Filters.IFilterConvention>(
				new HotChocolate.Data.Filters.FilterConventionExtension(
					x => x.AddProviderExtension(
						new QueryableFilterProviderExtension(
							y => y.AddFieldHandler<QueryableStringInvariantEqualsHandler>()))))
			.AddConvention<HotChocolate.Data.Filters.IFilterConvention>(
				new HotChocolate.Data.Filters.FilterConventionExtension(
					x => x.AddProviderExtension(
						new QueryableFilterProviderExtension(
							y => y.AddFieldHandler<QueryableStringInvariantContainsHandler>()))));

			services.AddAuthorization(options =>
			{
				options.AddPolicy("/Siteadmin", policy =>
				{
					policy.RequireAssertion(context =>
					{
						return context.User.HasClaim("/Siteadmin", "/Siteadmin");
					});
				});
			});
	}
}

