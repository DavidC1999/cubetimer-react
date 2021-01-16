import React, { useState } from 'react';

import {
    Button,
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';

export default function InspectTimeModal({ scramble, time }) {

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);


    return (
        <>
            <span className="timeText" onClick={toggle}>{time}</span>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Scramble</ModalHeader>
                <ModalBody>
                    <p>{scramble}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Done</Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    );
}