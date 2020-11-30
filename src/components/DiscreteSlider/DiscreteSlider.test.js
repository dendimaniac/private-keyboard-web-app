import React from "react";
import { shallow } from "enzyme";

import DiscreteSlider from "./index.jsx";

describe("<DiscreteSlider />", () => {
  
  it("renders without crashing", () => {
    shallow(<DiscreteSlider />);
  });

});
