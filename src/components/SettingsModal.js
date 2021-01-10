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

export default function SettingsModal({ settings, setSettings }) {

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);


    const updateSetting = (event) => {
        let elem = event.target;

        let value = elem.value;
        switch (settings.getType(elem.name)) {
            case "number":
                value = parseFloat(value);
                break;
            case "boolean":
                console.log("Changing var type to bool")
                value = value === "true" ? true : false;
        }

        setSettings(prevSettings => {
            let cpy = prevSettings.createCopy();
            return cpy.update(elem.name, value);
        });
    }

    return (
        <>
            <NavLink href="#" onClick={toggle}>Settings</NavLink>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Settings</ModalHeader>
                <ModalBody>

                    <Form>
                        {settings.getAll().map((setting) => (
                            <FormGroup>
                                <Label>{setting["pretty name"]}</Label>
                                {setting["type"] === "number" &&
                                    <Input onChange={updateSetting} type="number" name={setting["name"]} value={setting["value"]} key={setting["name"]} />
                                }

                                {setting["type"] === "boolean" &&
                                    <Input onChange={updateSetting} type="select" name={setting["name"]} value={setting["value"]} key={setting["name"]}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Input>
                                }

                                {setting["type"] === "option" &&
                                    <Input onChange={updateSetting} type="select" name={setting["name"]} value={setting["value"]} key={setting["name"]}>
                                        {setting["options"].map((option, idx) => (
                                            <option key={`${setting["name"]}-${idx}`} value={option}>{option}</option>
                                        ))}
                                    </Input>
                                }

                            </FormGroup>
                        ))}
                    </Form>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => console.log(settings.getValue("inspection"))}>Debug</Button>{' '}
                    <Button color="primary" onClick={toggle}>Done</Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    );
}