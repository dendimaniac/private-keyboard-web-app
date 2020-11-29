import React from "react";
import { shallow } from "enzyme";

import App from "./App";
import Chat from "./Chat";

describe("<App />", () => {
  it("renders without crashing", () => {
    shallow(<App />);
  });
  it("renders one <Chat/> components", () => {
    const app = shallow(<App />);
    expect(app.find(Chat)).toHaveLength(1);
  });
});
