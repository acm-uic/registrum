import * as React from 'react'
import { Stack, Panel, Text } from '@fluentui/react'

import { Course } from 'registrum-common/dist/lib/Banner'

export interface IDetailsCourse {
    isOpen: boolean
    dismissPanel: () => void
    course?: Course
}

export const DetailsCourse: React.FunctionComponent<IDetailsCourse> = ({
    isOpen,
    dismissPanel,
    course
}: IDetailsCourse) => {
    return (
        <Panel
            isLightDismiss
            isOpen={isOpen}
            closeButtonAriaLabel="Close"
            isHiddenOnDismiss={true}
            headerText="Course Details"
            onDismiss={dismissPanel}
        >
            <Stack>
                {course ? (
                    <pre>{JSON.stringify(course, null, '  ')}</pre>
                ) : (
                    <Text>No course selected.</Text>
                )}
            </Stack>
        </Panel>
    )
}

export default DetailsCourse
