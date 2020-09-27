import React from "react";
const { Typography, Link } = require("@material-ui/core");

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://rareminds.in/">
        Rakesh Ravuri
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}