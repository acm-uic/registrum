import * as React from 'react';
import {
    Stack,
    Panel,
    Text,
    ComboBox,
    IComboBoxOption
} from '@fluentui/react'

export interface ICourseDetails {
    isOpen: boolean
    dismissPanel: () => void
}

export const CourseDetails: React.FunctionComponent<ICourseDetails> = ({isOpen, dismissPanel}) => {
    const INITIAL_OPTIONS: IComboBoxOption[] = [
        { key: 'A', text: 'Option A' },
        { key: 'B', text: 'Option B' },
        { key: 'C', text: 'Option C' },
        { key: 'D', text: 'Option D' }
    ]

    return (
        <Panel
            isBlocking={false}
            isOpen={isOpen}
            closeButtonAriaLabel="Close"
            isHiddenOnDismiss={true}
            headerText="Add Course"
            onDismiss={dismissPanel}
        >
            <Text variant={'large'}>COURSE DETAILS</Text>
            <Stack tokens={{childrenGap: 15}}>
                <ComboBox
                    label="Term"
                    allowFreeform={false}
                    autoComplete={'on'}
                    options={INITIAL_OPTIONS}
                />
                <ComboBox
                    label="Subject"
                    allowFreeform={false}
                    autoComplete={'on'}
                    options={INITIAL_OPTIONS}
                />
                <ComboBox
                    label="Course Number"
                    allowFreeform={false}
                    autoComplete={'on'}
                    options={INITIAL_OPTIONS}
                />
            </Stack>
        </Panel>
    )
}

export default CourseDetails;
