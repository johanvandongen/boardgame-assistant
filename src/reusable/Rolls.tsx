import styled from "styled-components";

export interface IRolls {
    data: number[];
}

export function Rolls({ data }: IRolls) {
    const sequenceLength = 6;
    const nrOfRolls = data.length === 1 ? `${data.length} roll` : `${data.length} rolls`;

    let txt = "";
    if (data.length === 0) {
        txt = nrOfRolls;
    } else if (data.length > sequenceLength) {
        txt = nrOfRolls + " - ...," + data.slice(-sequenceLength).map((roll) => roll);
    } else {
        txt = nrOfRolls + " - " + data.slice(-sequenceLength).map((roll) => roll);
    }

    return <Container>{txt}</Container>;
}

const Container = styled.div`
    /* height: 2rem; */
    white-space: nowrap;
    font-size: 1.5rem;
    color: #888;
`;
