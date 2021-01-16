import './Timer.css';
import React from 'react';

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
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.startTime = 0;
        this.currTime = 0;
        this.timerInterval = null;
        this.isDNF = false;
        this.isPlusTwo = false;
    }

    componentDidMount() {
        this.stateMachine = new StateMachine({
            initial: 'idle',
            states: {
                'idle': {
                    next: () => (
                        this.props.settings.getValue('inspection') ? 'inspection' : 'solving'
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

        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        this.stateMachine = StateMachine.getDummyStatemachine();
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    componentDidUpdate(prevProps) {
        if(this.props.settings !== prevProps.settings) {
            this.stateMachine.reset();
        }
    }

    handleKeyUp(event) {
        if (event.key === ' ') {
            this.stateMachine.nextState();
            console.log(`now in state ${this.stateMachine.getState()}`);
        }
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

            let timeLeft = this.props.settings.getValue('inspection_time') - (this.currTime - this.startTime);
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
        this.isDNF = false;
        this.isPlusTwo = false;
        let newState = {
            ...this.state,
            hint: "Press space to start"
        }
        if (this.props.settings.getValue('inspection')) {
            newState = {
                ...newState,
                display: millisToSeconds(this.props.settings.getValue('inspection_time'))
            };
        } else {
            newState = {
                ...newState,
                display: "00:00.000"
            };
        }
        this.setState(newState);
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