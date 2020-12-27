import React, { useState } from 'react';

export default function TestComponent() {
    const [count, setCount] = useState(0); 

    const incrementCount = () => {
        setCount(count + 1);
    }

    return (
        <>
            <p>{count}</p>
            <button onClick={incrementCount}>Click me</button>
        </>
    );
}