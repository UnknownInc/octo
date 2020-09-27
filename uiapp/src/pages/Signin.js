import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  useHistory
} from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useStores } from '../stores/useStores';
import { CircularProgress, Backdrop, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const SigninPage= observer(()=>{
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const classes = useStyles();
  const history = useHistory();
  const session = useStores().session;

  const handleEmailChange=(e)=>{
    setEmail(e.target.value);
  }
  const handlePasswordChange=(e)=>{
    setPassword(e.target.value);
  }
  const handleSignin=(e)=>{
    e.preventDefault();
    session.login(email, password)
      .then(()=>{
        if (session.isAuthenticated) {
          history.push('/');
        }
      })
  }

  const loginForm = ()=>{
    if (session.isAuthenticated) return null;
    return <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSignin}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link onClick={()=>{history.push("/signup");}} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>;
  };

  const loginOutButton = ()=>{
    if (!session.isAuthenticated) return null;
    return <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Already signed in.
      </Typography>
      <Typography component="h2" variant="h6">
        not {session.user.email}
      </Typography>
      <Box mt={2}>
        <Button variant="contained" color='secondary' onClick={()=>{session.logout();}}>Sign Out</Button>
      </Box>
    </div>;
  };

  return (
    <Container component="main" maxWidth="xs">
      {loginForm()}
      {loginOutButton()}
      <Backdrop className={classes.backdrop} open={session.isBusy}>
        <CircularProgress color="inherit" size={40} />
      </Backdrop>
    </Container>
  );
});

export default SigninPage;