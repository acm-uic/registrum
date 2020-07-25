import * as React from 'react';
import { Text, Stack, FontWeights, PrimaryButton, TextField, Link } from '@fluentui/react';
import { withRouter } from 'react-router-dom';
import { signInUser } from '../redux/auth/thunk';
import { useDispatch } from '../redux/store';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold }
};

export const SignInForm = withRouter(({ history }) => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const dispatch = useDispatch();

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      signInUser({
        email,
        password
      })
    );
  };

  const validateEmail = (email: string): string | undefined => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase()) ? 'Invalid Email Address' : undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    return undefined;
  };

  const onLinkClick = (event: React.MouseEvent<any>, url: string) => {
    event.preventDefault();
    history.push(url);
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
      <Text variant="xxLarge" styles={boldStyle}>
        Sign In
      </Text>
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: '90%', maxWidth: 300 } }}>
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
          onGetErrorMessage={validatePassword}
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
          Don't have an account? <Link onClick={e => onLinkClick(e, '/signup')}>Sign up.</Link>
        </Text>
      </Stack>
    </Stack>
  );
});

export default SignInForm;
