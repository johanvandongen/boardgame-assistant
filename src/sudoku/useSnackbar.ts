import { useState, useEffect } from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material";

export interface SnackbarMessage {
    message: string;
    severity: AlertProps["severity"];
    key: number;
}

export default function useSnackbar() {
    const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const addMessage = (message: string, severity: AlertProps["severity"]) => {
        setSnackPack((prev) => [...prev, { message, severity, key: new Date().getTime() }]);
    };

    const snackClose = (reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const snackExited = () => {
        setMessageInfo(undefined);
    };

    return { messageInfo, open, addMessage, snackExited, snackClose };
}
