/* eslint-disable prettier/prettier */
import { Button } from "@mui/material";
import styled from "styled-components";

export interface INumberInputButtonGridProps {
    addNumber: (num: number) => void;
}
export function NumberInputButtonGrid({ addNumber }: INumberInputButtonGridProps) {
    const variant = "text";
    return (
        <ButtonGridContainer>
            <Button variant={variant} onClick={() => addNumber(2)}>2</Button>
            <Button variant={variant} onClick={() => addNumber(3)}>3</Button>
            <Button variant={variant} onClick={() => addNumber(4)}>4</Button>
            <Button variant={variant} onClick={() => addNumber(5)}>5</Button>
            <Button variant={variant} onClick={() => addNumber(6)}>6</Button>
            <Button variant={variant} onClick={() => addNumber(8)}>8</Button>
            <Button variant={variant} onClick={() => addNumber(7)}>7</Button>
            <Button variant={variant} onClick={() => addNumber(9)}>9</Button>
            <Button variant={variant} onClick={() => addNumber(10)}>10</Button>
            <Button variant={variant} onClick={() => addNumber(11)}>11</Button>
            <Button variant={variant} onClick={() => addNumber(12)}>12</Button>
            <Button variant={variant} onClick={() => addNumber(-1)}>{"<"}</Button>
        </ButtonGridContainer>
    );
}

const ButtonGridContainer = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
`;
