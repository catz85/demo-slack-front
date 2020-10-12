import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from "@apollo/react-hooks";

import { Link } from 'react-router-dom';



const Home = (props) => {
  const allUsersQuery = gql`
    query {
      allUsers {
        id
        username
        email
      }
  }`;
  const { loading, error, data } = useQuery(allUsersQuery);
  if (loading) {
    return (<h1>Loading</h1>)
  }
  if (error) {
    return (<h1>Loading</h1>)
  }
  if (data) {
    return (
      [<Link to='/view-team'>View teams</Link>,
      data.allUsers.map(u => <h1 key={u.id}>{u.email}</h1>)])
  }
}
export default Home