import { ethers } from 'ethers';
import { FunctionFragment } from 'ethers/utils';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import AddressRenderer from './AddressRenderer';

const styles = (theme: Theme) =>
  createStyles({
    topListItem: {
      margin: 0,
      padding: 0,
    }
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  abi: FunctionFragment;
  inputs: Array<any>;
}

class FunctionCallRenderer extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let {abi, inputs, provider, classes} = this.props;

    return (
      <List dense={true} disablePadding={true}>
        <ListItem className={classes.topListItem}>
          <ListItemText primary={abi.name + "("} />
        </ListItem>
        <ListItem className={classes.topListItem}>
          <List dense={true} disablePadding={true}>
            {inputs.map((arg:any, idx:number) => {
              const param = (abi).inputs[idx];
              switch(param.type) {
              case 'address':
                return (<ListItem key={idx}>
                  <ListItemText primary={<AddressRenderer provider={provider} value={arg} />} />
                </ListItem>);
              default:
                return (<ListItem key={idx}>
                  <ListItemText primary={arg.toString()} />
                </ListItem>);
              }
            })}
          </List>
        </ListItem>
        <ListItem className={classes.topListItem}>
          <ListItemText primary=")" />
        </ListItem>
      </List>
    );
  }
};

export default withStyles(styles)(FunctionCallRenderer);
