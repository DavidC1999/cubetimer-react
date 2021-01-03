import React, { useEffect, useState } from 'react';
import './Scramble.css';

import getGenerator from '../scramblegenerators/generators';

export default function Scramble({ settings, scramble, setScramble }) {

    const [hidden, setHidden] = useState(false);

    const newScramble = () => {
        console.log("Generating scramble");
        let generator = getGenerator(settings.getValue("scramble_type"));
        let scramble = generator.generate(settings.getValue("scramble_length"));
        setScramble(scramble);
    };

    useEffect(() => {
        newScramble();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    useEffect(() => {
        document.addEventListener("For:Scramble::generate", () => {
            newScramble();
        });

        document.addEventListener("From:Timer::solve_started", () => {
            setHidden(true);
        })

        document.addEventListener("From:Timer::solve_ended", () => {
            setHidden(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);


    return (
        <div className="text-center">
            <sub className={`scramble ${hidden ? "hidden" : ""}`} style={{transition: "opacity .3s"}}>{scramble}</sub>
        </div>
    );
}