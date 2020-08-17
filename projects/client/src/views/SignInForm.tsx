import {
  FontWeights,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField
} from '@fluentui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { signInUser } from '../redux/auth/thunk';
import { useDispatch, useSelector } from '../redux/store';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export const SignInForm = (): JSX.Element => {
  const { error } = useSelector(state => state.auth);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(
      signInUser({
        email,
        password
      })
    );
  };

  const validateEmail = (val: string): string | undefined => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(val).toLowerCase()) ? 'Invalid Email Address' : undefined;
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
      <Text variant="xxLarge" styles={boldStyle}>
        Sign In
      </Text>
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: '90%', maxWidth: 300 } }}>
        {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
        <TextField
          name="email"
          label="Email Address"
          type="email"
          value={email}
          onGetErrorMessage={validateEmail}
          onChange={(_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setEmail(newValue || '');
          }}
          validateOnFocusIn
          validateOnFocusOut
          validateOnLoad={false}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setPassword(newValue || '');
          }}
          validateOnFocusIn
          validateOnFocusOut
          validateOnLoad={false}
        />
        <PrimaryButton type="submit" onClick={onClickHandler}>
          Sign In
        </PrimaryButton>
        <Text>
          Don&lsquo;t have an account?{' '}
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            Sign up.
          </Link>
        </Text>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
