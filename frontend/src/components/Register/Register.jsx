import React from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Container
} from '@material-ui/core';
import { attemptRegister, toggleLoadSpinner } from '../../state/actions';

const mapStateToProps = state => ({
  errors: state.authReducer.registerErrors
});

class ConnectedRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      username: '',
      email: '',
      password: ''
    };

    this.handleRegisterEv = this.handleRegister.bind(this);
    this.handleChangeNameEv = this.handleChangeName.bind(this);
    this.handleChangeUsernameEv = this.handleChangeUsername.bind(this);
    this.handleChangeEmailEv = this.handleChangeEmail.bind(this);
    this.handleChangePasswordEv = this.handleChangePassword.bind(this);
  }

  handleRegister() {
    const { name, username, email, password } = this.state;

    this.props.toggleLoadSpinner();

    this.props.attemptRegister(name, username, email, password);
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { name, username, email, password } = this.state;
    const { errors } = this.props;

    return (
      <Container maxWidth="sm">
        <Paper className="paperPadding">
          <Grid container spacing={8} justify="center">
            <h1>Sign Up</h1>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="name" label="Name" type="text" error={Boolean(errors.name)} helperText={errors.name} value={name} onChange={this.handleChangeNameEv} fullWidth autoFocus required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="username" label="Username" type="username" error={Boolean(errors.username)} helperText={errors.username} value={username} onChange={this.handleChangeUsernameEv} fullWidth required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="email" label="Email" type="email" error={Boolean(errors.email)} helperText={errors.email} value={email} onChange={this.handleChangeEmailEv} fullWidth required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="password" label="Password" type="password" error={Boolean(errors.password)} helperText={errors.password} value={password} onChange={this.handleChangePasswordEv} fullWidth required />
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: '25px' }}>
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleRegisterEv}>Register</Button>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default connect(mapStateToProps, {
  attemptRegister,
  toggleLoadSpinner
})(ConnectedRegister);