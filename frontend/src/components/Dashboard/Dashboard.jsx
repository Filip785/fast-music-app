import React from 'react';
import { connect } from 'react-redux';
import TabPanel from '../helpers/TabPanel';
import { ExpandLess, ExpandMore, ThumbUp } from '@material-ui/icons';
import {
  Container,
  Button,
  AppBar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@material-ui/core';
import { toggleItem, getAllAudioItems, toggleLoadSpinner, cleanupDashboardPage } from '../../state/actions';
import history from '../../helpers/history';
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

    this.handleLikeEv = this.handleLike.bind(this);
    this.handleExpandEv = this.handleExpand.bind(this);
    this.handleChangeEv = this.handleChange.bind(this);
  }

  componentDidMount() {
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
    this.setState({ value: newValue });
  }

  handleExpand(value) {
    this.props.toggleItem(value);
  }

  handleLike() {
    alert('liking!');
  }

  render() {
    const { musicItems, user } = this.props;
    const { value } = this.state;

    return (
      <Container>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChangeEv} aria-label="simple tabs">
            <Tab label="SORT BY SONG NAME" id="simple-tab-0" />
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
                      <Button
                        variant="contained"
                        component="span"
                        size="large"
                        color="primary"
                        style={{marginBottom: '20px'}}
                        onClick={this.handleLikeEv}
                      >
                        <ThumbUp />
                        <span style={{ paddingLeft: '10px' }}>Like this song</span>
                      </Button>
                      <audio controls style={{ width: '100%' }}>
                        <source src={el.url} />
                        Your browser does not support the audio element.
                      </audio>
                      <div style={{ marginTop: '20px' }}>
                        {(el.uploader.id === user.id) && <div style={{ textAlign: 'center' }}><Link to={`/edit-audio-item/${el.id}`}>Edit item</Link></div>}Uploaded by <strong>{el.uploader.name}</strong>
                      </div>
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Sort by artist name
        </TabPanel>
      </Container>
    );
  }
}

export default connect(mapStateToProps, {
  toggleItem,
  getAllAudioItems,
  toggleLoadSpinner,
  cleanupDashboardPage
})(ConnectedDashboard);