import React from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Container
} from '@material-ui/core';
import { attemptRegister } from '../../state/auth/auth.action';
import { toggleLoadSpinner } from '../../state/load/load.actions';
import { RegisterErrors } from '../../state/auth/auth.types';

interface Props {
  errors: RegisterErrors;
  attemptRegister: (name: string, username: string, email: string, password: string) => void;
  toggleLoadSpinner: () => void;
}

interface State {
  name: string;
  username: string;
  email: string;
  password: string;
}

const mapStateToProps = (state: any) => ({
  errors: state.authReducer.registerErrors
});

class ConnectedRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      username: '',
      email: '',
      password: ''
    };

    this.handleRegister = this.handleRegister.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleRegister() {
    const { name, username, email, password } = this.state;

    this.props.toggleLoadSpinner();

    this.props.attemptRegister(name, username, email, password);
  }

  handleChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
  }

  handleChangeUsername(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
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
              <TextField id="name" label="Name" type="text" error={Boolean(errors.name)} helperText={errors.name} value={name} onChange={this.handleChangeName} fullWidth autoFocus required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="username" label="Username" type="username" error={Boolean(errors.username)} helperText={errors.username} value={username} onChange={this.handleChangeUsername} fullWidth required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="email" label="Email" type="email" error={Boolean(errors.email)} helperText={errors.email} value={email} onChange={this.handleChangeEmail} fullWidth required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="password" label="Password" type="password" error={Boolean(errors.password)} helperText={errors.password} value={password} onChange={this.handleChangePassword} fullWidth required />
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: '25px' }}>
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleRegister}>Register</Button>
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