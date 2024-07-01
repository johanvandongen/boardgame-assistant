import { useState } from "react";
import "./App.css";
import {
    AppBar,
    Autocomplete,
    Box,
    IconButton,
    InputBase,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { EmptyPage } from "./EmptyPage";
import Catan from "./Catan";

function App() {
    type GameItem = {
        label: string;
        component: JSX.Element | null;
    };

    const gameItems: GameItem[] = [
        { label: "catan", component: <Catan /> },
        { label: "risk", component: null },
    ];

    const [game, setGame] = useState<GameItem | null>(gameItems[0]);
    const [inputValue, setInputValue] = useState("");

    return (
        <PageWrapper>
            <Box sx={{ width: "100%" }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                        >
                            Board Game Assistant
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={game === null ? null : game.label}
                                onChange={(event: unknown, newValue: string | null) => {
                                    // setGame(newValue);
                                    if (newValue === null || newValue === undefined) {
                                        setGame(null);
                                    } else {
                                        const newGame = gameItems.filter(
                                            (g) => g.label === newValue
                                        );
                                        newGame.length > 0 ? setGame(newGame[0]) : setGame(null);
                                    }
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                renderInput={(params) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const { InputLabelProps, InputProps, ...rest } = params;
                                    return <StyledInputBase {...params.InputProps} {...rest} />;
                                }}
                                options={gameItems.map((option) => option.label)}
                                sx={{ width: 200 }}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
            </Box>
            {game?.component === null ? <EmptyPage /> : game?.component}
        </PageWrapper>
    );
}

const PageWrapper = styled("div")(() => ({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

export default App;
