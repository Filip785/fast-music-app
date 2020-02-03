import React from 'react';
import { Paper, Grid, TextField, Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { attemptRegister } from './state/actions/index'; 

class ConnectedRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: ''
    };

    this.handleRegisterEv = this.handleRegister.bind(this);
    this.handleChangeNameEv = this.handleChangeName.bind(this);
    this.handleChangeEmailEv = this.handleChangeEmail.bind(this);
    this.handleChangePasswordEv = this.handleChangePassword.bind(this);
  }

  handleRegister() {
    const { name, email, password } = this.state;

    this.props.attemptRegister(name, email, password);
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { name, email, password } = this.state;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <div>
            <Grid container spacing={8} justify="center">
              <h1>Sign Up</h1>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="name" label="Name" type="text" value={name} onChange={this.handleChangeNameEv} fullWidth autoFocus required />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="email" label="Email" type="email" value={email} onChange={this.handleChangeEmailEv} fullWidth required />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField id="password" label="Password" type="password" value={password} onChange={this.handleChangePasswordEv} fullWidth required />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '25px' }}>
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleRegisterEv}>Register</Button>
            </Grid>
          </div>
        </Paper>
      </Container>
    );
  }
}

export default connect(null, { attemptRegister }) (ConnectedRegister);