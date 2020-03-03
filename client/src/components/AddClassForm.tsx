import React, { FC, useState } from 'react'

import {
    Paper,
    Typography,
    TextField,
    Button,
    FormGroup,
    makeStyles,
    createStyles
} from '@material-ui/core'

import { store } from '../models/redux/store'
import { setClasses } from '../models/redux/actions/auth'
import { Class } from './models/interfaces/Class'
import axios from 'axios'

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
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(e.target.value)
    }

    const handleSubmit = async () => {
        if (
            (
                await axios.post(
                    '/api/classes/add',
                    {
                        subject: name,
                        number
                    },
                    { withCredentials: true }
                )
            ).status == 200
        )
            try {
                // * Check if we can retrieve classes
                const classes = (await axios.get('/api/classes/userlist')) as Class[]
                store.dispatch(setClasses(classes))
            } catch (err) {
                // * Otherwise set classes to null
                store.dispatch(setClasses(null))
            }
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                    Add Class
                </Typography>

                <FormGroup>
                    <TextField
                        className={classes.input}
                        label="Course Name"
                        aria-describedby="Course Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleName(e)}
                    />
                    <TextField
                        className={classes.input}
                        label="Course Number"
                        type="number"
                        aria-describedby="Course Number"
                        value={number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumber(e)}
                    />
                    <Button onClick={handleSubmit}> Track</Button>
                </FormGroup>
            </Paper>
        </>
    )
}

export default AddClassForm
