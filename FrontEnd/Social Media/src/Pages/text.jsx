import React, { useState, useMemo } from "react";

function ExpensiveComponent() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");

  // Expensive calculation
  const expensiveCalculation = (num) => {
    console.log("Calculating...");
    for (let i = 0; i < 1000000000; i++) {} // Simulate heavy computation
    return num * 2;
  };

  const memoizedValue = useMemo(() => expensiveCalculation(count), [count]);

  return (
    <div>
      <h1>Expensive Computation</h1>
      <p>Computed Value: {memoizedValue}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here"
      />
    </div>
  );
}
export default ExpensiveComponent;
