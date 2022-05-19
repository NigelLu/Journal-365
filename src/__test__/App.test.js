import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";

it(`App renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<App/>);
    root.unmount();
});