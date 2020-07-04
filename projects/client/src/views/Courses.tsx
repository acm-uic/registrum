import * as React from 'react'
import {
    Stack,
    CommandBar,
    ICommandBarItemProps
} from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import { ICourse, CourseList } from '../features/courses/CourseList'
import AddCourse from '../features/courses/AddCourse'
import CourseDetails from '../features/courses/CourseDetails'

interface ICoursesProps {
    courses: ICourse[] | undefined
    onAddCourse: any
}

export const Courses: React.FunctionComponent<ICoursesProps> = ({
    courses
}: ICoursesProps) => {
    const [isAddCoursesPanelOpen, setIsAddCoursesPanelOpen] = React.useState(false)
    const openAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(true))
    const dismissAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(false))

    const [isCourseDetailsPanelOpen, setIsCourseDetailsPanelOpen] = React.useState(false)
    const openCourseDetailsPanel = useConstCallback(() => setIsCourseDetailsPanelOpen(true))
    const dismissCourseDetailsPanel = useConstCallback(() => setIsCourseDetailsPanelOpen(false))

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
            onClick: () => console.log('Refresh')
        }
    ]

    const farItems: ICommandBarItemProps[] = [
        {
            key: 'info',
            text: 'Info',
            iconProps: { iconName: 'Info' },
            onClick: openCourseDetailsPanel
        }
    ]

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <CommandBar
                items={items}
                farItems={farItems}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
            <AddCourse onAddCourse={null} isOpen={isAddCoursesPanelOpen} dismissPanel={dismissAddCoursesPanel} />
            {/* <CourseDetails isOpen={isCourseDetailsPanelOpen} dismissPanel={dismissCourseDetailsPanel} /> */}
            {courses && courses.length > 0 ? <CourseList items={courses} /> : <></>}
        </Stack>
    )
}

export default Courses
