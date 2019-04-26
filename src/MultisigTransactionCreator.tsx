import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils/abi-coder';
import { abi as multisigABI } from '@metamultisig/contract/build/contracts/MetaMultisig.json';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import MultisigWatcher from './MultisigWatcher';
import FunctionABIEntry from './FunctionABIEntry';

const styles = (theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing.unit,
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    }
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.JsonRpcProvider;
  contract: ethers.Contract;
}

interface State {
  showTxTypeDialog: boolean;
  showAddKeyholderDialog: boolean;
  showSetThresholdDialog: boolean;
}

class MultisigTransactionCreator extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showTxTypeDialog: false,
      showAddKeyholderDialog: false,
      showSetThresholdDialog: false,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onNewTxClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: true,
    });
  }

  onNewTxClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: false,
    });
  }

  onAddKeyholderClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: false,
      showAddKeyholderDialog: true,
    });
  }

  onAddKeyholderClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showAddKeyholderDialog: false,
    });
  }

  onSetThresholdClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: false,
      showSetThresholdDialog: true,
    });
  }

  onSetThresholdClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showSetThresholdDialog: false,
    });
  }

  render() {
    const { classes, contract } = this.props;
    return (
      <>
        <Dialog open={this.state.showTxTypeDialog} onClose={this.onNewTxClose} aria-labelledby="txtype-title">
          <DialogTitle id="txtype-title">Select Transaction Type</DialogTitle>
          <div>
            <List>
              <ListItem button onClick={this.onAddKeyholderClick} key="addKeyholder">
                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                <ListItemText primary="Add Keyholder" />
              </ListItem>
              <ListItem button onClick={this.onSetThresholdClick} key="setThreshold">
                <ListItemIcon><TimelapseIcon /></ListItemIcon>
                <ListItemText primary="Set Signing Threshold" />
              </ListItem>
            </List>
          </div>
        </Dialog>

        <Dialog open={this.state.showAddKeyholderDialog} onClose={this.onAddKeyholderClose} aria-labelledby="addkeyholder-title">
          <DialogTitle id="addkeyholder-title">Add a Keyholder</DialogTitle>
          <DialogContent>
            <FunctionABIEntry provider={this.props.provider} abi={contract.interface.functions['setKeyholderWeight']} />
          </DialogContent>
        </Dialog>

        <Dialog open={this.state.showSetThresholdDialog} onClose={this.onSetThresholdClose} aria-labelledby="setthreshold-title">
          <DialogTitle id="setthreshold-title">Set Signing Threshold</DialogTitle>
          <DialogContent>
            <FunctionABIEntry provider={this.props.provider} abi={contract.interface.functions['setThreshold']} />
          </DialogContent>
        </Dialog>

        <Fab color="primary" onClick={this.onNewTxClick} aria-label="New Transaction" className={classes.fab}>
          <AddIcon />
        </Fab>
      </>
    );
  }
};

export default withStyles(styles)(MultisigTransactionCreator);
