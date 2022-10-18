## GraphQL
*GraphQL* is the API between frontend and backend.

### Sources
* https://graphql.org/
* https://chillicream.com/
* https://github.com/ChilliCream/hotchocolate
* https://devhints.io/graphql


### Getting field in a specific language
Get a course field in a specific language using *GraphQL Aliases*.
The course title field as `EN`, English.
The course subtitle field as `SE`, Swedish.
```graphql
query
{
	courses
	{
		id
		title:prop(name:TITLE,lang:SE){value}
		subtitle:prop(name:SUBTITLE,lang:SE){value}
	}
}
```

### Filter by keyword
Get all courses related to `"AI"`.
```graphql
query
{
  keywords(where:{name:"AI"})
  {
    name
    course_keyword_edge
    {
      course
      {
        title:prop(name:TITLE,lang:EN){value}
      }
    }
  }
}



```

### Login
This is a example on how to login by GraphQL mutation:
```graphql
mutation
{
	login(username:"cloakman",password:"cloakman")
	{
		error
		error_description
		token_type
		access_token
		expires_in
	}
}
```

### Register
This is a example on how to register by GraphQL mutation:
```graphql
mutation
{
	register(email:"abc@abc.abc", password:"abc_password")
	{
		errorMessage
		status
	}
}
```