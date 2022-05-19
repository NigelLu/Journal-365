import React from "react";
import ReactDOM from "react-dom/client";
import Welcome from "../welcome.component";

it(`welcome component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Welcome/>);
    root.unmount();
});