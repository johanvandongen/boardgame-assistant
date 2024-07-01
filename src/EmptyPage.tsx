import * as React from "react";

import { styled } from "@mui/material/styles";

export function EmptyPage() {
    return <EmptyPageContainer>Wow such empty..</EmptyPageContainer>;
}

const EmptyPageContainer = styled("div")(() => ({
    // height: "100vh",
    paddingTop: "5rem",
    // border: "1px solid black",
    color: "#888",
    // width: "100%",
}));
