import React from "react";
import { shallow } from "enzyme";

import ChatInput from "./index.jsx";

const inputSetting = {
  label: "Emaill Address",
  placeholder: "Email Address",
  position: "4",
  type: "email",
};
describe("<ChatInput /> ", () => {
  const props = {
    inputSetting: inputSetting,
  };
  // const chatInput = shallow(<ChatInput {...props} />);
  
  it("renders without crashing given the required props", () => {
    shallow(<ChatInput {...props} />);
  });

});
