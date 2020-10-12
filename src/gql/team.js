import { gql } from '@apollo/client';

export const createTeamMutation = gql`
mutation($name: String!) {
    createTeam(name: $name) {
        ok
        team {
            id
        }
        errors {
            path
            message
        }
    }
}`;

export const userQuery = gql`
{
    me {
        id
        username
        email
        teams {
            id
            name
            admin
            directMessageMembers {
                id
                username
            }
            channels {
                id
                name
            }
        }
    }
}`;

export const directMessageUserQuery = gql`
query($userId: Int!) {
    getUser(userId: $userId) {
        username
    }
    me {
        id
        username
        email
        teams {
            id
            name
            admin
            directMessageMembers {
                id
                username
            }
            channels {
                id
                name
            }
        }
    }
}
`;


export const addTeamMemberMutation = gql`
mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }`;

export const getTeamMembersQuery = gql`
query($teamId:Int!) {
    getTeamMembers(teamId:$teamId) {
        id
        username
    }
}`;