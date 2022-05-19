import React from "react";
import ReactDOM from "react-dom/client";
import EditJournal from "../editJournal.component";

it(`editJournal component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<EditJournal/>);
    root.unmount();
});