import React, { useEffect } from 'react';
import { Stack, CommandBar, ICommandBarItemProps, Panel, Text, ComboBox, IComboBoxOption, TextField, PrimaryButton } from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';

import CourseList from './CourseList';

export const Courses: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [courses, setCourses] = React.useState([]);

  const openPanel = useConstCallback(() => setIsOpen(true));
  const dismissPanel = useConstCallback(() => setIsOpen(false));

  useEffect(() => {
    fetch('/courses').then(res => res.json()).then(setCourses)
  }, [])


  const INITIAL_OPTIONS: IComboBoxOption[] = [
    { key: 'A', text: 'Option A' },
    { key: 'B', text: 'Option B' },
    { key: 'C', text: 'Option C' },
    { key: 'D', text: 'Option D' },
  ];

  const _items: ICommandBarItemProps[] = [
    {
      key: 'add',
      text: 'Add',
      iconProps: { iconName: 'Add' },
      onClick: openPanel
    },
    {
      key: 'delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      onClick: () => console.log('Delete'),
      disabled: true
    }
  ];

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'tile',
      text: 'Grid view',
      ariaLabel: 'Grid view',
      iconOnly: true,
      iconProps: { iconName: 'Tiles' },
      onClick: () => console.log('Tiles'),
    },
    {
      key: 'info',
      text: 'Info',
      ariaLabel: 'Info',
      iconOnly: true,
      iconProps: { iconName: 'Info' },
      onClick: () => console.log('Info'),
    }
  ];


  return (
    <Stack
      gap={15}
    >
      <CommandBar
        items={_items}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      <Panel
        isLightDismiss
        isOpen={isOpen}
        closeButtonAriaLabel="Close"
        isHiddenOnDismiss={true}
        headerText="Add Course"
        onDismiss={dismissPanel}
      >
        <Text variant={"large"}>Search</Text>
        <Stack gap={15}>
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
      {courses.length > 0 ?
        <CourseList items={courses} />
        : <></>}
    </Stack>
  );
};

export default Courses;