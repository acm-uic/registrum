import * as React from 'react'
import {
    TextField,
    Text,
    FontWeights,
    DetailsList,
    HoverCard,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
    MarqueeSelection,
    Icon,
    initializeIcons,
    mergeStyleSets,
    FontSizes,
    getTheme
} from '@fluentui/react'
import { Course, Faculty } from 'registrum-common/dist/lib/Banner'

initializeIcons()

interface ICourseListState {
    columns: IColumn[]
    items: Course[]
    isModalSelection: boolean
    isCompactMode: boolean
}

interface ICourseListProps {
    items: Course[]
}

const theme = getTheme()

const classNames = mergeStyleSets({
    compactCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: '100%'
    },
    expandedCard: {
        padding: '16px 24px'
    },
    item: {
        selectors: {
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer'
            }
        }
    },
    expandingCardRow: {},
    icon: {},
    compactCardCrn: {},
    compactCardSubject: {},
    compactCardCourseTitle: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.medium
    },
    compactCardCourseNumber: {
        fontSize: FontSizes.xxLarge,
        fontWeight: FontWeights.bold,
        color: theme.palette.themePrimary,
        width: '100%',
        textAlign: 'center'
    }
})

export class CourseList extends React.Component<ICourseListProps, ICourseListState> {
    private _selection: Selection
    private _allItems: Course[]

    constructor(props: ICourseListProps) {
        super(props)

        this._allItems = props.items

        this._selection = new Selection()

        this.state = {
            items: this._allItems,
            columns: this._columns,
            isModalSelection: false,
            isCompactMode: false
        }
    }

    componentWillReceiveProps(nextProps: ICourseListProps): void {
        this.setState({ items: nextProps.items })
    }

    public render() {
        const { columns, isCompactMode, items } = this.state

        return (
            <>
                <MarqueeSelection selection={this._selection}>
                    <DetailsList
                        items={items}
                        compact={isCompactMode}
                        columns={columns}
                        selectionMode={SelectionMode.multiple}
                        getKey={this._getKey}
                        setKey="multiple"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selection={this._selection}
                        selectionPreservedOnEmptyClick={true}
                        onItemInvoked={this._onItemInvoked}
                        enterModalSelectionOnTouch={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="Row checkbox"
                    />
                </MarqueeSelection>
            </>
        )
    }

    private _onRenderCompactCard(item: Course): JSX.Element {
        return (
            <div className={classNames.compactCard}>
                <div className={classNames.compactCardCourseNumber}>
                    {item.subject} {item.courseNumber}
                </div>
                <div className={classNames.compactCardCourseTitle}>{item.courseTitle}</div>
            </div>
        )
    }

    private _onRenderExpandedCard(item: Course): JSX.Element {
        return (
            <div className={classNames.expandedCard}>
                <Text block>
                    <Icon iconName="Edit" /> {item.courseReferenceNumber}
                </Text>
                <Text block>
                    <Icon iconName="Contact" /> {item.faculty[0]?.displayName || 'Unknown'}
                </Text>
                <Text block>
                    <Icon iconName="ProgressLoopOuter" /> {item.seatsAvailable} /{' '}
                    {item.maximumEnrollment}
                </Text>
            </div>
        )
    }

    private _columns: IColumn[] = [
        {
            key: 'courseReferenceNumber',
            name: 'CRN',
            fieldName: 'courseReferenceNumber',
            minWidth: 50,
            maxWidth: 60,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            data: 'number',
            onRender: (item: Course) => {
                return (
                    <HoverCard
                        expandedCardOpenDelay={300}
                        expandingCardProps={{
                            onRenderCompactCard: this._onRenderCompactCard,
                            onRenderExpandedCard: this._onRenderExpandedCard,
                            renderData: item,
                            compactCardHeight: 120,
                            expandedCardHeight: 200
                        }}
                        instantOpenOnClick={true}
                    >
                        <Text styles={{ root: { fontWeight: FontWeights.bold } }}>
                            {item.courseReferenceNumber}
                        </Text>
                    </HoverCard>
                )
            },
            isPadded: true
        },
        {
            key: 'subject',
            name: 'Subject',
            fieldName: 'subject',
            minWidth: 50,
            maxWidth: 60,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            data: 'string',
            onRender: (item: Course) => {
                return <Text>{item.subject}</Text>
            },
            isPadded: true
        },
        {
            key: 'courseNumber',
            name: 'Number',
            fieldName: 'courseNumber',
            minWidth: 40,
            maxWidth: 50,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            data: 'number',
            onRender: (item: Course) => {
                return <Text>{item.courseNumber}</Text>
            },
            isPadded: true
        },
        {
            key: 'seatsAvailable',
            name: 'Availability',
            fieldName: 'seatsAvailable',
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            onColumnClick: this._onColumnClick,
            data: 'number',
            onRender: (item: Course) => {
                return (
                    <Text>
                        {item.seatsAvailable} / {item.maximumEnrollment}
                    </Text>
                )
            },
            isPadded: true
        },
        {
            key: 'name',
            name: 'Name',
            fieldName: 'name',
            minWidth: 210,
            maxWidth: 350,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            data: 'string',
            onRender: (item: Course) => {
                return <Text>{item.courseTitle}</Text>
            },
            isPadded: true
        }
    ]

    private _getKey(item: any, index?: number): string {
        return item.key
    }

    private _onItemInvoked(item: any): void {
        alert(`Item invoked: ${item.name}`)
    }

    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn): void {
        const { columns, items } = this.state
        const newColumns: IColumn[] = columns.slice()
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0]
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending
                currColumn.isSorted = true
            } else {
                newCol.isSorted = false
                newCol.isSortedDescending = true
            }
        })
        const newItems = CourseList._copyAndSort<Course>(
            items,
            currColumn.fieldName!,
            currColumn.isSortedDescending
        )
        this.setState({
            columns: newColumns,
            items: newItems
        })
    }

    private static _copyAndSort<T>(
        items: T[],
        columnKey: string,
        isSortedDescending?: boolean
    ): T[] {
        const key = columnKey as keyof T
        return items
            .slice(0)
            .sort((a: T, b: T) =>
                (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
            )
    }
}

export default CourseList
