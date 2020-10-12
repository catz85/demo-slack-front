import React from 'react';
import { useLocalObservable, Observer } from "mobx-react-lite";
import { Input, Container, Header, Button, Message, Form } from 'semantic-ui-react'
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from 'react-router-dom';
import { createTeamMutation } from '../gql/team'
const CreateTeam = (props) => {



    const state = useLocalObservable(() => {
        return ({
            name: '',
            errors: {},
            errorList: []
        });
    })
    const [performOperation,] = useMutation(createTeamMutation);

    const onChange = event => {
        const { name, value } = event.target;
        state[name] = value;
    }

    const onSubmit = async () => {
        const { name } = state;
        let createTeamResponse = null;
        try {
            createTeamResponse = await performOperation({ variables: { name } });
        } catch (err) {
            props.history.push('/login');
            return;
        }
        const { ok, errors, team } = createTeamResponse.data.createTeam;
        if (ok) {
            props.history.push(`/view-team/${team.id}`)
        } else {
            const errObject = {};
            const err = errors.map(({ path, message }) => {
                errObject[`${path}Error`] = message;
                return message
            })
            state.errorList = err;
            state.errors = errObject;
        }

    }

    return (
        <Observer>
            {() => (
                <Container>
                <Container text>
                    <Header as="h2">Create Team</Header>
                    <Form>
                        <Form.Field error={!!state.errors.nameError}>
                            <Input name="name" onChange={onChange} value={state.name} placeholder="Team Name" fluid />
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
                <Container>Or ask for invite :)</Container>
                </Container>
            )}
        </Observer>
    )
}
export default withRouter(CreateTeam)    
