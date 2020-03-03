import React, { FC } from "react";

import { Paper, makeStyles, createStyles, Typography, FormGroup } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    paper: {
      padding: spacing(2),
      height: "350px"
    },
    title: {
      marginBottom: spacing(1)
    },
    input: {
      marginBottom: spacing(1)
    }
  })
);

const SignIn: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
          Sign In
        </Typography>

        <FormGroup>
          <TextField className={classes.input} label="Email Address" aria-describedby="Email Address" helperText="We will never share your emails with external parties." />
          <TextField className={classes.input} label="Password" type="password" aria-describedby="Password" />
          <Button> Sign In</Button>
        </FormGroup>
      </Paper>
    </>
  );
};

export default SignIn;
