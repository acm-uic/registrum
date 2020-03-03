import React, { FC } from 'react'
import { Paper, makeStyles, createStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(({}) =>
    createStyles({
        paper: {
            backgroundColor: 'blue'
        }
    })
)

const SignIn: FC = () => {
    const classes = useStyles()

    return (
        <>
            <Paper className={classes.paper}>
                <Typography variant="h4"></Typography>
            </Paper>
        </>
    )
}

export default SignIn
