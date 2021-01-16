import { React, useEffect, useRef } from "react";
import Time from '../Time';

import './ManualTimes.css';

export default function ManualTimes({ setTimeList, scramble }) {

    let minRef = useRef(null);
    let secRef = useRef(null);
    let milRef = useRef(null);

    const filterNonNumeric = (str) => {
        let digits = "0123456789".split('');
        str = str.split('');
        for (let i = str.length - 1; i >= 0; --i) {
            if (digits.indexOf(str[i]) === -1) {
                str.splice(i, 1);
            }
        }
        return str.join('');
    }

    const newInput = event => {
        let target = event.target;

        target.value = filterNonNumeric(target.value);

        if (target.value)

            switch (target.id) {
                case "timeInputMin":
                    if (target.value.length >= 2) {
                        secRef.current.focus();
                    }
                    break;
                case "timeInputSec":
                    if (target.value.length >= 2) {
                        milRef.current.focus();
                    } else if (target.value.length === 0) {
                        minRef.current.focus();
                    }
                    break;
                case "timeInputMil":
                    if (target.value.length === 0) {
                        secRef.current.focus();
                    }
                    break;
                default:
                    break;
            }
    }

    const getTime = () => {
        let millis =
            parseInt(minRef.current.value) * 60000 +
            parseInt(secRef.current.value) * 1000 +
            parseInt(milRef.current.value);
        console.log(millis);
        return millis;
    }

    const addTime = () => {
        setTimeList(prevTimeList => ([
            ...prevTimeList,
            new Time(getTime(), scramble, false, false)
        ]));
    }

    const clearFields = () => {
        minRef.current.value = "";
        secRef.current.value = "";
        milRef.current.value = "";
    }

    const handleKeyUp = event => {
        if (event.key === 'Enter') {
            addTime();
            clearFields();
        }
    }

    useEffect(() => {
        minRef.current.focus();

        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    return (
        <div className="manualTimes">
            <input ref={minRef} className="timeInput" id="timeInputMin" onChange={newInput} type="text" />:
            <input ref={secRef} className="timeInput" id="timeInputSec" onChange={newInput} type="text" />:
            <input ref={milRef} className="timeInput" id="timeInputMil" onChange={newInput} type="text" />
        </div>
    );
}