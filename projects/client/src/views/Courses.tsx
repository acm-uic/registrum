import * as React from 'react'
import { Stack, CommandBar, Selection, ICommandBarItemProps } from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import { CourseList } from '../features/courses/CourseList'
import AddCourse from '../features/courses/AddCourse'
import CourseDetails from '../features/courses/CourseDetails'
import { Course } from 'registrum-common/dist/lib/Banner'
import { useDispatch } from '../redux/store'
import { updateUser } from '../redux/auth/thunk'
import { courseUnsubscribe } from '../redux/auth/thunk'

interface ICoursesProps {
    courses: Course[]
}

export const Courses: React.FunctionComponent<ICoursesProps> = ({ courses }: ICoursesProps) => {
    const [isAddCoursesPanelOpen, setIsAddCoursesPanelOpen] = React.useState(false)
    const openAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(true))
    const dismissAddCoursesPanel = useConstCallback(() => setIsAddCoursesPanelOpen(false))
    const [detailsCourse, setDetailsCourse] = React.useState<Course>()
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = React.useState(false)
    const openDetailsPanel = useConstCallback(() => setIsDetailsPanelOpen(true))
    const dismissDetailsPanel = useConstCallback(() => setIsDetailsPanelOpen(false))
    const dispatch = useDispatch()

    const [selectedCourse, setSelectedCourse] = React.useState<Course>()
    const selection = new Selection<Course>({
        onSelectionChanged: () => {
            const course = selection.getSelection()[0] as Course
            setSelectedCourse(course)
            setDetailsCourse(course)
        },
        getKey: item => item.courseReferenceNumber
    })

    const onRefresh = () => dispatch(updateUser())
    const onDelete = (courseReferenceNumber: string) =>
        dispatch(courseUnsubscribe({ crn: courseReferenceNumber }))
    const onDetails = (course?: Course) => {
        setDetailsCourse(course)
        openDetailsPanel()
    }

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
            onClick: () => {
                if (selectedCourse) {
                    onDelete(selectedCourse?.courseReferenceNumber)
                }
            },
            disabled: selectedCourse === undefined
        },
        {
            key: 'refresh',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: onRefresh
        }
    ]

    const farItems: ICommandBarItemProps[] = [
        {
            key: 'info',
            text: 'Details',
            ariaLabel: 'Details',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: openDetailsPanel
        }
    ]

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <CommandBar
                items={items}
                farItems={farItems}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
            {courses.length ? (
                <CourseList
                    onAddCourse={openAddCoursesPanel}
                    onRefresh={onRefresh}
                    onDelete={onDelete}
                    onDetails={onDetails}
                    selection={selection}
                    items={courses}
                />
            ) : null}
            <CourseDetails
                isOpen={isDetailsPanelOpen}
                dismissPanel={dismissDetailsPanel}
                course={detailsCourse}
            />
            <AddCourse isOpen={isAddCoursesPanelOpen} dismissPanel={dismissAddCoursesPanel} />
        </Stack>
    )
}

export default Courses
