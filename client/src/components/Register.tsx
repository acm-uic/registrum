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

const Register: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
          Register
        </Typography>

        <FormGroup>
          <TextField type="text" className={classes.input} required label="First Name" aria-describedby="First Name" pattern="[a-z]" />
          <TextField className={classes.input} label="Last Name" required aria-describedby="Last Name" />
          <TextField className={classes.input} label="Email Address" aria-describedby="Email Address" helperText="We will never share your emails with external parties." />
          <TextField className={classes.input} label="Password" type="password" aria-describedby="Password" />

          <Button> Register</Button>
        </FormGroup>
      </Paper>
    </>
  );
};

export default Register;
