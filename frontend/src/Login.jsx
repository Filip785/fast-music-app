import React from 'react';
import { Paper, Grid, TextField, Button, Container } from '@material-ui/core';

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Paper className="paperPadding">
        <div>
          <Grid container spacing={8} justify="center">
            <h1>Sign In</h1>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="email" label="Email" type="email" fullWidth autoFocus required />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <TextField id="password" label="Password" type="password" fullWidth required />
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: '25px' }}>
            <Button variant="outlined" color="primary" style={{ textTransform: "none" }}>Login</Button>
          </Grid>
        </div>
      </Paper>
    </Container>
  );
}