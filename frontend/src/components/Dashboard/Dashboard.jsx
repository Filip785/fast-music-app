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
import { toggleItem, getAllAudioItems, toggleLoadSpinner } from '../../state/actions';
import history from '../../helpers/history';

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
    if(!this.props.location.state) {
      this.props.toggleLoadSpinner();
    } else {
      // clear location state history
      history.replace({ pathname: '/dashboard', state: null });
    }

    this.props.getAllAudioItems(this.props.user.api_token);
  }

  handleChange(_, newValue) {
    this.setState({ value: newValue });
  }

  handleExpand(value) {
    this.props.toggleItem(value);
  }

  render() {
    const { musicItems } = this.props;
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
                    <ListItem style={{display: 'flex', flexDirection: "column"}}>
                      <audio controls style={{ width: '100%' }}>
                        <source src={el.url} />
                        Your browser does not support the audio element.
                      </audio>
                      <div style={{marginTop: '20px'}}>
                        Uploaded by <strong>{el.uploader.name}</strong>
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
  toggleLoadSpinner
}) (ConnectedDashboard);