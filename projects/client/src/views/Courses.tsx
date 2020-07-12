import * as React from 'react'
import { Stack, CommandBar, Selection, ICommandBarItemProps } from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import { CourseList } from '../features/courses/CourseList'
import AddCourse from '../features/courses/AddCourse'
import { Course } from 'registrum-common/dist/lib/Banner'
import { useDispatch } from '../redux/store'
import { updateUser } from '../redux/auth/thunk'

interface ICoursesProps {
    courses: Course[]
}

export const Courses: React.FunctionComponent<ICoursesProps> = ({ courses }: ICoursesProps) => {
    const [isAddCoursesPanelOpen, setIsAddCoursesPanelOpen] = React.useState(false)
    const openAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(true))
    const dismissAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(false))
    const dispatch = useDispatch()
    const selection = new Selection()

    const items: ICommandBarItemProps[] = [
        {
            key: 'add',
            text: 'Add',
            iconProps: { iconName: 'Add' },
            onClick: openAddCoursesPanel
        },
        {
            key: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            onClick: () => console.log('Delete'),
            disabled: true
        },
        {
            key: 'refresh',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => dispatch(updateUser())
        }
    ]

    const farItems: ICommandBarItemProps[] = [
        {
            key: 'info',
            text: 'Details',
            ariaLabel: 'Details',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: () => console.log(selection.count)
        }
    ]

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <CommandBar
                items={items}
                farItems={farItems}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
            <AddCourse isOpen={isAddCoursesPanelOpen} dismissPanel={dismissAddCoursesPanel} />

            <CourseList selection={selection} items={courses} />
        </Stack>
    )
}

export default Courses
