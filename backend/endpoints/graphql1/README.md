# Examples


### Finding courses that belongs to organiazations that belongs to an user by id
```graphql
query
{
  courses(where: {
    organization_course_edges:{
    some:{and:[
      {organization:{
        organization_user_edges:{
          some:{and:[
            {user:{id:{eq:27}}},
            {relationship:{eq:AUTHOR}}
          ]}
        }
      }},
      {relationship:{eq:AUTHOR}}
    ]
    }
  }}) {
    nodes {
      title
    }
  }
}
```
