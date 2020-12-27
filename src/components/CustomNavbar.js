import React, { useState, useEffect } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import SettingsModal from './SettingsModal';

export default function CustomNavbar({ settings, setSettings }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        document.addEventListener("From:Timer::solve_started", () => {
            setHidden(true);
        })

        document.addEventListener("From:Timer::solve_ended", () => {
            setHidden(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    const newScramble = () => {
        document.dispatchEvent(new CustomEvent("For:Scramble::generate"));
    }

    return (
        <Navbar color="primary" dark expand="md" className={`${hidden ? "hidden" : ""}`} style={{ transition: "opacity .3s" }}>
            <NavbarBrand>React Cube Timer</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <SettingsModal settings={settings} setSettings={setSettings}/>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" onClick={newScramble}>New scramble</NavLink>
                    </NavItem>
                    {/* <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Options
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                Option 1
                        </DropdownItem>
                            <DropdownItem>
                                Option 2
                        </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
                                Reset
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown> */}
                </Nav>
            </Collapse>
        </Navbar>
    );
}