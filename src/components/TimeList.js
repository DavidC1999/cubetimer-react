import './TimeList.css'
import React, { useEffect, useState } from 'react';

import {
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';

import InspectTimeModal from './InspectTimeModal';

export default function TimeList({ timeList, setTimeList }) {

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

    const togglePlusTwo = idx => {
        let timeListCpy = [...timeList];
        timeListCpy[idx].plusTwo = !timeListCpy[idx].plusTwo;
        setTimeList(timeListCpy);
    }
    
    const toggleDNF = idx => {
        let timeListCpy = [...timeList];
        timeListCpy[idx].dnf = !timeListCpy[idx].dnf;
        setTimeList(timeListCpy);
    }

    const deleteTime = idx => {
        let timeListCpy = [...timeList];
        timeListCpy.splice(idx, 1);
        setTimeList(timeListCpy);
    }

    return (
        <div className={`timelist px-2 text-center ${hidden ? "hidden" : ""}`}>
            <ListGroup>
                {timeList.map((time, idx) => (
                    <ListGroupItem key={idx} className="px-5 time">
                        {/* <span className="timeText" onClick={() => alert(time.getScramble())}>{time.getString()}</span> */}
                        <InspectTimeModal scramble={time.getScramble()} time={time.getString()}/>
                        <span>
                            <Button
                                color="muted"
                                className={`btn-sm ml-3 ${time.plusTwo ? "btn-outline-warning" : "btn-outline-primary"}`}
                                onClick={() => togglePlusTwo(idx) }
                            >+2</Button>
                            <Button
                                color="muted"
                                className={`btn-sm ml-2 ${time.dnf ? "btn-outline-warning" : "btn-outline-primary"}`}
                                onClick={() => toggleDNF(idx) }
                            >DNF</Button>
                            <Button
                                color="muted"
                                className="btn-sm ml-4 btn-outline-danger"
                                onClick={() => deleteTime(idx) }
                            >X</Button>
                        </span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div>
    );
}