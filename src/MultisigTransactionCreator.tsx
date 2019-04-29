import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
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
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import MultisigWatcher from './MultisigWatcher';
import FunctionABIEntry from './FunctionABIEntry';

const styles = (theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing.unit,
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    }
  });

const submitSigningRequest = gql`
  mutation SubmitSigningRequest($address: Address!, $request: NewSigningRequest!) {
    submitSigningRequest(address: $address, request: $request) {
      id
      destination
      value
      data
      abi
      nonce
      signatures
      description
    }
  }
`;

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.JsonRpcProvider;
  contract: ethers.Contract;
}

interface State {
  showTxTypeDialog: boolean;
  showAddKeyholderDialog: boolean;
  showSetThresholdDialog: boolean;
  lastTxId?: string;
}

type FieldValue = string|Uint8Array|BigNumber|undefined;

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

  onAddKeyholder = async (args: Array<FieldValue>, submit: (variables: any) => any) => {
    const descriptor = this.props.contract.interface.functions['setKeyholderWeight'];
    const encoded = descriptor.encode(args);
    const nonce = (await this.props.contract.nextNonce()).toNumber();
    const id = await this.props.contract.getTransactionHash(this.props.contract.address, 0, encoded, nonce);
    var sig = await this.props.provider.getSigner().signMessage(ethers.utils.arrayify(id));
    console.log(await submit({
      variables: {
        address: this.props.contract.address,
        request: {
          destination: this.props.contract.address,
          data: encoded,
          nonce: nonce,
          signatures: [sig],
        },
      },
    }));
    this.setState({
      showAddKeyholderDialog: false,
      lastTxId: id,
    });
  }

  onSetThreshold = async (args: Array<FieldValue>) => {
    this.setState({
      showSetThresholdDialog: false,
    });

    const descriptor = this.props.contract.interface.functions['setThreshold'];
    const encoded = descriptor.encode(args);
    var nonce = await this.props.contract.nextNonce();
    var tx = await this.props.contract.submit(
      this.props.contract.address,
      0,
      encoded,
      nonce,
      []
    );
    this.setState({
      lastTxId: tx.hash,
    });
  }

  closeTxSnackbar = (e: React.SyntheticEvent<any, Event>, reason: string) => {
    if(reason == 'clickaway') {
      return;
    }

    this.setState({
      lastTxId: undefined,
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
            <Mutation mutation={submitSigningRequest}>
              {(submit: (variables: any) => any) => (
                <FunctionABIEntry
                  provider={this.props.provider}
                  abi={contract.interface.functions['setKeyholderWeight']}
                  onSubmit={(args: Array<FieldValue>) => this.onAddKeyholder(args, submit)} />
              )}
            </Mutation>
          </DialogContent>
        </Dialog>

        <Dialog open={this.state.showSetThresholdDialog} onClose={this.onSetThresholdClose} aria-labelledby="setthreshold-title">
          <DialogTitle id="setthreshold-title">Set Signing Threshold</DialogTitle>
          <DialogContent>
            <FunctionABIEntry
              provider={this.props.provider}
              abi={contract.interface.functions['setThreshold']}
              onSubmit={this.onSetThreshold} />
          </DialogContent>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.lastTxId !== undefined}
          autoHideDuration={6000}
          onClose={this.closeTxSnackbar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Transaction <Link href={"https://etherscan.io/tx/" + this.state.lastTxId}>{this.state.lastTxId}</Link> sent</span>}
        />

        <Fab color="primary" onClick={this.onNewTxClick} aria-label="New Transaction" className={classes.fab}>
          <AddIcon />
        </Fab>
      </>
    );
  }
};

export default withStyles(styles)(MultisigTransactionCreator);
