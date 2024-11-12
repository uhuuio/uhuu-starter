import React, { Fragment, useEffect } from 'react';

import MarkdownPage from "./pages/MarkdownPage";

export function Template({ payload }) {

    return (
        <>
            <MarkdownPage payload={payload} />
        </>
    );
}