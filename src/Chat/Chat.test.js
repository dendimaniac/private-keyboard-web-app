import React from "react";
import { shallow } from "enzyme";

import Chat from "./index.jsx";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/example/path",
  }),
}));


describe("<Chat />", () => {
  // const chat = shallow(<Chat />);
  
  it("renders without crashing", () => {
    shallow(<Chat />);
  });

});


