import React from 'react';
import { connect } from 'react-redux';
import { Container, AppBar, Tabs, Tab, List, ListItem, ListItemText } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import TabPanel from '../helpers/TabPanel';
import { toggleItem } from '../../state/actions/index';

const mapStateToProps = state => ({
  musicItems: state.audio.musicItems
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
            {musicItems.map((el, index) => (
              <div key={index}>
                <ListItem button onClick={() => this.handleExpandEv(index)}>
                  <ListItemText primary={`${el.artist} - ${el.title}`} />
                  {el.toggle ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={el.toggle} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem>
                      <audio controls>
                        <source src={el.url} />
                        Your browser does not support the audio element.
                    </audio>
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

export default connect(mapStateToProps, { toggleItem })(ConnectedDashboard);