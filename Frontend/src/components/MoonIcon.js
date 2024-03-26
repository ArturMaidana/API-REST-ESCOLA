// MoonIcon.js
import React from "react";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import IconButton from "@mui/material/IconButton";

const MoonIcon = ({ onClick, darkMode }) => {
  return (
    <IconButton color="inherit" onClick={onClick}>
      {darkMode ? <Brightness2Icon /> : <WbSunnyIcon />}
    </IconButton>
  );
};

export default MoonIcon;
