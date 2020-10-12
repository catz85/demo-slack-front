import React from 'react';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import { useLocalObservable, Observer } from "mobx-react-lite";
import AddChannelModal from '../components/modals/AddChannel';
import InviteUserModal from '../components/modals/InviteUser';
import DirectMessageModal from '../components/modals/DirectMessage';

const Sidebar = ({ teams, team, username }) => {
    const state = useLocalObservable(() => ({
        openAddChannelModal: false,
        openInviteUserModal: false,
        openDirectMessageModal: false,
        changeAddChannelModalState(e) {
            if (e) e.preventDefault()
            this.openAddChannelModal = !this.openAddChannelModal;
        },
        changeInviteUserModal(e) {
            if (e) e.preventDefault()
            this.openInviteUserModal = !this.openInviteUserModal;
        },
        changeDirectMessageModal(e) {
            if (e) e.preventDefault()
            this.openDirectMessageModal = !this.openDirectMessageModal;
        }
    }));

    const handleAddChannelOpenCloseClick = () => {
        state.changeAddChannelModalState()
    }
    const handleInviteUserOpenCloseClick = () => {
        state.changeInviteUserModal()
    }
    const handleDirectMessageOpenCloseClick = () => {
        state.changeDirectMessageModal()
    }

    return (<Observer>
        {() => (
            [<Teams key="team-sidebar" teams={teams} />,
            <Channels
                key="channels-sidebar"
                teamName={team.name}
                username={username}
                channels={team.channels}
                teamId={team.id}
                users={team.directMessageMembers}
                isOwner={team.admin}
                onInviteUserClick={handleInviteUserOpenCloseClick}
                onAddChannelClick={handleAddChannelOpenCloseClick}
                onDirectMessageClick={handleDirectMessageOpenCloseClick}
            />,
            <AddChannelModal
                teamId={team.id}
                open={state.openAddChannelModal}
                onClose={handleAddChannelOpenCloseClick}
                key="sidebar-add-channel-modal"
            />,
            <InviteUserModal
                teamId={team.id}
                onClose={handleInviteUserOpenCloseClick}
                open={state.openInviteUserModal}
                key="sidebar-invite-user-modal"
            />,
            <DirectMessageModal 
                teamId={team.id}
                onClose={handleDirectMessageOpenCloseClick}
                open={state.openDirectMessageModal}
                key="sidebar-direct-message-modal"
            />
            ]
        )}
    </Observer>)
};

export default Sidebar;