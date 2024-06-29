import { useState } from "react";
import "./App.css";
import { Histogram } from "./visualisation/histogram/Histogram";
import styled from "styled-components";

function App() {
    const [count, setCount] = useState(0);
    const data = [
        10, 9, 10, 5, 5, 12, 4, 10, 3, 6, 8, 7, 4, 9, 9, 11, 3, 10, 8, 11, 6, 2, 9, 5, 6, 8, 7, 8,
        5, 9, 4, 7, 6, 7, 9, 10, 4, 9, 4, 7, 10, 3, 4, 11, 7, 8, 6, 9, 9, 6, 3, 5, 9, 6, 4, 8, 4,
        10, 9, 10, 7, 2, 7, 5, 7, 6, 8, 9, 5, 8, 4, 9, 11, 8, 6, 10,
    ];

    return (
        <PageWrapper>
            <VisualisationContainer>
                <Histogram values={data} />
            </VisualisationContainer>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </PageWrapper>
    );
}

const PageWrapper = styled.div`
    width: 100%;
    border: 1px solid blue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const VisualisationContainer = styled.div`
    border: 1px solid green;
    width: 70%;
`;

export default App;
