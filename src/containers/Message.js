import React, { useEffect, useState } from 'react';
import Messages from '../components/Messages';
import { useQuery } from "@apollo/react-hooks";
import { channelMessages } from '../gql/message';
import { Comment } from 'semantic-ui-react';
import { formatTime } from '../lib/formatTime';
import { newChannelMessageSubscription } from '../gql/message';

const Message = ({ channel, channelId, data }) => {
    const channelMessagesResponse = useQuery(channelMessages, {
        variables: { channelId: channelId },
        fetchPolicy: "network-only"
    });

    const [channelSubscriber, setChannelSubscriber] = useState({
        currentSubscribeChannelId: null,
        unsubscriber: () => { },
        isSubscribed: false
    });

    useEffect(() => {
        if (!channelSubscriber.isSubscribed && channelId) {
            const unsubscriber = channelMessagesResponse.subscribeToMore({
                document: newChannelMessageSubscription,
                variables: { channelId: channelId },
                updateQuery: (prev, newData) => {
                    if (!newData) {
                        return prev
                    }
                    return {
                        ...prev,
                        messages: [...prev.messages, newData.subscriptionData.data.newChannelMessage]
                    }
                }
            })
            setChannelSubscriber({ currentSubscribeChannelId: channelId, unsubscriber, isSubscribed: true })
        }
        if (channelSubscriber.isSubscribed && channelSubscriber.currentSubscribeChannelId !== channelId) {
            setChannelSubscriber({ currentSubscribeChannelId: null, isSubscribed: false })
            return () => channelSubscriber.unsubscriber();
        }
    }
    )

    if (channelMessagesResponse.loading) {
        return null
    }
    if (channelMessagesResponse.error) {
        return null
    }

    const { messages } = channelMessagesResponse.data;



    return (
        <Messages>
            <Comment.Group>
                {messages.map(m => (
                    <Comment key={`${m.id}-message`}>
                        <Comment.Content>
                            <Comment.Author as="a">{m.user.username}</Comment.Author>
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

export default Message;