import React from "react";
import ReactDOM from "react-dom/client";
import Login from "../login.component";

it(`login component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Login/>);
    root.unmount();
});