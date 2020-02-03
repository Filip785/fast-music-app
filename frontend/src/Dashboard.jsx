import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  user: state.user.authUser
});

class ConnectedDashboard extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <h1>Welcome {user.name}!</h1>
    );
  }
}

export default connect(mapStateToProps) (ConnectedDashboard);