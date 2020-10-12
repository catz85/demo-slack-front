import React from 'react';
import { useLocalObservable, Observer } from "mobx-react-lite";
import { Input, Container, Header, Button, Message, Form } from 'semantic-ui-react'
import { gql } from '@apollo/client';
import { useMutation } from "@apollo/react-hooks";
import { Link, withRouter } from 'react-router-dom';
import { wsLink } from '../lib/apolloClient';
const Login = (props) => {

    const loginMutation = gql`
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        ok 
        token
        refreshToken
        errors{
          path
          message
        }
      }
    }`;
    const state = useLocalObservable(() => ({
        password: '',
        email: '',
        errors: {},
        errorList: []
    }))
    const [performOperation,] = useMutation(loginMutation);

    const onChange = event => {
        const { name, value } = event.target;
        state[name] = value;
    }

    const onSubmit = async () => {
        const { email, password } = state;
        const loginresponse = await performOperation({ variables: { password, email } });
        const { ok, token, refreshToken, errors } = loginresponse.data.login;
        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            wsLink.subscriptionClient.tryReconnect();
            props.history.push('/view-team');
        } else {
            state.errorList.length = 0;
            const err = errors.reduce((prev, next) => {
                prev[`${next.path}Error`] = next.message;
                state.errorList.push(next.message);
                return prev;
            }, {})
            state.errors = err;
        }
    }

    return (
        <Observer>
            {() => (
                <Container>
                <Container text>
                    <Header as="h2">Login</Header>
                    <Form>
                        <Form.Field error={!!state.errors.loginError}>
                            <Input name="email" onChange={onChange} value={state.email} placeholder="Email" fluid />
                        </Form.Field>
                        <Form.Field error={!!state.errors.loginError}>
                            <Input name="password" onChange={onChange} value={state.password} type="password" placeholder="Password" fluid />
                        </Form.Field>

                        <Button onClick={onSubmit}>Go!</Button>
                    </Form>
                    {state.errorList.length ? (
                        <Message
                            error
                            header="Check your input"
                            list={state.errorList}
                        />
                    ) : null}

                </Container>
                <Container>
                    Or just <Link to="/register">register new account</Link>
                </Container>
                </Container>
            )}
        </Observer>
    )
}
export default withRouter(Login)    
