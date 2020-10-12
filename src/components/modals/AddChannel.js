import React from 'react';
import { Button, Form, Input } from 'formik-semantic-ui';
import { Modal } from 'semantic-ui-react';
import { useMutation } from "@apollo/react-hooks";
import { userQuery } from '../../gql/team'
import findIndex from 'lodash/findIndex';
import produce from "immer";
import { createChannelMutation } from '../../gql/channel'



const AddChannelModal = ({ open, onClose, teamId }) => {
    const [performOperation,] = useMutation(createChannelMutation, {
        update: (cache, { data: { createChannel } }) => {
            const { ok, channel } = createChannel;
            if (!ok) return;
            //updating apollo cache
            const usersCache = cache.readQuery({ query: userQuery });
            const arrayTeamId = findIndex(usersCache.me.teams, ['id', +teamId]);

            cache.writeQuery({
                query: userQuery, data: produce(usersCache, x => {
                    x.me.teams[arrayTeamId].channels.push(channel)
                })
            });
        }
    });
    const _handleSubmit = async (values, formikApi) => {
        const response = await performOperation({ variables: { teamId: +teamId, name: values.name } })
        const { ok } = response.data.createChannel
        formikApi.setSubmitting(false);
        if (ok) {
            onClose();
        }
    };
    return (<Modal open={open} onClose={onClose}>
        <Modal.Header>Add channel</Modal.Header>
        <Modal.Content>
            <Form initialValues={{ name: '' }}
                onSubmit={_handleSubmit}>
                {({ isSubmitting, handleReset, handleBlur, handleChange, values }) => (
                    <Form.Children>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <Input value={values.name} fluid name="name" onChange={handleChange} onBlur={handleBlur}
                                    placeholder="Channel name" />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <Button fluid disabled={isSubmitting} onClick={onClose}>
                                    Cancel
                                </Button>
                            </Form.Field>
                            <Form.Field>
                                <Button.Submit fluid disabled={isSubmitting}>
                                    Add Channel
                                </Button.Submit>
                            </Form.Field>
                        </Form.Group>
                    </Form.Children>
                )}
            </Form>
        </Modal.Content>
    </Modal>)
}

export default AddChannelModal