import React from 'react';
import { Text, Stack, FontWeights, PrimaryButton, TextField } from '@fluentui/react';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export const SignInForm: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      gap={15}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Sign In
      </Text>
      <Stack gap={10}>
        <TextField name='email' label='Email Address' type='email' />
        <TextField name='password' label='Password' type='password' />
        <PrimaryButton type='submit'>Sign In</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
