import * as React from "react";

import { styled } from "@mui/material/styles";

export function EmptyPage() {
    return <EmptyPageContainer>Wow such empty..</EmptyPageContainer>;
}

const EmptyPageContainer = styled("div")(() => ({
    paddingTop: "5rem",
    color: "#888",
}));
