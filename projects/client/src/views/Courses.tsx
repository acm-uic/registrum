import * as React from 'react'
import { Stack, CommandBar, ICommandBarItemProps, Spinner, SpinnerSize } from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import { CourseList } from '../features/courses/CourseList'
import AddCourse from '../features/courses/AddCourse'
import { Course } from 'registrum-common/dist/lib/Banner'

interface ICoursesProps {
    courses: Course[] | undefined
    onAddCourse: any
}

export const Courses: React.FunctionComponent<ICoursesProps> = ({ courses }: ICoursesProps) => {
    const [isAddCoursesPanelOpen, setIsAddCoursesPanelOpen] = React.useState(false)
    const openAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(true))
    const dismissAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(false))

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

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <CommandBar
                items={items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
            <AddCourse
                onAddCourse={null}
                isOpen={isAddCoursesPanelOpen}
                dismissPanel={dismissAddCoursesPanel}
            />
            {courses && courses.length > 0 ? (
                <CourseList items={courses} />
            ) : (
                <Spinner size={SpinnerSize.large} />
            )}
        </Stack>
    )
}

export default Courses
