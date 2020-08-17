import {
  ContextualMenu,
  ContextualMenuItemType,
  DetailsList,
  DetailsListLayoutMode,
  FontSizes,
  FontWeights,
  getTheme,
  HoverCard,
  IColumn,
  Icon,
  IconButton,
  IContextualMenuItem,
  IObjectWithKey,
  ISelection,
  mergeStyleSets,
  Selection,
  SelectionMode,
  Stack,
  Text
} from '@fluentui/react';
import * as React from 'react';
import { Course, Faculty } from 'registrum-common/dist/lib/Banner';

interface ICourseListProps {
  items: Course[];
  selection: Selection<Course>;
  onAddCourse: () => void;
  onRefresh: () => void;
  onDelete: (courseReferenceNumber: string) => void;
  onDetails: (course: Course) => void;
}

const theme = getTheme();

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
});

export const CourseList: React.FunctionComponent<ICourseListProps> = (props: ICourseListProps) => {
  const selection: Selection<Course> = props.selection;

  const _columns: IColumn[] = [
    {
      key: 'courseReferenceNumber',
      name: 'CRN',
      fieldName: 'courseReferenceNumber',
      minWidth: 60,
      maxWidth: 60,
      isResizable: true,
      onColumnClick: onColumnClick,
      onRender: (item: Course) => (
        <>
          <Stack horizontal horizontalAlign="space-between">
            <HoverCard
              expandedCardOpenDelay={300}
              expandingCardProps={{
                onRenderCompactCard: onRenderCompactCard,
                onRenderExpandedCard: onRenderExpandedCard,
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
                event.persist();
                onShowContextualMenu((event as unknown) as MouseEvent, item);
              }}
            />
          </Stack>
        </>
      ),
      isPadded: true
    },
    {
      key: 'subjectCourse',
      name: 'Course',
      fieldName: 'subjectCourse',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      onColumnClick: onColumnClick,
      onRender: (item: Course) => (
        <Text>
          {item.subject} {item.courseNumber}
        </Text>
      ),
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
      onColumnClick: onColumnClick,
      onRender: (item: Course) => (
        <Text>
          {item.crossList !== null ? item.crossListAvailable : item.seatsAvailable} /{' '}
          {item.crossList !== null ? item.crossListCapacity : item.maximumEnrollment}
        </Text>
      ),
      isPadded: true
    },
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 210,
      maxWidth: 350,
      isResizable: true,
      onColumnClick: onColumnClick,
      onRender: (item: Course) => <Text>{item.courseTitle}</Text>,
      isPadded: true
    }
  ];

  const [items, setItems] = React.useState<Course[]>(props.items);
  const [columns, setColumns] = React.useState<IColumn[]>(_columns);
  const [showContextualMenu, setShowContextualMenu] = React.useState<boolean>(false);
  const [contextMenuTarget, setContextMenuTarget] = React.useState<MouseEvent | undefined>(undefined);
  const [contextMenuItems, setContextMenuItems] = React.useState<IContextualMenuItem[]>([]);

  React.useEffect(() => {
    if (props.items.length !== items.length) setItems(props.items);
  });

  const onRenderCompactCard = (item: Course): JSX.Element => {
    return (
      <div className={classNames.compactCard}>
        <div className={classNames.compactCardCourseNumber}>
          {item.subject} {item.courseNumber}
        </div>
        <div className={classNames.compactCardCourseTitle}>{item.courseTitle}</div>
      </div>
    );
  };

  const onRenderExpandedCard = (item: Course): JSX.Element => {
    return (
      <div className={classNames.expandedCard}>
        <Text block>
          <Icon iconName="Edit" /> {item.courseReferenceNumber}
        </Text>
        {item.faculty
          .map((faculty: Faculty) => faculty.displayName)
          .map((name: string) => (
            <Text block key={name}>
              <Icon iconName="Contact" /> {name}
            </Text>
          ))}
        <Text block>
          <Icon iconName="ProgressLoopOuter" />{' '}
          {item.crossList !== null ? item.crossListAvailable : item.seatsAvailable} /{' '}
          {item.crossList !== null ? item.crossListCapacity : item.maximumEnrollment}
        </Text>
      </div>
    );
  };

  const getContextMenuItems = (item: Course): IContextualMenuItem[] => {
    return [
      {
        key: 'delete',
        text: 'Delete',
        iconProps: {
          iconName: 'Delete'
        },
        onClick: () => props.onDelete(item.courseReferenceNumber)
      },
      {
        key: 'details',
        text: 'Details',
        iconProps: {
          iconName: 'Info'
        },
        onClick: () => props.onDetails(item)
      },
      {
        key: 'divider_1',
        itemType: ContextualMenuItemType.Divider
      },
      {
        key: 'add',
        text: 'Add',
        iconProps: {
          iconName: 'Add'
        },
        onClick: props.onAddCourse
      },
      {
        key: 'refresh',
        text: 'Refresh',
        iconProps: {
          iconName: 'Refresh'
        },
        onClick: props.onRefresh
      }
    ];
  };

  function onHideContextualMenu() {
    setShowContextualMenu(false);
  }

  function onShowContextualMenu(ev: MouseEvent, item: Course) {
    setShowContextualMenu(true);
    setContextMenuTarget(ev);
    setContextMenuItems(getContextMenuItems(item));
  }

  function copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items
      .slice(0)
      .sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }

  function onColumnClick(_: React.MouseEvent<HTMLElement>, column: IColumn): void {
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
    const newItems = copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    setColumns(newColumns);
    setItems(newItems);
  }

  function getKey(item: Course): string {
    return item.courseReferenceNumber;
  }

  function onItemContextMenu(item?: Course, index?: number, ev?: Event) {
    onHideContextualMenu();
    if (ev && item) {
      onShowContextualMenu((ev as unknown) as MouseEvent, item);
    }
  }

  return (
    <>
      <DetailsList
        items={items}
        columns={columns}
        selectionMode={SelectionMode.single}
        getKey={getKey}
        setKey="multiple"
        selection={(selection as unknown) as ISelection<IObjectWithKey>}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        onItemContextMenu={onItemContextMenu}
        compact={false}
        ariaLabelForSelectionColumn="Toggle selection"
        checkButtonAriaLabel="Row checkbox"
      />
      <ContextualMenu
        items={contextMenuItems}
        hidden={!showContextualMenu}
        target={contextMenuTarget}
        onItemClick={onHideContextualMenu}
        onDismiss={onHideContextualMenu}
      />
    </>
  );
};

export default CourseList;
