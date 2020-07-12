import * as React from 'react'
import {
    Text,
    FontWeights,
    DetailsList,
    HoverCard,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
    Stack,
    Icon,
    initializeIcons,
    mergeStyleSets,
    FontSizes,
    IButton,
    getTheme,
    IDetailsList,
    IconButton,
    ContextualMenu, ContextualMenuItemType, IContextualMenuItem
} from '@fluentui/react'
import { Course, Faculty } from 'registrum-common/dist/lib/Banner'

initializeIcons()

interface ICourseListState {
    columns: IColumn[]
    items: Course[]
    showContextualMenu: boolean
    contextMenuTarget: MouseEvent | undefined,
    contextMenuItems: IContextualMenuItem[]
}

interface ICourseListProps {
    items: Course[]
    selection: Selection
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

    constructor(props: ICourseListProps) {
        super(props)

        this._selection = new Selection()

        this.state = {
            items: props.items,
            columns: this._columns,
            showContextualMenu: false,
            contextMenuTarget: undefined,
            contextMenuItems: []
        }
    }

    public componentDidUpdate(prevProps: ICourseListProps) {
        if (this.props.items !== prevProps.items) {
            this.setState({ items: this.props.items })
        }
    }

    public render() {
        const { columns, items, showContextualMenu, contextMenuTarget, contextMenuItems } = this.state

        return (
            <>
                <ContextualMenu
                    items={contextMenuItems}
                    hidden={!showContextualMenu}
                    target={contextMenuTarget}
                    onItemClick={this._onHideContextualMenu}
                    onDismiss={this._onHideContextualMenu}
                />
                <DetailsList
                    items={items}
                    columns={columns}
                    selectionMode={SelectionMode.single}
                    getKey={this._getKey}
                    setKey="none"
                    selection={this._selection}
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    onItemContextMenu={this._onItemContextMenu}
                    compact={false}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="Row checkbox"
                />
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

    private _getContextMenuItems = (item: Course): IContextualMenuItem[] => {
        return [
            {
                key: 'delete',
                text: 'Delete',
                iconProps: {
                    iconName: 'Delete'
                },
                onClick: () => console.log('Delete clicked', item),
            },
            {
                key: 'details',
                text: 'Details',
                iconProps: {
                    iconName: 'Info'
                },
                onClick: () => console.log('Details clicked', item),
            },
            {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider,
            },
            {
                key: 'add',
                text: 'Add',
                iconProps: {
                    iconName: 'Add'
                },
                onClick: () => console.log('Add clicked', item),
            },
            {
                key: 'refresh',
                text: 'Refresh',
                iconProps: {
                    iconName: 'Refresh'
                },
                onClick: () => console.log('Refresh clicked', item),
            },
        ]

    }

    private _onHideContextualMenu = () => this.setState({ showContextualMenu: false });
    private _onShowContextualMenu = (ev: MouseEvent, item: Course) => {
        this.setState({
            showContextualMenu: true,
            contextMenuTarget: ev,
            contextMenuItems: this._getContextMenuItems(item)
        });
    }

    private static _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
        const key = columnKey as keyof T;
        return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }

    private _onColumnClick = (_: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, items } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = CourseList._copyAndSort<Course>(items, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: newItems,
        });
    };

    private _columns: IColumn[] = [
        {
            key: 'courseReferenceNumber',
            name: 'CRN',
            fieldName: 'courseReferenceNumber',
            minWidth: 60,
            maxWidth: 60,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            onRender: (item: Course) => {
                return (
                    <>
                        <Stack horizontal horizontalAlign='space-between'>
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
                                <Text styles={{ root: { fontWeight: FontWeights.bold } }}>{item.courseReferenceNumber}</Text>
                            </HoverCard>
                            <IconButton
                                iconProps={{ iconName: 'MoreVertical' }}
                                styles={{ root: { height: '100%', marginTop: 2 } }}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                    event.persist()
                                    this._onShowContextualMenu(event as unknown as MouseEvent, item)
                                }}
                            />
                        </Stack>
                    </>
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
            onRender: (item: Course) => {
                return <Text>{item.courseTitle}</Text>
            },
            isPadded: true
        }
    ]

    private _getKey(item: any): string {
        return item.key
    }

    private _onItemContextMenu = (item?: Course, index?: number, ev?: Event) => {
        this._onHideContextualMenu()
        if (ev && item) {
            this._onShowContextualMenu(ev as unknown as MouseEvent, item)
        }
    }


}

export default CourseList
