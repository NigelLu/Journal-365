import React from "react";
import ReactDOM from "react-dom/client";
import AddJournal from "../addJournal.component";

it(`addJournal component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<AddJournal/>);
    root.unmount();
});