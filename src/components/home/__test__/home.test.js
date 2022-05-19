import React from "react";
import ReactDOM from "react-dom/client";
import Home from "../home.component";

import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

// import renderer from "react-test-renderer";

afterEach(cleanup);

it(`home component renders and unmounts without crashing`, () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Home/>);
    root.unmount();
});

// it(`home component renders correctly`, () => {
//     const tree = renderer.create(<Home/>).toJSON();
//     expect(tree).toMatchSnapShot();
// });