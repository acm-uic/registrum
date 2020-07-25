import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Text,
  Link,
  Stack,
  FontWeights,
  PrimaryButton,
  DefaultButton,
  IStackStyles,
  getTheme
} from '@fluentui/react';

const theme = getTheme();

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

const stackStyles: IStackStyles = {
  root: {
    paddingTop: 100,
    maxWidth: 500,
    margin: '0 auto'
  }
};

export const HomePage = withRouter(({ history }) => {
  const onLinkClick = (event: React.MouseEvent<any>, url: string) => {
    event.preventDefault();
    history.push(url);
  };

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      tokens={{ childrenGap: 15 }}
      styles={stackStyles}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Welcome to Registrum
      </Text>
      <Text variant="large">To continue, sign in. If you're a new user, register an account.</Text>
      <Stack horizontal tokens={{ childrenGap: 15 }}>
        <PrimaryButton onClick={event => onLinkClick(event, '/signin')}>Sign In</PrimaryButton>
        <DefaultButton onClick={event => onLinkClick(event, '/signup')}>Sign Up</DefaultButton>
      </Stack>
      <Text variant="large" styles={boldStyle}>
        <Link href="https://github.com/acm-uic/registrum">GitHub</Link>
      </Text>
    </Stack>
  );
});

export default HomePage;
