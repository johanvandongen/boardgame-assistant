// import { useState } from "react";
import "./App.css";
// import { Histogram } from "./visualisation/histogram/Histogram";
import styled from "styled-components";
import { RunningDiceStatisTics } from "./RunningDiceStatisics";

function App() {
    // const [count, setCount] = useState(0);

    return (
        <PageWrapper>
            <RunningDiceStatisTics />
            {/* <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div> */}
            {/* <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
        </PageWrapper>
    );
}

const PageWrapper = styled.div`
    width: 100%;
    /* border: 1px solid blue; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default App;
