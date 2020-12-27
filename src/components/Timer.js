import './Timer.css';
import React, { useState, useEffect } from 'react';

import { formatMillis, millisToSeconds } from '../helperFunctions';
import StateMachine from '../StateMachine';
import Time from '../Time';

export default function Timer({ settings, setTimeList, scramble }) {
    // keyup event listener
    const [display, setDisplay] = useState("");
    const [hint, setHint] = useState("");
    useEffect(() => {
        document.addEventListener("keyup", (event) => {
            if (event.key === ' ') spacePressed();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(`new scramble detected: ${scramble}`);
    }, [scramble]);


    let timerInterval;

    let startTime = 0;
    let currTime = 0;
    const startMainTimer = () => {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            currTime = Date.now();
            setDisplay(formatMillis(currTime - startTime));
        }, 1);
    }

    const [plusTwo, setPlusTwo] = useState(false);
    const [dnf, setDnf] = useState(false);

    const startInspectionTimer = () => {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            currTime = Date.now();

            let timeLeft = settings.get('inspection_time') - (currTime - startTime);
            if (timeLeft <= -1000) {
                setPlusTwo(false);
                setDnf(true);
                setDisplay("DNF");
            } else if (timeLeft <= 0) {
                setPlusTwo(true);
                setDnf(false);
                setDisplay("+2");
            } else {
                setDisplay(millisToSeconds(timeLeft));
            }
        }, 1);
    }

    const stopTimer = () => {
        clearInterval(timerInterval);
    }

    let testFunc = () => {
        stopTimer();
        setHint("Done");
        stopTimer();
        setTimeList(prevTimeList => ([
            ...prevTimeList,
            new Time(currTime - startTime, scramble, plusTwo, dnf)
        ]));
        console.log(settings)


        setPlusTwo(false);
        setDnf(false);
        document.dispatchEvent(new CustomEvent("From:Timer::solve_ended"));
        document.dispatchEvent(new CustomEvent("For:Scramble::generate"));
    }

    let stateMachine;

    useEffect(() => {
        stateMachine = new StateMachine({
            intitial: 'idle',
            states: {
                'idle': {
                    next: () => (
                        settings.get('inspection') ? 'inspection' : 'solving'
                    ),
                    function: () => {
                        stopTimer();
                        setHint("Press space to start");
                        if (settings.get('inspection')) {
                            setDisplay(millisToSeconds(settings.get('inspection_time')));
                        } else {
                            setDisplay("00:00.000");
                        }
                    }
                },
                'inspection': {
                    next: 'solving',
                    function: () => {
                        stopTimer();
                        document.dispatchEvent(new CustomEvent("From:Timer::solve_started"));
                        setHint("Inspecting");
                        startInspectionTimer();
                    }
                },
                'solving': {
                    next: 'solved',
                    function: () => {
                        stopTimer();
                        document.dispatchEvent(new CustomEvent("From:Timer::solve_started"));
                        setHint("Solving");
                        startInspectionTimer();
                        stopTimer();
                        startMainTimer();
                    }
                },
                'solved': {
                    next: 'idle',
                    function: testFunc
                }
            }
        });
    }, []);

    const spacePressed = () => {
        stateMachine.nextState();
        console.log(`now in state ${stateMachine.getState()}`);
    }

    return (
        <div className="timer py-5">
            {display}
            <sub className="mb-3">{hint}</sub>
        </div>
    );
}