import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TeamsStyledWrapper = styled.div`
    grid-column: 1;
    grid-row: 1/4;
    background-color: #362234;
    color: #958993;
    `;

const TeamList = styled.ul`
    width: 100%;
    padding-left: 0px;
    list-style: none;
`;
const TeamListItem = styled.li`
    height:50px;
    width: 50px;
    background-color:#676066;
    color: #fff;
    margin: auto;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 11px;
    &:hover {
        border-style: solid;
        border-width: thick;
        border-color: #767676;
    }
    border-radius: 50%;
`;


const team = ({ id, letter }) => <Link key={`team-${id}`} to={`/view-team/${id}`}><TeamListItem>{letter}</TeamListItem></Link>

export default ({ teams }) => (
    <TeamsStyledWrapper>
        <TeamList>
            {teams.map(team)}
            <Link key={`new-team`} to={`/create-team`}><TeamListItem>+</TeamListItem></Link>
        </TeamList>
    </TeamsStyledWrapper>
)