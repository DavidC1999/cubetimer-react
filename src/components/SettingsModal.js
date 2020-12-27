import React, { useState } from 'react';

import {
    Button,
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

export default function SettingsModal({ settings, setSettings }) {

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <>
            <NavLink href="#" onClick={toggle}>Settings</NavLink>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}