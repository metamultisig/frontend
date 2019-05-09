import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import { ethers } from 'ethers';
import {
  arrayify,
  BigNumber,
  bigNumberify,
  defaultAbiCoder,
  formatEther,
  formatSignature,
  id,
  verifyMessage,
} from 'ethers/utils';
import React, { Component, ReactNode } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';

import AddressRenderer from './AddressRenderer';
import { SigningRequest, SigningRequestStatus } from './BackendSchema';
import FunctionCallRenderer from './FunctionCallRenderer';
import { ProviderContext } from './ProviderContext';

const styles = (theme: Theme) =>
  createStyles({
  });

export interface Signer {
  sign: (request: SigningRequest) => any;
  publish: (request: SigningRequest) => any;
}

interface Props extends WithStyles<typeof styles> {
  multisig: ethers.Contract;
  onSignature: (sig: string) => any;
  children(signer: Signer): JSX.Element;
}

interface State {
  request?: SigningRequest;
  status?: SigningRequestStatus;
  ourWeight: number;
  showConfirmationDialog: boolean;
  showSignOrSendDialog: boolean;
  lastTxId?: string;
}

class TransactionSigner extends Component<Props, State> {
  static contextType = ProviderContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      ourWeight: 0,
      showConfirmationDialog: false,
      showSignOrSendDialog: false,
    };
  }

  setRequest = async (request: SigningRequest) => {
    this.setState({
      request: request,
    });
    request.getStatus(this.context.provider).then((status) => this.setState({
      status: status,
    }));
    const address = await this.context.provider.getSigner().getAddress();
    this.props.multisig.keyholders(address).then((weight: number) => this.setState({
      ourWeight: weight,
    }));
  }

  sign = (request: SigningRequest) => {
    this.setRequest(request);
    this.setState({
      showConfirmationDialog: true,
    });
  }

  onApprove = async () => {
    const { status, ourWeight } = this.state;
    if(!status) return;

    const signer = this.context.provider.getSigner();
    const address = await signer.getAddress();
    if(status.totalWeight + ourWeight >= status.threshold) {
      this.setState({
        showConfirmationDialog: false,
        showSignOrSendDialog: true,
      });
    } else {
      await this.onSignOnly();
    }
  }

  onSignOnly = async () => {
    this.setState({
      showConfirmationDialog: false,
      showSignOrSendDialog: false,
    });

    const { multisig, onSignature } = this.props;

    const { request } = this.state;
    if(!request) return;

    const signer = this.context.provider.getSigner();

    const hash = await multisig.getTransactionHash(request.destination, request.value, request.data, request.nonce);
    const sig = await signer.signMessage(arrayify(hash));
    onSignature(sig);
  }

  publish = async (request: SigningRequest) => {
    this.setRequest(request);
    this.setState({
      showSignOrSendDialog: false,
    });

    const { status } = this.state;
    if(!status) return;

    const { multisig } = this.props;

    const address = await this.context.provider.getSigner().getAddress();
    const sigs = Object.values(status.signatories)
      .filter((sig) => (sig.address !== address))
      .map((sig) => sig.signature);
    const tx = await multisig.submit(request.destination, request.value, request.data, request.nonce, sigs);
    this.setState({
      lastTxId: tx.hash,
    });
  }

  render() {
    const { multisig, children, classes } = this.props;
    const { request, status } = this.state;

    return (
      <>
        <Dialog open={this.state.showConfirmationDialog} onClose={() => this.setState({showConfirmationDialog: false})} aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
          <DialogTitle id="confirmation-title">Sign Transaction?</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-text">{request && request.title()}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({showConfirmationDialog: false})} color="primary">Cancel</Button>
            <Button onClick={this.onApprove} color="primary" autoFocus>Sign</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.showSignOrSendDialog} onClose={() => this.setState({showSignOrSendDialog: false})} aria-labelledby="signorsend-title" aria-describedby="signorsend-description">
          <DialogTitle id="signorsend-title">Publish Transaction?</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-text">
              Your approval will cause the transaction to reach the required signature weight. Do you want to publish the transaction to the blockchain, or just record your signature for later broadcast?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({showConfirmationDialog: false})} color="primary">Cancel</Button>
            <Button onClick={this.onSignOnly} color="primary">Sign Only</Button>
            <Button onClick={() => this.publish(request as SigningRequest)} color="primary">Publish</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.lastTxId !== undefined}
          autoHideDuration={6000}
          onClose={() => this.setState({lastTxId: undefined})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Transaction <Link href={"https://etherscan.io/tx/" + this.state.lastTxId}>
            {this.state.lastTxId && (this.state.lastTxId.slice(0, 6) + '…' + this.state.lastTxId.slice(60))}
          </Link> sent</span>}
        />
        {children({sign: this.sign, publish: this.publish})}
      </>
    );
  }
};

export default withStyles(styles)(TransactionSigner);
