import React from 'react';
import { connect } from 'react-redux';
import TabPanel from '../helpers/TabPanel';
import {
  Container,
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core';
import SortByArtist from './SortByArtist/SortByArtist';
import AllSongsList from './AllSongsList/AllSongsList';
import { toggleLoadSpinner } from '../../state/load/load.actions';

class ConnectedDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleChangeEv = this.handleChange.bind(this);
  }

  handleChange(_, newValue) {
    if(newValue === 1) {
      this.props.toggleLoadSpinner();
    }
    
    this.setState({ value: newValue });
  }

  render() {
    const { value } = this.state;

    return (
      <Container>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChangeEv} aria-label="simple tabs">
            <Tab label="ALL SONGS" id="simple-tab-0" />
            <Tab label="SORT BY ARTIST NAME" id="simple-tab-1" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AllSongsList location={this.props.location} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SortByArtist />
        </TabPanel>
      </Container>
    );
  }
}

export default connect(null, {
  toggleLoadSpinner,
})(ConnectedDashboard);