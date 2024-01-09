import * as React from "react";

import { Paper } from "@mui/material";

export default function Footer() {
  // const [value, setValue] = React.useState("recents");

  /* const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }; */

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }}
      elevation={3}
    ></Paper>
  );
}
