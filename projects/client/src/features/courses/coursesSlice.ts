import { createSlice } from '@reduxjs/toolkit'

let nextTodoId = 0

const courseSlice = createSlice({
    name: 'course',
    initialState: [],
    reducers: {
        addCourse: {
            reducer(state, action) {
                const { id, text } = action.payload
                state.push({ id, text, completed: false })
            },
            prepare(text) {
                return { payload: { text, id: nextTodoId++ } }
            }
        },
        remoteCourse(state, action) {
            const todo = state.find(todo => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        }
    }
})

export const { addCourse, remoteCourse } = courseSlice.actions

export default courseSlice.reducer
