import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar.component";

it(`navbar component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Navbar/>);
    root.unmount();
});