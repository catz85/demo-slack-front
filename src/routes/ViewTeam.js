import React from 'react';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { useQuery } from "@apollo/react-hooks";
import { userQuery } from '../gql/team';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import Message from '../containers/Message'
import { createMessageMutation } from '../gql/message';
import { useMutation } from "@apollo/react-hooks";


const ViewTeam = ({ match: { params: { teamId, channelId } } }) => {

    const { loading, error, data } = useQuery(userQuery);
    const [performOperation,] = useMutation(createMessageMutation);
    if (loading) return null;
    if (error) return null;

    const { username, teams } = data.me;

   


    if (!teams.length) {
        return <Redirect to="/create-team" />
    }

    let teamIdx = !!teamId ? findIndex(teams, ['id', parseInt(teamId, 10)]) : 0;
    if (!~teamIdx) { // i !=== -1
        return <Redirect to="/view-team" />
    }
    const team = teams[teamIdx];
    const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
    if (!~channelIdx) { // i !=== -1
        return <Redirect to="/view-team" />
    }
    const currentChannel = team.channels[channelIdx];


    const _handleSubmit = async (values, formikApi) => {

        if (!values.text || !values.text.trim()) {
            return;
        }
        const response = await performOperation({ variables: { channelId: +currentChannel.id, text: values.text } })
        formikApi.resetForm();
    };

    //make array with first letter of teams
    const teamsL = teams.map(t => ({
        id: t.id,
        letter: t.name.charAt(0).toUpperCase()
    }))
    return (<AppLayout>
        <Sidebar currentTeamId={teamId} teams={teamsL} team={team} username={username} />
        <Header channel={currentChannel.name} />
        <Message channel={currentChannel.name} channelId={currentChannel.id} />
        <SendMessage onSubmit={_handleSubmit} placeholder={currentChannel.name} />
    </AppLayout>
    )
}

export default ViewTeam