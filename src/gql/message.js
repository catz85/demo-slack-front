import { gql } from '@apollo/client';

export const createMessageMutation = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId:$channelId,text:$text) 
    }
`;

export const createDirectMutation = gql`
    mutation($text: String!, $receiverId: Int!, $teamId: Int!) {
        createDirect(receiverId:$receiverId, text: $text, teamId: $teamId)
    }
`;

export const channelMessages = gql`
    query($channelId: Int!) {
        messages(channelId:$channelId) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
`;

export const directMessages = gql`
    query($teamId: Int!, $otherUserId: Int!) {
        direct(teamId: $teamId, otherUserId: $otherUserId) {
            id
            sender {
                username
                id
            }
            text
            createdAt
        }
    }
`;


export const newChannelMessageSubscription = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
`;

export const newDirectMessageSubscription = gql`
    subscription($teamId: Int!, $userId: Int!) {
        newDirect(teamId: $teamId, userId: $userId) {
            id
            sender {
                username
            }
            text
            createdAt
        }
    }

`;