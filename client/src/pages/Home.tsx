/*
 * File: /src/views/Home.tsx
 * File Created: Wednesday, 11th December 2019 11:28:51 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Sunday, 5th January 2020 4:43:03 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

import React, { FC } from "react";
import { makeStyles, createStyles, Grid } from "@material-ui/core/";

import SignIn from "@components/Register";
import Register from "@components/SignIn";

const useStyles = makeStyles(({}) =>
  createStyles({
    gridItems: {
      margin: "100px 0 100px 0"
    }
  })
);

export const Home: FC = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={6} justify="center">
        <Grid item xs={12} md={4} className={classes.gridItems}>
          <Register />
        </Grid>
        <Grid item xs={12} md={4} className={classes.gridItems}>
          <SignIn />
        </Grid>
      </Grid>
    </div>
  );
};
