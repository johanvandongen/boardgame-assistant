/* eslint-disable prettier/prettier */
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import styled from "styled-components";

export interface INumberInputButtonGridProps {
    addNumber: (num: number) => void;
    clear: () => void;
}
export function NumberInputButtonGrid({ addNumber, clear }: INumberInputButtonGridProps) {
    const variant = "text";
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ButtonGridContainer>
                <Button variant={variant} onClick={() => addNumber(-1)}>{"<"}</Button>
                <Button variant={variant} onClick={() => addNumber(2)}>2</Button>
                <Button variant={variant} onClick={() => addNumber(3)}>3</Button>
                <Button variant={variant} onClick={() => addNumber(4)}>4</Button>
                <Button variant={variant} onClick={() => addNumber(5)}>5</Button>
                <Button variant={variant} onClick={() => addNumber(6)}>6</Button>
                <Button variant={variant} onClick={() => addNumber(7)}>7</Button>
                <Button variant={variant} onClick={() => addNumber(8)}>8</Button>
                <Button variant={variant} onClick={() => addNumber(9)}>9</Button>
                <Button variant={variant} onClick={() => addNumber(10)}>10</Button>
                <Button variant={variant} onClick={() => addNumber(11)}>11</Button>
                <Button variant={variant} onClick={() => addNumber(12)}>12</Button>
                <Button sx={{ gridColumn: "1/4" }} variant={variant} onClick={handleClickOpen}>clear</Button>
            </ButtonGridContainer>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you want to clear all data?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            clear();
                        }}
                        autoFocus
                    >
                        Clear
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const ButtonGridContainer = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
`;
