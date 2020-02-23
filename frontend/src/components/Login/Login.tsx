import React from 'react';
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Container,
  Snackbar
} from '@material-ui/core';
import { attemptLogin, attemptLoginFailureEnd } from '../../state/auth/auth.action';
import { toggleLoadSpinner } from '../../state/load/load.actions';

interface Props {
  registered: boolean;
  loginError: boolean;
  attemptLogin: (email: string, password: string) => void;
  attemptLoginFailureEnd: () => void;
  toggleLoadSpinner: () => void;
}

interface State {
  email: string;
  password: string;
}

const mapStateToProps = (state: any) => ({
  registered: state.authReducer.registered,
  loginError: state.authReducer.loginError,
});

class ConnectedLogin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSubmit() {
    const { email, password } = this.state;

    this.props.toggleLoadSpinner();

    this.props.attemptLogin(email, password);
  }

  handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  handleClose() {
    this.props.attemptLoginFailureEnd();
  }

  render() {
    const { email, password } = this.state;
    const { registered, loginError } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <Grid container spacing={8} justify="center">
            <h1>Sign In</h1>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="email" label="Email" type="email" error={loginError} fullWidth autoFocus required value={email} onChange={this.handleChangeEmail} />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="password" label="Password" type="password" error={loginError} fullWidth required value={password} onChange={this.handleChangePassword} />
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: '25px' }}>
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmit}>Login</Button>
          </Grid>

          {registered && <Alert severity="success" style={{ marginTop: '30px' }}>Successfully registered! Now you can login</Alert>}
          <Snackbar open={loginError} autoHideDuration={3500} onClose={this.handleClose}>
            <Alert severity="error">
              Error while trying to log you in. Please try again (check your credentials).
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    );
  }
}

export default connect(mapStateToProps, {
  attemptLogin,
  attemptLoginFailureEnd,
  toggleLoadSpinner
})(ConnectedLogin);