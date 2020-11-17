import React from "react";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value}°`;
}

let currentSliderValue = 30;

export default function DiscreteSlider({ updateTiltAngle }) {
  const classes = useStyles();

  const handleSliderChange = (_, value) => {
    if (value === currentSliderValue) return;

    currentSliderValue = value;
    updateTiltAngle(value);
  };

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        Tilt adjustment
      </Typography>
      <Slider
        defaultValue={currentSliderValue}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
        onChange={handleSliderChange}
      />
    </div>
  );
}
