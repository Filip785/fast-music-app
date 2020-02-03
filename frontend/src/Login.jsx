import React from 'react';
import { Paper, Grid, TextField, Button, Container, Snackbar } from '@material-ui/core';
import { connect } from 'react-redux';
import { attemptLogin, attemptLoginFailureEnd } from './state/actions/index'; 
import Alert from '@material-ui/lab/Alert';

const mapStateToProps = state => ({
  registered: state.registered,
  loginError: state.loginError,
});

class ConnectedLogin extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: ''
    };

    this.handleSubmitEv = this.handleSubmit.bind(this);
    this.handleChangeEmailEv = this.handleChangeEmail.bind(this);
    this.handleChangePasswordEv = this.handleChangePassword.bind(this);
    this.handleCloseEv = this.handleClose.bind(this);
  }

  handleSubmit() {
    const { email, password } = this.state; 

    this.props.attemptLogin(email, password);
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleClose() {
    console.log('FIRED');
    this.props.attemptLoginFailureEnd();
  }

  render() {
    const { email, password } = this.state;
    const { registered, loginError } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <div>
            <Grid container spacing={8} justify="center">
              <h1>Sign In</h1>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="email" label="Email" type="email" error={loginError} fullWidth autoFocus required value={email} onChange={this.handleChangeEmailEv} />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="password" label="Password" type="password" error={loginError} fullWidth required value={password} onChange={this.handleChangePasswordEv} />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmitEv}>Login</Button>
            </Grid>
          </div>

          {registered && <Alert severity="success" style={{marginTop: '30px'}}>Successfully registered! Now you can login</Alert>}
          <Snackbar open={loginError} autoHideDuration={3500} onClose={this.handleCloseEv}>
            <Alert severity="error">
              Error while trying to log you in. Please try again (check your credentials).
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { attemptLogin, attemptLoginFailureEnd }) (ConnectedLogin);