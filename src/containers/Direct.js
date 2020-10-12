import React, { useEffect, useState } from 'react';
import Messages from '../components/Messages';
import { useQuery } from "@apollo/react-hooks";
import { Comment } from 'semantic-ui-react';
import { formatTime } from '../lib/formatTime';

import { newDirectMessageSubscription } from '../gql/message';

import { directMessages } from '../gql/message'

const Direct = ({ teamId, userId }) => {
    const directMessageResponse = useQuery(directMessages, {
        variables: { teamId: +teamId, otherUserId: +userId },
        fetchPolicy: "network-only"
    });
    const [directSubscriber, setDirectSubscriber] = useState({
        currentSubscribeDirectId: null,
        unsubscriber: () => { },
        isSubscribed: false
    });
    console.log(teamId, userId)
    useEffect(() => {
        if (!directSubscriber.isSubscribed) {
            const unsubscriber = directMessageResponse.subscribeToMore({
                document: newDirectMessageSubscription,
                variables: { teamId: +teamId,  userId: +userId},
                updateQuery: (prev, newData) => {
                    console.log(prev, newData)
                    if (!newData) {
                        return prev
                    }
                    return {
                        ...prev,
                        direct: [...prev.direct, newData.subscriptionData.data.newDirect]
                    }
                }
            })
            setDirectSubscriber({ currentSubscribeDirectId: userId+''+teamId, unsubscriber, isSubscribed: true })
        }
        if (directSubscriber.isSubscribed && directSubscriber.currentSubscribeDirectId !== userId+''+teamId) {
            setDirectSubscriber({ currentSubscribeDirectId: null, isSubscribed: false })
            return () => directSubscriber.unsubscriber();
        }
    })

    if (directMessageResponse.loading) {
        return null
    }
    if (directMessageResponse.error) {
        return null
    }

    const { direct } = directMessageResponse.data;


    const refs = direct.reduce((prev, next)=> {
        prev[next.id] = React.createRef()
        return prev;
    },{})


    return (
        <Messages>
            <Comment.Group>
                {direct.map(m => (
                    <Comment key={`${m.id}-direct`} >
                        <Comment.Content>
                            <Comment.Author as="a">{m.sender.username}</Comment.Author>
                            <Comment.Metadata>
                                <div>{formatTime(+m.createdAt)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{m.text}</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
        </Messages>
    )
};

export default Direct;