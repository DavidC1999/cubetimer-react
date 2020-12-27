import React, { useMemo, useState, useEffect } from 'react';

import { formatMillis, getMin, getMax, getAvg, getMinAndMaxIdx } from '../helperFunctions';

import {
    Row,
    Col
} from 'reactstrap';

import './StatsList.css'

export default function StatsList({ timeList }) {

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

    const millisList = useMemo(() => {
        return timeList.map(time => time.getTime());
    }, [timeList]);

    const last5 = useMemo(() => {
        return millisList.slice(Math.max(millisList.length - 5, 0));
    }, [millisList]);

    const best = useMemo(() => {
        if (millisList.length === 0) return "-";
        return formatMillis(getMin(millisList));
    }, [millisList]);

    const worst = useMemo(() => {
        if (millisList.length === 0) return "-";
        return formatMillis(getMax(millisList));
    }, [millisList]);

    const avg = useMemo(() => {
        if (millisList.length === 0) return "-";
        return formatMillis(getAvg(millisList));
    }, [millisList]);

    const avg5 = useMemo(() => {
        if (last5.length < 5) return "-";
        return formatMillis(getAvg(last5));
    }, [last5]);

    const avg3of5 = useMemo(() => {
        if (last5.length < 5) return "-";
        let [minIdx, maxIdx] = getMinAndMaxIdx(last5);

        let _3of5;
        _3of5 = [...last5]; // copy
        _3of5 = _3of5.splice(minIdx, 1);
        _3of5 = _3of5.splice(maxIdx, 1);

        return formatMillis(getAvg(_3of5));
    }, [last5]);


    return (
        <div className={`timeStats px-2 ${hidden ? "hidden" : ""}`}>
            <Row>
                <Col className="text-right px-1">
                    <ul>
                        <li>Best:</li>
                        <li>Worst:</li>
                        <li>Average:</li>
                    </ul>
                </Col>
                <Col className="text-left px-1">
                    <ul>
                        <li>{best}</li>
                        <li>{worst}</li>
                        <li>{avg}</li>
                    </ul>
                </Col>
            </Row>
            <hr className="border-secondary" />
            <Row>
                <Col className="text-right px-1">
                    <ul>
                        <li>Avg 5:</li>
                        <li>Avg 3 of 5:</li>
                    </ul>
                </Col>
                <Col className="text-left px-1">
                    <ul>
                        <li>{avg5}</li>
                        <li>{avg3of5}</li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}