import React from 'react';
import { TextField, Text, FontWeights, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, MarqueeSelection, initializeIcons } from '@fluentui/react';

initializeIcons()

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

interface ICourseListState {
  columns: IColumn[];
  items: ICourse[];
  isModalSelection: boolean;
  isCompactMode: boolean;
}

interface ICourse {
  courseReferenceNumber: string;
  subject: string;
  courseNumber: string;
  courseTitle: string;
  term: string;
  seatsAvailable: number;
  maximumEnrollment: number;
  enrollment: number;
}

interface ICourseListProps {
  items: ICourse[]
}


export default class CourseList extends React.Component<ICourseListProps, ICourseListState> {
  private _selection: Selection;
  private _allItems: ICourse[];

  constructor(props: ICourseListProps) {
    super(props);

    this._allItems = props.items;

    const columns: IColumn[] = [
      {
        key: 'courseReferenceNumber',
        name: 'CRN',
        fieldName: 'courseReferenceNumber',
        minWidth: 50,
        maxWidth: 60,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'number',
        onRender: (item: ICourse) => {
          return <Text styles={boldStyle}>{item.courseReferenceNumber}</Text>;
        },
        isPadded: true,
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
        onRender: (item: ICourse) => {
          return <Text>{item.subject}</Text>;
        },
        isPadded: true,
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
        onRender: (item: ICourse) => {
          return <Text>{item.courseNumber}</Text>;
        },
        isPadded: true,
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
        onRender: (item: ICourse) => {
          return <Text>{item.seatsAvailable} / {item.maximumEnrollment}</Text>;
        },
        isPadded: true,
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
        onRender: (item: ICourse) => {
          return <Text>{item.courseTitle}</Text>;
        },
        isPadded: true,
      },


    ];

    this._selection = new Selection();

    this.state = {
      items: this._allItems,
      columns: columns,
      isModalSelection: false,
      isCompactMode: false,
    };
  }



  public render() {
    const { columns, isCompactMode, items } = this.state;

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
    );
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
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
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
