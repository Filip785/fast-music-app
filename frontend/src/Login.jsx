import React from 'react';
import { Paper, Grid, TextField, Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { attemptLogin } from './state/actions/index'; 

const mapStateToProps = state => {
  return { user: state.user };
}

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

  render() {
    const { email, password } = this.state;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <div>
            <Grid container spacing={8} justify="center">
              <h1>Sign In</h1>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="email" label="Email" type="email" fullWidth autoFocus required value={email} onChange={this.handleChangeEmailEv} />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="password" label="Password" type="password" fullWidth required value={password} onChange={this.handleChangePasswordEv} />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmitEv}>Login</Button>
            </Grid>
          </div>
        </Paper>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { attemptLogin }) (ConnectedLogin);