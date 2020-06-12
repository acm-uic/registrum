import React from 'react';
import { Text, Stack, FontWeights, PrimaryButton, Persona, TextField, Checkbox } from '@fluentui/react';
import { IUser } from '../interfaces/IUser';
import { getGravatarImageUrl } from '../helpers/Gravatar'

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export interface ISettingsProps {
  user: IUser
}

export const Settings: React.FunctionComponent<ISettingsProps> = ({ user }: ISettingsProps) => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      gap={15}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Account
      </Text>
      <Stack gap={10}>
        <Persona text={user.firstName} secondaryText={user.email} imageUrl={getGravatarImageUrl(user.gravatarId)} size={32} />
        <TextField name='firstName' label='First Name' type='text' />
        <TextField name='lastName' label='Last Name' type='text' />
        <TextField name='email' label='Email Address' type='email' />
        <Checkbox label='Email Notifications' />
        <Checkbox label='Push Notifications' />
        <PrimaryButton>Update</PrimaryButton>
        <TextField name='password' label='Password' type='password' />
        <TextField name='confirm-password' label='Confirm Password' type='password' />
        <PrimaryButton>Change Password</PrimaryButton>
      </Stack>

    </Stack>
  );
};

export default Settings;
