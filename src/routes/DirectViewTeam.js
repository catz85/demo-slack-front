import React from 'react';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { useQuery } from "@apollo/react-hooks";
import { userQuery } from '../gql/team';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import Direct from '../containers/Direct'
import { createDirectMutation } from '../gql/message';
import { useMutation } from "@apollo/react-hooks";
import produce from "immer";

const DirectViewTeam = ({ match: { params: { teamId, userId } } }) => {
    const { loading, error, data } = useQuery(userQuery);
    
    let username, teams, teamIdx, directUserIdx, directUser, team;

    const [performOperation,] = useMutation(createDirectMutation,{
        update: (cache, response) => {
            const ok = response.data.createDirect;
            if (!ok) return;
            //updating apollo cache
            const meCache = cache.readQuery({ query: userQuery});
            const temIdx2 = findIndex(data.me.teams, ['id', team.id]);
            const notIsAdded = data.me.teams[temIdx2].directMessageMembers.every(member => member.id != userId)
            if (notIsAdded) {
                cache.writeQuery({
                    query: userQuery, data: produce(meCache, x => {
                        x.me.teams[temIdx2].directMessageMembers.push({
                            __typename: 'User',
                            id: userId,
                            username: directUser.username //!fixme
                        })
                    })
                }); 
            }
        }
    });

    if (loading) return null;
    if (error) return null;

    username = data.me.username;
    teams = data.me.teams;
    if (!teams.length) {
        return <Redirect to="/create-team" />
    }
    teamIdx = !!teamId ? findIndex(teams, ['id', parseInt(teamId, 10)]) : 0;
    
    if (!~teamIdx) { // i !=== -1
        return <Redirect to="/view-team" />
    }
    directUserIdx = findIndex(teams[teamIdx].directMessageMembers, ['id',+userId]);

    if (!~directUserIdx) {
        return <Redirect to="/view-team" />
    }
    directUser = data.me.teams[teamIdx].directMessageMembers[directUserIdx];

    team = teams[teamIdx];


    //make array with first letter of teams
    const teamsL = teams.map(t => ({
        id: t.id,
        letter: t.name.charAt(0).toUpperCase()
    }))

    const _handleSubmit = async (values, formikApi) => {
        if (!values.text || !values.text.trim()) {
            return;
        }
        const response = await performOperation({ variables: { receiverId: +userId, text: values.text, teamId: team.id } })
        formikApi.resetForm();
    };

    return (
    <AppLayout>
        <Sidebar currentTeamId={teamId} teams={teamsL} team={team} username={username} />
        <Header channel={directUser.username} />
        <Direct userId={userId} teamId={teamId} />
        <SendMessage onSubmit={_handleSubmit} placeholder={directUser.username} />
    </AppLayout>
    )
}

export default DirectViewTeam