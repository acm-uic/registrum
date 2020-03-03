import React, { FC } from 'react'

import {
    Paper,
    Typography,
    TextField,
    Button,
    FormGroup,
    makeStyles,
    createStyles
} from '@material-ui/core'

const useStyles = makeStyles(({ spacing }) =>
    createStyles({
        paper: {
            padding: spacing(2),
            height: '350px'
        },
        title: {
            marginBottom: spacing(1)
        },
        input: {
            marginBottom: spacing(1)
        }
    })
)

const AddClassForm: FC = () => {
    const classes = useStyles()

    return (
        <>
            <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                    Sign In
                </Typography>

                <FormGroup>
                    <TextField
                        className={classes.input}
                        label="Course Name"
                        aria-describedby="Course Name"
                    />
                    <TextField
                        className={classes.input}
                        label="Course Number"
                        type="number"
                        aria-describedby="Course Number"
                    />
                    <Button> Track</Button>
                </FormGroup>
            </Paper>
        </>
    )
}

export default AddClassForm
