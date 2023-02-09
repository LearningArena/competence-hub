const { gql } = require("@apollo/client")

//TODO(Johan): A boolean (publish) field will be added to replace a publish state in (status).
export const allEducationFields = `

course_user_edges {
  relationship
}
bioteachers
category
city
credits
id
description
diplomas
hours
education_provider
seqf
email_of_contact_person
end_date
image_feature
image_provider
is_favorite
language
level
link
literature
name_of_contact_person
online
prerequisite
price
required_tools
registration_end_date
start_date
seqf
studyform
yrkeshogskolepoang
studypace
record_status
time_modified
subtitle
teachers
title
verbs
`

const allInquiryFields = `
category
description
email_of_contact_person
end_date
id
location
name_of_contact_person
organization {
  name
  image_logo
}
phonenumber_of_contact_person
start_date
studypace
record_status
target
title
`

// export const COURSE_BY_CATEGORY = gql`
// query CourseByCategory($category: String!){
//   courses(where : {
//     AND: [
//       {category_contains: "Leadership"}
//       {record_status: 1}
//     ]
//   }) {
//     ${allEducationFields}
//   }
// }
// `

export const COURSE_OWNERS = gql`
query CourseOwners($id: Int!) {
  courses(id: $id) {
    nodes {
      course_user_edges {
        user {
          firstname
          lastname
          username
          email
          id
        }
      }
    }
  }
}
`

export const ORG_BY_ID = gql`
query OrgOwner($id: Int!){
	organizations(id: $id) {
    nodes {
      id
      name
      orgid
      organization_user_edges
      { 
        user_id
        relationship
      }
    }
  }
}
`

 export const COURSE_ADD_OWNER = gql`
  mutation CourseAddUser($course_id: Int!, $new_user_id: Int!) {
    pair(t1: $new_user_id, relation: AUTHOR, t2:COURSES, id2: $course_id)  
  }  
  `


export const COURSE_BY_CATEGORY = gql`
query CourseByCategory($cat: String!, $record_status: Record_Status = null, $num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput! ) {
  courses(where: {and: [$filters, {
      category:{contains: $cat}
  }]}, order: $order, record_status: $record_status, first:$num, before:$before, after:$after) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    nodes {
      ${allEducationFields}
    }
  }
  cursors: courses(
    order: $order,
    first: 500,
    record_status: APPROVED,
    where: {and: [$filters, {
      category:{contains: $cat}
    }]}
  ) {
    edges {
      cursor
    }
  }
}
`

export const COURSE_SEARCH = gql`
query CourseSearch($query: String!, $record_status: Record_Status = null, $num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput! ){
  courses(where: {and: [$filters, {
    or: [
        {title:{contains: $query}}
        {description:{contains: $query}}
        {subtitle:{contains: $query}}
        {verbs:{contains: $query}}
      ]}]}
    , order: $order, record_status: $record_status, first:$num, before:$before, after:$after) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ${allEducationFields}
    }
  }
  cursors: courses(
    order: $order,
    first: 500,
    record_status: APPROVED,
    where: {and: [$filters, {
    or: [
        {title:{contains: $query}}
        {description:{contains: $query}}
        {subtitle:{contains: $query}}
        {verbs:{contains: $query}}
      ]}]}
  ) {
    edges {
      cursor
    }
  }
}
`

export const LIST_EDUCATION_PROVIDERS = gql`
query {
  course_providers(record_status: APPROVED)
}
`
export const LIST_EDUCATION_LOCATIONS = gql`
query {
  course_locations(record_status: APPROVED)
}
`

