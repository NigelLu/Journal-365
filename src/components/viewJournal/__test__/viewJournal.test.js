import React from "react";
import ReactDOM from "react-dom/client";
import ViewJournal from "../viewJournal.component";

it(`viewJournal component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<ViewJournal/>);
    root.unmount();
});