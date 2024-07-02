import { styled, useTheme } from "@mui/material/styles";

export function EmptyPage() {
    const theme = useTheme();
    return (
        <EmptyPageContainer sx={{ color: theme.palette.text.secondary }}>
            Wow such empty..
        </EmptyPageContainer>
    );
}

const EmptyPageContainer = styled("div")(() => ({
    paddingTop: "5rem",
    color: "#888",
}));
