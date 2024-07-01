import styled from "styled-components";

export interface INumberInputButtonGridProps {
    addNumber: (num: number) => void;
}
export function NumberInputButtonGrid({ addNumber }: INumberInputButtonGridProps) {
    return (
        <ButtonGridContainer>
            <GridButton onClick={() => addNumber(2)}>2</GridButton>
            <GridButton onClick={() => addNumber(3)}>3</GridButton>
            <GridButton onClick={() => addNumber(4)}>4</GridButton>
            <GridButton onClick={() => addNumber(5)}>5</GridButton>
            <GridButton onClick={() => addNumber(6)}>6</GridButton>
            <GridButton onClick={() => addNumber(7)}>7</GridButton>
            <GridButton onClick={() => addNumber(8)}>8</GridButton>
            <GridButton onClick={() => addNumber(9)}>9</GridButton>
            <GridButton onClick={() => addNumber(10)}>10</GridButton>
            <GridButton onClick={() => addNumber(11)}>11</GridButton>
            <GridButton onClick={() => addNumber(12)}>12</GridButton>
            <GridButton onClick={() => addNumber(-1)}>{"<"}</GridButton>
        </ButtonGridContainer>
    );
}

const ButtonGridContainer = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
`;

const GridButton = styled.div`
    border-radius: 0.5rem;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: border-color 0.25s;
    display: flex;
    justify-content: center;
    align-items: center;
`;
