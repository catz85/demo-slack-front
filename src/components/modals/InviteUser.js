import React from 'react';
import { Button, Form, Input } from 'formik-semantic-ui';
import { Modal } from 'semantic-ui-react';
import { useMutation } from "@apollo/react-hooks";
import { addTeamMemberMutation } from '../../gql/team'
import normalizeErrors from '../../lib/normalizeErrors'

const InviteUserModal = ({ open, onClose, teamId }) => {
    //add update here to catch users through ws
    const [performOperation,] = useMutation(addTeamMemberMutation);

    const _handleSubmit = async (values, formikApi) => {
        const response = await performOperation({ variables: { teamId: +teamId, email: values.email } })
        const { ok, errors } = response.data.addTeamMember
        formikApi.setSubmitting(false);
        if (ok) {
            onClose();
        } else {
            formikApi.setErrors([{email:'this user cant be added'}])
        }
    };
    return (<Modal open={open} onClose={onClose}>
        <Modal.Header>Invite User to team</Modal.Header>
        <Modal.Content>
            <Form initialValues={{ email: '' }}
                onSubmit={_handleSubmit}>
                {({ isSubmitting, handleReset, handleBlur, handleChange, values }) => (
                    <Form.Children>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <Input value={values.email} fluid name="email" placeholder="User email" onChange={handleChange} onBlur={handleBlur} />
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
                                    Invite User
                                </Button.Submit>
                            </Form.Field>
                        </Form.Group>
                    </Form.Children>
                )}
            </Form>
        </Modal.Content>
    </Modal>)
}

export default InviteUserModal