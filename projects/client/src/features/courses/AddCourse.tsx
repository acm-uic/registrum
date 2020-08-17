import {
  FontSizes,
  FontWeights,
  getTheme,
  IBasePicker,
  Icon,
  IIconStyles,
  IStackStyles,
  IStackTokens,
  ITag,
  ITextStyles,
  Panel,
  Stack,
  TagPicker,
  Text
} from '@fluentui/react';
import { Card, ICardSectionStyles, ICardSectionTokens, ICardTokens } from '@uifabric/react-cards';
import * as React from 'react';
import { Course, Faculty } from 'registrum-common/dist/lib/Banner';
import { courseSubscribe } from '../../redux/auth/thunk';
import { getCourseNumbers, getCourses } from '../../redux/banner/thunk';
import { useDispatch, useSelector } from '../../redux/store';

export interface IAddCourse {
  isOpen: boolean;
  dismissPanel: () => void;
}

export const AddCourse: React.FunctionComponent<IAddCourse> = ({ isOpen, dismissPanel }: IAddCourse) => {
  const { terms, subjects, courseNumbers, courses } = useSelector(state => state.banner);
  const [selectedTerms, setSelectedTerms] = React.useState<ITag[]>([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState<ITag[]>([]);
  const dispatch = useDispatch();

  const handleChangeSubjects = (items?: ITag[]) => {
    if (items) {
      setSelectedSubjects(items);

      selectedTerms.forEach(({ key: term }) => {
        items.forEach(({ key: subject }) => {
          dispatch(getCourseNumbers({ term: Number(term), subject: subject.toString() }));
        });
      });
    }
  };

  const handleChangeCourseNumbers = (items?: ITag[]) => {
    if (items && items.length) {
      items.forEach(({ key }) => {
        const [term, subject, courseNumber] = (key as string).split(' ');

        dispatch(getCourses({ term: Number(term), subject, courseNumber: Number(courseNumber) }));
      });
    }
  };

  const termTags: ITag[] = terms.map(({ code, description }) => ({
    key: code,
    name: description
  }));
  const subjectTags: ITag[] = subjects.map(({ code, description }) => ({
    key: code,
    name: description
  }));
  const courseNumberTags: ITag[] = courseNumbers
    .filter(({ term, subject }) => {
      return (
        selectedTerms.filter(({ key }) => term === key).length > 0 &&
        selectedSubjects.filter(({ key }) => subject === key).length > 0
      );
    })
    .map(cn => ({
      key: cn.term + ' ' + cn.subject + ' ' + cn.number,
      name: cn.subject + ' ' + cn.number.toString()
    }));

  const getTextFromItem = (item: ITag): string => item.name;

  const _onFilterChanged = (optionsList: ITag[], filter: string, selectedItems?: ITag[]) => {
    return filter
      ? optionsList
          .filter(tag => tag.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
          .filter(tag => !listContainsDocument(tag, selectedItems))
      : [];
  };

  const onTermFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
    return _onFilterChanged(termTags, filter, selectedItems);
  };

  const onSubjectFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
    return _onFilterChanged(subjectTags, filter, selectedItems);
  };

  const onCourseNumberFilterChanged = (filter: string, selectedItems?: ITag[]): ITag[] => {
    return _onFilterChanged(courseNumberTags, filter, selectedItems);
  };

  const picker = React.createRef<IBasePicker<ITag>>();

  const listContainsDocument = (tag: ITag, selectedItems?: ITag[]) => {
    if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
      return false;
    }
    return selectedItems.filter(compareTag => compareTag.key === tag.key).length > 0;
  };

  const onItemSelected = (selectedItem?: ITag): ITag | null => {
    if (!selectedItem || (picker.current && listContainsDocument(selectedItem, picker.current.items))) {
      return null;
    }
    return selectedItem;
  };

  const theme = getTheme();

  const siteTextStyles: ITextStyles = {
    root: {
      color: theme.palette.neutralSecondary,
      fontWeight: FontWeights.semibold,
      fontSize: FontSizes.small
    }
  };
  const helpfulTextStyles: ITextStyles = {
    root: {
      fontWeight: FontWeights.regular,
      fontSize: FontSizes.small
    }
  };
  const iconStyles: IIconStyles = {
    root: {
      color: theme.palette.themePrimary,
      fontSize: 16,
      fontWeight: FontWeights.regular
    }
  };
  const footerCardSectionStyles: ICardSectionStyles = {
    root: {
      alignSelf: 'stretch',
      borderLeftWidth: 1,
      borderLeftColor: theme.palette.neutralLight,
      borderLeftStyle: 'solid'
    }
  };
  const bodyCardSectionStyles: ICardSectionStyles = {
    root: {
      width: '100%'
    }
  };

  const formLabelStyles: ITextStyles = {
    root: {
      fontSize: FontSizes.small
    }
  };

  const formStackStyles: IStackStyles = {
    root: {
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.neutralLight,
      borderBottomStyle: 'solid',
      paddingBottom: 20,
      marginBottom: 20
    }
  };

  const cardTokens: ICardTokens = { childrenMargin: 12 };
  const searchResultsStackTokens: IStackTokens = { childrenGap: 20 };
  const formStackTokens: IStackTokens = { childrenGap: 10 };
  const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };

  return (
    <Panel
      isLightDismiss
      isOpen={isOpen}
      closeButtonAriaLabel="Close"
      isHiddenOnDismiss={true}
      headerText="Add Course"
      onDismiss={dismissPanel}
    >
      <Stack tokens={formStackTokens} styles={formStackStyles}>
        <Text styles={formLabelStyles} id="add-course-term-label">
          Term
        </Text>
        <TagPicker
          inputProps={{
            'aria-labelledby': 'add-course-term-label'
          }}
          itemLimit={1}
          removeButtonAriaLabel="Remove"
          onItemSelected={onItemSelected}
          onResolveSuggestions={onTermFilterChanged}
          getTextFromItem={getTextFromItem}
          onChange={items => items && setSelectedTerms(items)}
        />
        <Text styles={formLabelStyles} id="add-course-subject-label">
          Subject
        </Text>
        <TagPicker
          inputProps={{
            'aria-labelledby': 'add-course-subject-label'
          }}
          removeButtonAriaLabel="Remove"
          onItemSelected={onItemSelected}
          onResolveSuggestions={onSubjectFilterChanged}
          getTextFromItem={getTextFromItem}
          onChange={handleChangeSubjects}
        />
        <Text styles={formLabelStyles} id="add-course-course-number-label">
          Course Number
        </Text>
        <TagPicker
          inputProps={{
            'aria-labelledby': 'add-course-course-number-label'
          }}
          removeButtonAriaLabel="Remove"
          onResolveSuggestions={onCourseNumberFilterChanged}
          getTextFromItem={getTextFromItem}
          onChange={handleChangeCourseNumbers}
        />
      </Stack>
      <Stack tokens={searchResultsStackTokens}>
        {courses.map((result: Course, index: number) => (
          <Card
            key={index}
            aria-label="Clickable horizontal card "
            horizontal
            onClick={console.log}
            tokens={cardTokens}
          >
            <Card.Section styles={bodyCardSectionStyles}>
              <Text styles={siteTextStyles}>
                {`${result.subject} ${result.courseNumber} - ${result.courseTitle}`}
              </Text>
              <Stack styles={helpfulTextStyles}>
                <Text block>
                  <Icon iconName="Edit" /> {result.courseReferenceNumber}
                </Text>
                {result.faculty
                  .map((faculty: Faculty) => faculty.displayName)
                  .map((name: string) => (
                    <Text block key={name}>
                      <Icon iconName="Contact" /> {name}
                    </Text>
                  ))}
                <Text block>
                  <Icon iconName="ProgressLoopOuter" />{' '}
                  {result.crossList !== null ? result.crossListAvailable : result.seatsAvailable} /{' '}
                  {result.crossList !== null ? result.crossListCapacity : result.maximumEnrollment}
                </Text>
              </Stack>
            </Card.Section>
            <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
              <Icon
                iconName="Add"
                styles={iconStyles}
                onClick={() => {
                  dispatch(courseSubscribe({ crn: result.courseReferenceNumber }));
                }}
              />
            </Card.Section>
          </Card>
        ))}
      </Stack>
    </Panel>
  );
};

export default AddCourse;
