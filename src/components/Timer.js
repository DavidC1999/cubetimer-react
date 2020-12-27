import './Timer.css';
import React, { useState, useEffect } from 'react';

import { formatMillis, millisToSeconds } from '../helperFunctions';
import StateMachine from '../StateMachine';
import Time from '../Time';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            display: "",
            hint: ""
        }

        this.startInspectionTimer = this.startInspectionTimer.bind(this);
        this.startMainTimer = this.startMainTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.initStateIdle = this.initStateIdle.bind(this);
        this.initStateInspection = this.initStateInspection.bind(this);
        this.initStateSolved = this.initStateSolved.bind(this);
        this.initStateSolving = this.initStateSolving.bind(this);

        this.startTime = 0;
        this.currTime = 0;
        this.timerInterval = null;
        this.isDNF = false;
        this.isPlusTwo = false;



        document.addEventListener("keyup", (event) => {
            if (event.key === ' ') {
                this.stateMachine.nextState();
                console.log(`now in state ${this.stateMachine.getState()}`);
            }
        });
    }

    componentDidMount() {
        this.stateMachine = new StateMachine({
            intitial: 'idle',
            states: {
                'idle': {
                    next: () => (
                        this.props.settings.get('inspection') ? 'inspection' : 'solving'
                    ),
                    function: this.initStateIdle
                },
                'inspection': {
                    next: 'solving',
                    function: this.initStateInspection
                },
                'solving': {
                    next: 'solved',
                    function: this.initStateSolving
                },
                'solved': {
                    next: 'idle',
                    function: this.initStateSolved
                }
            }

        });
    }

    startMainTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.currTime = Date.now();
            this.setState({
                ...this.state,
                display: formatMillis(this.currTime - this.startTime)
            });
        }, 1);
    }

    startInspectionTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.currTime = Date.now();

            let timeLeft = this.props.settings.get('inspection_time') - (this.currTime - this.startTime);
            if (timeLeft <= -1000) {
                this.isPlusTwo = false;
                this.isDNF = true;

                this.setState({
                    ...this.state,
                    display: "DNF"
                });
            } else if (timeLeft <= 0) {
                this.isPlusTwo = true;
                this.isDNF = false;

                this.setState({
                    ...this.state,
                    display: "+2"
                });
            } else {
                this.setState({
                    ...this.state,
                    display: millisToSeconds(timeLeft)
                });
            }
        }, 1);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    initStateIdle() {
        this.stopTimer();
        this.setState({
            display: this.state.display,
            hint: "Press space to start"
        });

        if (this.props.settings.get('inspection')) {
            this.setState({
                ...this.state,
                display: millisToSeconds(this.props.settings.get('inspection_time'))
            });
        } else {
            this.setState({
                ...this.state,
                display: "00:00.000"
            });
        }
    }

    initStateInspection() {
        this.stopTimer();
        document.dispatchEvent(new CustomEvent("From:Timer::solve_started"));
        this.setState({
            ...this.state,
            hint: "Inspecting"
        });
        this.startInspectionTimer();
    }

    initStateSolving() {
        this.stopTimer();
        document.dispatchEvent(new CustomEvent("From:Timer::solve_started"));
        this.setState({
            ...this.state,
            hint: "Solving"
        });
        this.startInspectionTimer();
        this.stopTimer();
        this.startMainTimer();
    }

    initStateSolved() {
        this.stopTimer();
        this.setState({
            ...this.state,
            hint: "Done"
        });
        this.stopTimer();
        this.props.setTimeList(prevTimeList => ([
            ...prevTimeList,
            new Time(this.currTime - this.startTime, this.props.scramble, this.isPlusTwo, this.isDNF)
        ]));

        console.log(this.props.settings)


        this.isPlusTwo = false;
        this.isDNF = false;
        document.dispatchEvent(new CustomEvent("From:Timer::solve_ended"));
        document.dispatchEvent(new CustomEvent("For:Scramble::generate"));
    }

    render() {
        return (
            <div className="timer py-5" >
                { this.state.display}
                < sub className="mb-3" > {this.state.hint}</sub>
            </div >
        );
    }
}

/*
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
}*/