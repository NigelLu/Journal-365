import React from "react";
import ReactDOM from "react-dom/client";
import AddBackground from "../addBackground.component";

it(`addBackground component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<AddBackground/>);
    root.unmount();
});
