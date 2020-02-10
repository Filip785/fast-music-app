import React from 'react';
import { connect } from 'react-redux';
import TabPanel from '../helpers/TabPanel';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import {
  Container,
  AppBar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@material-ui/core';
import { toggleItem, getAllAudioItems, toggleLoadSpinner, cleanupDashboardPage, doLike } from '../../state/actions';
import history from '../../helpers/history';
import SortByArtist from './SortByArtist/SortByArtist';
import LikeItem from './LikeItem/LikeItem';
import EditDelete from './EditDelete/EditDelete';
import { Link } from 'react-router-dom';

const mapStateToProps = state => ({
  musicItems: state.audioReducer.musicItems,
  user: state.authReducer.user.authUser
});

class ConnectedDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.handleExpandEv = this.handleExpand.bind(this);
    this.handleChangeEv = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData() {
    if (!this.props.location.state) {
      this.props.toggleLoadSpinner();
    } else {
      // clear location state history
      history.replace({ pathname: '/dashboard', state: null });
    }

    this.props.getAllAudioItems(this.props.user.id, this.props.user.api_token);
  }

  componentWillUnmount() {
    this.props.cleanupDashboardPage();
  }

  handleChange(_, newValue) {
    if(newValue === 1) {
      this.props.toggleLoadSpinner();
    } else {
      this.loadInitialData();
    }
    this.setState({ value: newValue });
  }

  handleExpand(value) {
    this.props.toggleItem(value);
  }

  render() {
    const { musicItems, user } = this.props;
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
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {musicItems.map((el) => (
              <div key={el.id}>
                <ListItem button onClick={() => this.handleExpandEv(el.id)}>
                  <ListItemText primary={`${el.artistName} - ${el.songTitle}`} />
                  {el.toggle ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={el.toggle} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <LikeItem numLikes={el.likes} userApiToken={user.api_token} audioItemId={el.id} userId={user.id} uploaderId={el.uploader.id} isLikedByUser={el.isLikedByUser} />

                      <audio controls style={{ width: '100%' }}>
                        <source src={el.url} />
                        Your browser does not support the audio element.
                      </audio>
                      <div style={{ marginTop: '20px' }}>
                        {(el.uploader.id === user.id) && <EditDelete audioId={el.id} userId={user.id} userApiToken={user.api_token} />}
                        Uploaded by <Link to={`/profile/${el.uploader.id}`}><strong>{el.uploader.name}</strong></Link>
                      </div>
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SortByArtist />
        </TabPanel>
      </Container>
    );
  }
}

export default connect(mapStateToProps, {
  toggleItem,
  getAllAudioItems,
  toggleLoadSpinner,
  cleanupDashboardPage,
  doLike
})(ConnectedDashboard);