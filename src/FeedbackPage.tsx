import { Link, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

export function FeedbackPage() {
    const theme = useTheme();
    return (
        <EmptyPageContainer sx={{ color: theme.palette.text.secondary }}>
            <Typography>
                Hi there! These are some fun tools that I use when playing games. Wanna use it too
                but something is not working, found a bug, or want to see something new? Send me an{" "}
                <Link href="mailto:johanpvandongen@gmail.com">email</Link> or{" "}
                <Link href="https://github.com/johanvandongen/boardgame-assistant/issues">
                    create an issue
                </Link>
                !
            </Typography>
        </EmptyPageContainer>
    );
}

const EmptyPageContainer = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("sm")]: {
        width: "50%",
    },
    padding: "1rem",
    paddingTop: "5rem",
    textAlign: "center",
    color: "#888",
}));
