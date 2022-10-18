import React from 'react'
import { gql, useQuery } from '@apollo/client';

const STUDENTS = gql`
query {
	students {
    firstMidName
    lastName
    id
  }
}
`;

const GqlTest = () => {

  // const url = 'https://afll-lab.testbed.se/'

  // fetch(url, {
  //   method: 'POST',
  //   mode: 'no-cors', // no-cors, *cors, same-origin
  //   cache: 'no-cache',
  //   credentials: 'same-origin',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept-Encoding': 'gzip, deflate, br',
  //     'Accept': 'application/json',
  //     'Connection': 'keep-alive',
  //     'DNT': '1',
  //     'Origin': 'https://afll-lab.testbed.se'
  //   },
  //   body: '{"query":"query {\n\tstudents {\n    lastName\n  }\n}"}'
  // }).then(response => {
  //   console.log(response)
  // }).catch(err => {
  //   console.log('error', err)
  // })

  const { loading, error, data } = useQuery(STUDENTS);

  return loading ? (
    <p>Loading</p>
  ) : error ? (
    <p>Error</p>
  ) : (
    <div className="App">
    <ul>
      {data.students.map(student => (
        <li>{`${student.firstMidName} ${student.lastName}`}</li>
      ))}
    </ul>
      {console.log(data)}
    </div>
  );
}

export default GqlTest
