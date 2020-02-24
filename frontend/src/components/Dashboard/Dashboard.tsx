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
import { History } from 'history';
import history from '../../helpers/history';

interface Props {
  location: History<History.PoorMansUnknown>;
  toggleLoadSpinner: () => void;
}

interface State {
  value: number;
}

class ConnectedDashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<{}>, value: number) {
    if(value === 1) {
      this.props.toggleLoadSpinner();
    }
    
    this.setState({ value });
  }

  render() {
    const { value } = this.state;

    return (
      <Container>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} aria-label="simple tabs">
            <Tab label="ALL SONGS" id="simple-tab-0" />
            <Tab label="SORT BY ARTIST NAME" id="simple-tab-1" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AllSongsList history={history} />
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