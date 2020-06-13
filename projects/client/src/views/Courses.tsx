import * as React from 'react'
import {
    Stack,
    CommandBar,
    ICommandBarItemProps
} from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import { ICourse, CourseList } from '../components/CourseList'
import AddCourse from '../components/AddCourse'

interface ICoursesProps {
    courses: ICourse[] | undefined
    onAddCourse: any
}

export const Courses: React.FunctionComponent<ICoursesProps> = ({
    courses
}: ICoursesProps) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const openPanel = useConstCallback(() => setIsOpen(true))
    const dismissPanel = useConstCallback(() => setIsOpen(false))


    const items: ICommandBarItemProps[] = [
        {
            key: 'add',
            text: 'Add',
            iconProps: { iconName: 'Add' },
            onClick: openPanel
        },
        {
            key: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            onClick: () => console.log('Delete'),
            disabled: true
        }
    ]
    return (
        <Stack tokens={{childrenGap: 15}}>
            <CommandBar
                items={items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            /> 
            <AddCourse onAddCourse={null} isOpen={isOpen} dismissPanel={dismissPanel} />
            {courses && courses.length > 0 ? <CourseList items={courses} /> : <></>}
        </Stack>
    )
}

export default Courses