export const COURSE_BY_ID = gql`
query CourseById($id: Int!){
  courses(id: $id) {
    nodes {
      ${allEducationFields}
    }
  }
}
`

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username:$username,password:$password)
}
`

export const PIN_COURSE = gql`
mutation PinCourse($id: Int!) {
  pair(t1: USERS, id1: 0, t2: COURSES, id2: $id, relation: FAVORITE) 
  
}
`

export const UNPIN_COURSE = gql`
mutation UnpinCourse($id: Int!) {
  unpair(t1: USERS, id1: 0, t2: COURSES, id2: $id, relation: FAVORITE) 
}
`

export const ALL_COURSES = gql`
query {
  courses(order: {id: ASC}) {
    nodes {
      ${allEducationFields}
    }
  }
  cursors: courses(
    order: {id: ASC},
    first: 500
  ) {
    edges {
      cursor
    }
  }
}
`
/* ORGINIAL QUERY
export const PUBLISHED_COURSES = gql`
query {
  courses(order: {id: ASC}, record_status: APPROVED) {
    
    ${allEducationFields}
  }
}
`
*/
export const PUBLISHED_COURSES = gql`
query Courses($num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput ){
  courses(order: $order, where: $filters, record_status: APPROVED, first:$num, before:$before, after:$after) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ${allEducationFields}
      is_my_favorite:has_edge(t:USERS, id:0, relation:FAVORITE)
    }
    }
    cursors: courses(
      order: $order,
      first: 500,
      record_status: APPROVED,
      where: $filters
    ) {
      edges {
        cursor
      }
  }
}
`

export const FAVORITE_COURSES = gql`
query FavoriteCourses($num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput!) {
  courses(current_user_relationship: FAVORITE, order: $order, where: $filters, first:$num, before:$before, after:$after ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ${allEducationFields}
      is_my_favorite:has_edge(t:USERS, id:0, relation:FAVORITE)
    }
  }
  cursors: courses(
    current_user_relationship: FAVORITE
    order: $order,
    first: 500,
    record_status: APPROVED,
    where: $filters
  ) {
    edges {
      cursor
    }
  }
}
`

export const LOGOUT = gql`
mutation {
  logout
}
`

export const EDIT_ORG = gql`
mutation OrganizationEdit(
  $address: String
  $description: String
  $email: String
  $id: Int!
  $image_logo: String
  $name: String
  $phonenumber: String
  $website: String
) {
  organizations_update(
    address: $address,
    description: $description,
    email: $email,
    id: $id,
    image_logo: $image_logo,
    name: $name,
    phonenumber: $phonenumber,
    website: $website
  ) {
    id
  }
}
`

export const SIGNUP = gql`
mutation Register(
  $email: String!,
  $firstname: String,
  $lastname: String,
  $orgid_se: String,
  $orgname: String,
  $preference: Int,
  $preference_language: Country_Code_ISO_3166_1,
  $password: String!,
  $org_address: String,
  $org_description: String,
  $org_email: String,
  $org_image_logo: String,
  $org_phonenumber: String,
  $org_website: String
  ) {
  register(
    email:$email,
    firstname:$firstname,
    lastname:$lastname,
    orgid:$orgid_se,
    orgname:$orgname,
    preference:$preference,
    preference_language:$preference_language,
    password:$password,
    org_address:$org_address,
    org_description:$org_description,
    org_email:$org_email,
    org_image_logo:$org_image_logo,
    org_phonenumber:$org_phonenumber,
    org_website:$org_website
  )
}
`

export const ALL_USERS = gql`
query {
  users {
    nodes {
      firstname
      lastname
      email
      id
      username
      organization_user_edges {
        organization_id
        organization {
          name
        }
      }
    }
  }
}
`

export const ORG_USERS = gql`
query OrgUsers($id: Int!){
	organizations(where:{id:{eq:$id}}) {
		nodes {
      organization_user_edges {
        relationship
        user{
          firstname
          lastname
          id
          email
        }
      }
    }
	}
}
`

export const QUOTATION_REQUEST = gql`
mutation QuotationRequest($send_copy: Boolean!, $course_id: Int!, $request_message_value: String) {
  quotation_request(check: $send_copy, course_id: $course_id, request_message_value: $request_message_value) {
    nodes {
      errorCode
      message
      messageID
      status
      submittedAt
      to
    }
  }
}
`

export const AUTHTEST = gql`
query {
  authenticated
}
`

export const USER_CLAIMS = gql`
query {
  claims
}
`

export const CURRENT_USER = gql`
query {
  user_current {
    id
    email
    firstname
    lastname
    preference
    preference_language
    username
  }
}
`
export const CURRENT_USER_ORG = gql`
query {
  my_org_by_author:organizations(current_user_relationship: AUTHOR) {
    nodes {
      address
      description
      email
      id
      image_logo
      name
      orgid
      phonenumber
      website
    }
  }
  my_org_by_member:organizations(current_user_relationship: MEMBER) {
    nodes {
      address
      description
      email
      id
      image_logo
      name
      orgid
      phonenumber
      website
    }
  }
}
`
export const ADD_ORG = gql`
mutation AddOrg(
  $orgid_se: String,
  $name: String,
  $address: String
  $image_logo: String
  $description: String
  $phonenumber: String
  $website: String
  $email: String
  ) {
  organizations_add(
    orgid:$orgid_se,
    name:$name,
    address:$address,
    image_logo:$image_logo,
    description:$description,
    phonenumber:$phonenumber,
    website:$website,
    email:$email
  ) {
    id
  }
}
`

export const ORG_NAME_BY_ORGID = gql`
query OrgNameByOrgId($orgid: String!) {
  organizations(where:{orgid:{eq:$orgid}}) {
    nodes {
      name
     }
   }
}
`

export const ORG_INFO_BY_ID = gql`
query OrgInfoByOrgId($id: Int!) {
  organizations(where:{id:{eq:$id}}) {
    nodes {
      name
      image_logo
     }
   }
}
`
export const COURSE_DELETE = gql`
mutation CourseRemove($id: Int!) {
  record_remove_unsafe(id: $id, table:COURSES)
}
`

export const INQUIRY_DELETE = gql`
mutation InquiryRemove($id: Int!) {
  record_remove_unsafe(id: $id, table:INQUIRIES)
}
`

export const MY_EDUCATIONS = gql`
query UsersEducations($num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput!) {
  courses(order: $order, first: $num, before:$before, after: $after, where: $filters, current_user_relationship:AUTHOR) {
    nodes {
      title
      start_date
      id
      time_modified
      record_status
      education_provider
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
    }
  }
  cursors: courses(
    order: $order
    first: 500
    where: $filters
    current_user_relationship:AUTHOR
  ) {
    edges {
      cursor
    }
  }
}
`
export const ORG_EDUCATIONS = gql`
query OrgEducations($num: Int, $record_status: Record_Status = null, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput!, $orgid: Int!) {
  courses(order: $order, record_status: $record_status, first:$num, before:$before, after: $after, where:
  {and: [
    $filters,
    {organization_course_edges:
      {
        some:{and: [
          {organization:{
            id:{eq:$orgid}
          }}
          ]
        }
  }}]}) 
  {
    pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
    }
    edges{cursor}
    nodes {
      organization {
        name
        id
      }
      title
      start_date
      id
      record_status
      education_provider
    }
  }
  cursors: courses(
    order: $order
    record_status: $record_status
    first: 500
    where: {and: [
      $filters, 
      {organization_course_edges: 
        {
          some:{and: [
            {organization:{
              id:{eq:$orgid}
            }}
    ] } } } ] } 
  ) {
    edges {
      cursor
    }
  }
}
`

export const USER_ORG_EDUCATIONS = gql`
query UsersOrgEducations($num: Int, $before: String, $after: String, $order: [CourseSortInput!], $filters: CourseFilterInput!, $userid: Int!) {
  courses(order: $order, first:$num, before:$before, after: $after, where:
  {and: [
    $filters,
    {organization_course_edges:
      {
        some:{and:[
          {organization:{organization_user_edges:
          {
            some:{and: [
              {user:{
                id:{eq:$userid}
              }},
              {relationship:{eq:AUTHOR}}
            ]

            }
          }}},
          {relationship:{eq:AUTHOR}}
        ]
        }
  }}]}) 
  {
    pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
    }
    edges{cursor}
    nodes {
      organization {
        name
        id
      }
      title
      start_date
      id
      record_status
      education_provider
    }
  }
  cursors: courses(
    order: $order
    first: 500
    where: {and: [$filters, {organization_course_edges: {some: {and: [{organization: {organization_user_edges: {some: {and: [{user: {id: {eq: $userid}}}, {relationship: {eq: AUTHOR}}]}}}}, {relationship: {eq: AUTHOR}}]}}}]}
  ) {
    edges {
      cursor
    }
  }
}
`

export const INQUIRY_LIST = gql`
query {
  inquiries {
    nodes {
      category
      description
      email_of_contact_person
      end_date
      id
      location
      name_of_contact_person
      organization {
        name
        image_logo
      }
      phonenumber_of_contact_person
      start_date
      studypace
      target
      title
    }
  }
}
`

export const MY_INQUIRIES = gql`
query {
  inquiries( first: 500, current_user_relationship: AUTHOR) {
    nodes {
      id
      title
      description
      target
      location
      record_status
      start_date
      end_date
    }
  }
}
`



export const INQUIRY_BY_ID = gql`
query InquiryById($id: Int!) {
  inquiries(id: $id) {
    nodes {
      ${allInquiryFields}
    }
  }
}
`

export const ADD_INQUIRY = gql`
mutation AddInquiry(
  $category: String
  $description: String
  $email_of_contact_person: String
  $end_date: DateTime
  $location: String
  $name_of_contact_person: String
  $phonenumber_of_contact_person: String
  $start_date: DateTime
  $studypace: String
  $organization_id: Int
  $record_status: Record_Status
  $target: Int
  $title: String
) {
  inquiry_add(
    category: $category,
    description: $description,
    email_of_contact_person: $email_of_contact_person,
    end_date: $end_date,
    location: $location,
    name_of_contact_person: $name_of_contact_person,
    phonenumber_of_contact_person: $phonenumber_of_contact_person,
    start_date: $start_date,
    record_status: $record_status,
    studypace: $studypace,
    target: $target,
    organization_id: $organization_id,
    title: $title
  ) {
    id
    title
  }
}
`

export const EDIT_INQUIRY = gql`
mutation EditInquiry(
  $category: String
  $description: String
  $email_of_contact_person: String
  $end_date: DateTime
  $location: String
  $name_of_contact_person: String
  $phonenumber_of_contact_person: String
  $start_date: DateTime
  $id: Int!
  $record_status: Record_Status
  $studypace: String
  $target: Int
  $title: String
) {
  inquiries_update(
    category: $category,
    description: $description,
    email_of_contact_person: $email_of_contact_person,
    end_date: $end_date,
    location: $location,
    name_of_contact_person: $name_of_contact_person,
    phonenumber_of_contact_person: $phonenumber_of_contact_person,
    start_date: $start_date,
    record_status: $record_status,
    id: $id,
    studypace: $studypace,
    target: $target,
    title: $title
  ) {
    id
    title
  }
}
`

export const ADD_EDUCATION = gql`
mutation AddCourse(
  $bioteachers: String
  $category: String
  $city: String
  $credits: Float
  $description: String
  $diplomas: String
  $education_provider: String
  $email_of_contact_person: String
  $end_date: DateTime
  $image_feature: String
  $image_provider: String
  $language: String
  $level: Int
  $hours: Int
  $link: String
  $literature: String
  $name_of_contact_person: String
  $online: Int
  $prerequisite: String
  $price: Int
  $required_tools: String
  $registration_end_date: DateTime
  $start_date: DateTime
  $seqf: Int
  $studypace: String
  $subtitle: String
  $teachers: String
  $record_status: Record_Status
  $title: String
  $verbs: String
  $yrkeshogskolepoang: Int

){
  course_add(
    title: $title,
    category: $category,
    city: $city,
    education_provider: $education_provider,
    name_of_contact_person: $name_of_contact_person,
    email_of_contact_person: $email_of_contact_person,
    image_feature: $image_feature,
    image_provider: $image_provider,
    language: $language,
    link: $link,
    bioteachers: $bioteachers,
    credits: $credits,
    description: $description,
    diplomas: $diplomas,
    level: $level,
    literature: $literature,
    start_date: $start_date,
    end_date: $end_date,
    online: $online,
    hours: $hours,
    record_status: $record_status,
    prerequisite: $prerequisite,
    price: $price,
    required_tools: $required_tools,
    registration_end_date: $registration_end_date,
    seqf: $seqf,
    studypace: $studypace,
    subtitle: $subtitle,
    teachers: $teachers,
    verbs: $verbs,
    yrkeshogskolepoang: $yrkeshogskolepoang,
    studyform: FULLTIME
  ) {
    id
    ${allEducationFields}
  }
}
`
export const EDIT_EDUCATION = gql`
mutation EditCourse(
  $id: Int!
  $bioteachers: String
  $category: String
  $city: String
  $credits: Float
  $description: String
  $diplomas: String
  $education_provider: String
  $email_of_contact_person: String
  $end_date: DateTime
  $image_feature: String
  $image_provider: String
  $language: String
  $level: Int
  $hours: Int
  $link: String
  $literature: String
  $name_of_contact_person: String
  $online: Int
  $prerequisite: String
  $price: Int
  $registration_end_date: DateTime
  $required_tools: String
  $seqf: Int
  $start_date: DateTime
  $record_status: Record_Status
  $studypace: String
  $subtitle: String
  $teachers: String
  $title: String
  $verbs: String
  $yrkeshogskolepoang: Int

){
  courses_update(
    id: $id,
    title: $title,
    category: $category,
    city: $city,
    education_provider: $education_provider,
    name_of_contact_person: $name_of_contact_person,
    email_of_contact_person: $email_of_contact_person,
    image_feature: $image_feature,
    image_provider: $image_provider,
    language: $language,
    link: $link,
    hours: $hours,
    bioteachers: $bioteachers,
    credits: $credits,
    description: $description,
    diplomas: $diplomas,
    level: $level,
    literature: $literature,
    start_date: $start_date,
    end_date: $end_date,
    online: $online,
    prerequisite: $prerequisite,
    price: $price,
    record_status: $record_status,
    required_tools: $required_tools,
    registration_end_date: $registration_end_date,
    seqf: $seqf,
    studypace: $studypace,
    subtitle: $subtitle,
    teachers: $teachers,
    verbs: $verbs,
    yrkeshogskolepoang: $yrkeshogskolepoang
  ) {
    id
    ${allEducationFields}
  }
}
`

export const FORGOT_PASSWORD = gql`
mutation ForgotPassword($email: String) {
  forgot_password_email(email: $email)
}
`

export const CHANGE_PASSWORD = gql`
mutation ChangePassword($new_password: String) {
  change_password(new_password: $new_password)
}
`

export const EDIT_USER = gql`
mutation EditUser(
  $id: Int!
  $firstname: String
  $lastname: String
  $preference_language: Country_Code_ISO_3166_1
) 
{
  users_update (
    id: $id,
    firstname: $firstname,
    lastname: $lastname,
    preference_language: $preference_language
    
  ) {
    id
    firstname
    lastname
    preference_language
  }
}
`
