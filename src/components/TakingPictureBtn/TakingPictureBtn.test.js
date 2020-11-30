import React from "react";
import { shallow } from "enzyme";

import TakingPictureBtn from "./index.jsx";

describe("<TakingPictureBtn />", () => {
  
  it("renders without crashing", () => {
    shallow(<TakingPictureBtn />);
  });

});
