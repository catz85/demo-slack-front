import React, { useState } from 'react';
import { Input, Container, Form, Header, Button, Message } from 'semantic-ui-react'
import { gql } from '@apollo/client';
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from 'react-router-dom';



const registerMutation = gql`
    mutation($username: String!, $email:String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok 
            errors{
              path
              message
            }
        }
    }
`;

function Register(props) {
    const [performOperation,] = useMutation(registerMutation);

    const [state, setState] = useState({
        username: '',
        usernameError: '',
        password: '',
        passwordError: '',
        email: '',
        emailError: '',
        errorList: []
    })
    const onChange = event => {
        const { name, value } = event.target;
        const stateUpdated = Object.assign({}, state);
        stateUpdated[name] = value;
        setState(stateUpdated)
    }
    const errorList = [];
    const onSubmit = async () => {
        const { username, email, password } = state;
        const response = await performOperation({ variables: { username, password, email } })
        const { ok, errors } = response.data.register;
        if (ok) {
            props.history.push('/login');
        } else {
            let stateUpdated = Object.assign({}, state);
            stateUpdated.errorList.length = 0;
            const err = errors.reduce((prev, next) => {
                prev[`${next.path}Error`] = next.message;
                stateUpdated.errorList.push(next.message);
                return prev;
            }, {})
            delete stateUpdated.usernameError;
            delete stateUpdated.passwordError;
            delete stateUpdated.emailError;
            stateUpdated = Object.assign({}, stateUpdated, err);
            setState(stateUpdated);
        }
    }
    return (
        <Container text>
            <Header as="h2">Register</Header>
            <Form>
                <Form.Field error={!!state.usernameError}>
                    <Input name="username" error={!!state.usernameError} onChange={onChange} value={state.username} placeholder="Username" fluid />
                </Form.Field>
                <Form.Field error={!!state.emailError}>
                    <Input name="email" error={!!state.emailError} onChange={onChange} value={state.email} placeholder="Email" fluid />
                </Form.Field>
                <Form.Field error={!!state.passwordError}>
                    <Input name="password" error={!!state.passwordError} onChange={onChange} value={state.password} type="password" placeholder="Password" fluid />
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
    )
}



export default withRouter(Register)