import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Text, Link, Stack, FontWeights, PrimaryButton, DefaultButton, IStackStyles } from '@fluentui/react';

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
      <Text variant="large">To continue, sign in. If you&lsquo;re a new user, register an account.</Text>
      <Stack horizontal tokens={{ childrenGap: 15 }}>
        <PrimaryButton onClick={() => history.push('/signin')}>Sign In</PrimaryButton>
        <DefaultButton onClick={() => history.push('/signup')}>Sign Up</DefaultButton>
      </Stack>
      <Text variant="large" styles={boldStyle}>
        <Link href="https://github.com/acm-uic/registrum">GitHub</Link>
      </Text>
    </Stack>
  );
});

export default HomePage;
