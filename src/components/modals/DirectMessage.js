import React from 'react';
import { Modal, Button, Form, Input } from 'semantic-ui-react';
import { getTeamMembersQuery } from '../../gql/team';
import { useQuery } from "@apollo/react-hooks";
import Downshift from 'downshift';
import { withRouter } from 'react-router-dom';
import Teams from '../Teams';


const DirecMessageModal = ({ history, open, onClose, teamId }) => {
    const teamMembersResponse = useQuery(getTeamMembersQuery, {
        variables: { teamId: teamId },
        fetchPolicy: "network-only"
    });
    const { loading, error, data } = teamMembersResponse;
    if (loading) {
        return null
    }
    if (error) {
        return null
    }

    const { getTeamMembers } = data;
    const handleChange = (selectedUser) => {
        history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
        onClose();
    }
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Start conversation with user</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Downshift onChange={handleChange} >
                            {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
                                    <div>
                                        <Input {...getInputProps({ placeholder: 'Start typing user name' })} fluid />
                                        {isOpen ? (
                                            <div style={{ border: '1px solid #ccc' }}>
                                                {getTeamMembers
                                                    .filter(i =>
                                                        !inputValue ||
                                                        i.username.toLowerCase().includes(inputValue.toLowerCase()))
                                                    .map((item, index) => (
                                                        <div
                                                            {...getItemProps({ item })}
                                                            key={item.id}
                                                            style={{
                                                                backgroundColor: highlightedIndex === index ? 'gray' : 'white',
                                                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                            }}
                                                        >
                                                            {item.username}
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                        </Downshift>
                    </Form.Field>
                    <Button fluid onClick={onClose}>
                        Cancel
            </Button>
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default withRouter(DirecMessageModal)