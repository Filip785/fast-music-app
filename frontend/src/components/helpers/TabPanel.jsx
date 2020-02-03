import React from 'react';
import { Typography, Box } from '@material-ui/core';

export default function TabPanel(props) {
  const { value, index, children } = props;
  return (
    <Typography component="div" role="tabpanel" id={`simple-tabpanel-${index}`}>
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}