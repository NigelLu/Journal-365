import React from "react";
import ReactDOM from "react-dom/client";
import Register from "../register.component";

it(`register component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Register/>);
    root.unmount();
});