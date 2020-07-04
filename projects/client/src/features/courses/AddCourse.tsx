import * as React from 'react'
import {
    Stack,
    Panel,
    Text,
    TagPicker,
    IBasePicker,
    ITag,
    PrimaryButton,
    mergeStyleSets,
    FontSizes,
    FontWeights,
    IStackStyles,
    Icon,
    IStackTokens,
    ITextStyles,
    IIconStyles,
    getTheme
} from '@fluentui/react'

import {
    Card,
    ICardTokens,
    ICardSectionStyles,
    ICardSectionTokens
} from '@uifabric/react-cards'

import { ICourse } from './CourseList'

export interface IAddCourse {
    onAddCourse: any
    isOpen: boolean
    dismissPanel: () => void
}

export const AddCourse: React.FunctionComponent<IAddCourse> = ({ isOpen, dismissPanel }) => {

    // TODO: remove dummy data
    const termOptions: ITag[] = [
        { key: '220201', name: '220201 - Spring 2020' },
        { key: '220208', name: '220208 - Fall 2020' }
    ]
    const subjectOptions: ITag[] = [
        { key: 'CS', name: 'Computer Science' },
        { key: 'ECE', name: 'Electrical and Computer Engineering' }
    ]
    const courseNumberOptions: ITag[] = [
        { key: '361', name: '361' },
        { key: '362', name: '362' },
        { key: '411', name: '411' },
        { key: '412', name: '412' }
    ]

    const searchResults = require('../../helpers/FakeCourseData.json')

    const searchResultsStyles = mergeStyleSets({
        card: {},
        cardTitle: {
            fontSize: FontSizes.medium,
            fontWight: FontWeights.semibold
        },
        cardBody: {
            fontSize: FontSizes.small
        },
    })

    const getTextFromItem = (item: ITag): string => item.name

    const _onFilterChanged = (optionsList: ITag[], filter: string, selectedItems?: ITag[]) => {
        return filter
            ? optionsList
                .filter(tag => tag.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
                .filter(tag => !listContainsDocument(tag, selectedItems))
            : []
    }

    const onTermFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
        return _onFilterChanged(termOptions, filter, selectedItems)
    }

    const onSubjectFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
        return _onFilterChanged(subjectOptions, filter, selectedItems)
    }

    const onCourseNumberFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
        return _onFilterChanged(courseNumberOptions, filter, selectedItems)
    }

    const picker = React.createRef<IBasePicker<ITag>>()

    const listContainsDocument = (tag: ITag, selectedItems?: ITag[]) => {
        if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
            return false
        }
        return selectedItems.filter(compareTag => compareTag.key === tag.key).length > 0
    }

    const onItemSelected = (selectedItem?: ITag): ITag | null => {
        if (!selectedItem || picker.current && listContainsDocument(selectedItem, picker.current.items)) {
            return null
        }
        return selectedItem
    }

    const theme = getTheme();

    const siteTextStyles: ITextStyles = {
        root: {
            color: theme.palette.neutralSecondary,
            fontWeight: FontWeights.semibold,
            fontSize: FontSizes.small
        },
    };
    const helpfulTextStyles: ITextStyles = {
        root: {
            fontWeight: FontWeights.regular,
            fontSize: FontSizes.small
        },
    };
    const iconStyles: IIconStyles = {
        root: {
            color: theme.palette.themePrimary,
            fontSize: 16,
            fontWeight: FontWeights.regular,
        },
    };
    const footerCardSectionStyles: ICardSectionStyles = {
        root: {
            alignSelf: 'stretch',
            borderLeftWidth: 1,
            borderLeftColor: theme.palette.neutralLight,
            borderLeftStyle: 'solid'
        },
    };
    const bodyCardSectionStyles: ICardSectionStyles = {
        root: {
            width: '100%'
        },
    };

    const formLabelStyles: ITextStyles = {
        root: {
            fontSize: FontSizes.small
        }
    }

    const formStackStyles: IStackStyles = {
        root: {
            borderBottomWidth: 1,
            borderBottomColor: theme.palette.neutralLight,
            borderBottomStyle: 'solid',
            paddingBottom: 20,
            marginBottom: 20
        }
    }

    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const searchResultsStackTokens: IStackTokens = {childrenGap: 20}
    const formStackTokens: IStackTokens = {childrenGap: 10}
    const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };

    return (
        <Panel
            isLightDismiss
            isOpen={isOpen}
            closeButtonAriaLabel='Close'
            isHiddenOnDismiss={true}
            headerText='Add Course'
            onDismiss={dismissPanel}
        >
            <Stack tokens={formStackTokens} styles={formStackStyles}>
                <Text styles={formLabelStyles} id='add-course-term-label'>Term</Text>
                <TagPicker
                    inputProps={
                        {
                            'aria-labelledby': 'add-course-term-label'
                        }
                    }
                    removeButtonAriaLabel='Remove'
                    onItemSelected={onItemSelected}
                    onResolveSuggestions={onTermFilterChanged}
                    getTextFromItem={getTextFromItem}
                />
                <Text styles={formLabelStyles} id='add-course-subject-label'>Subject</Text>
                <TagPicker
                    inputProps={
                        {
                            'aria-labelledby': 'add-course-subject-label'
                        }
                    }
                    removeButtonAriaLabel='Remove'
                    onItemSelected={onItemSelected}
                    onResolveSuggestions={onSubjectFilterChanged}
                    getTextFromItem={getTextFromItem}
                />
                <Text styles={formLabelStyles} id='add-course-course-number-label'>Course Number</Text>
                <TagPicker
                    inputProps={
                        {
                            'aria-labelledby': 'add-course-course-number-label'
                        }
                    }
                    removeButtonAriaLabel='Remove'
                    onResolveSuggestions={onCourseNumberFilterChanged}
                    getTextFromItem={getTextFromItem}
                />
                <PrimaryButton text="Search" />
            </Stack>
            <Stack tokens={searchResultsStackTokens}>
                {searchResults.map((result: ICourse, index: number) =>
                    <Card key={index} aria-label="Clickable horizontal card " horizontal onClick={console.log} tokens={cardTokens}>
                        <Card.Section styles={bodyCardSectionStyles}>
                            <Text styles={siteTextStyles}>
                                {`${result.subject} ${result.courseNumber} - ${result.courseTitle}`}
                            </Text>
                            <Stack styles={helpfulTextStyles}>
                                <Text block>
                                    <Icon iconName='Edit' /> {result.courseReferenceNumber}
                                </Text>
                                <Text block>
                                    <Icon iconName='Contact' /> {result.faculty[0]?.displayName || 'Unknown'}
                                </Text>
                                <Text block>
                                    <Icon iconName='ProgressLoopOuter' /> {result.seatsAvailable} / {result.maximumEnrollment}
                                </Text>
                            </Stack>
                        </Card.Section>
                        <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                            <Icon iconName="Add" styles={iconStyles} onClick={console.log} />
                        </Card.Section>
                    </Card>
                )}
            </Stack>
        </Panel>
    )
}

export default AddCourse
