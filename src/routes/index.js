import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';
import DirectViewTeam from './DirectViewTeam';


export default () => (
    <BrowserRouter>
        <Switch>
            <PrivateRoute path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/view-team/user/:teamId/:userId/:messageId?" exact component={DirectViewTeam} />
            <PrivateRoute path="/view-team/:teamId?/:channelId?/:messageId?" exact component={ViewTeam} />
            <PrivateRoute path="/create-team" exact component={CreateTeam} />
        </Switch>
    </BrowserRouter>
);