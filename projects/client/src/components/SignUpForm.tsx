import React from 'react';
import { Text, Stack, FontWeights, PrimaryButton, TextField } from '@fluentui/react';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export const SignUpForm: React.FunctionComponent = () => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      gap={15}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Sign Up
      </Text>
      <Stack gap={10}>
      <TextField name='name' label='Name' type='text' />
        <TextField name='email' label='Email Address' type='email' />
        <TextField name='password' label='Password' type='password' />
        <TextField name='confirm-password' label='Confirm Password' type='password' />
        <PrimaryButton type='submit'>Sign Up</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default SignUpForm;
