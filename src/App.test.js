import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { shallow, mount } from "enzyme";

it("renders without crashing", () => {
  shallow(<App />);
});