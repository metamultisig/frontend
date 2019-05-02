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
import React, { Component } from 'react';
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
import { SigningRequest } from './BackendSchema';
import FunctionCallRenderer from './FunctionCallRenderer';
import {ProviderContext} from './ProviderContext';

const styles = (theme: Theme) =>
  createStyles({
  });

export interface SignerMap {
  [key: string]: {signature: string, weight: number, address: string}
}

export interface SigningRequestData {
  signatories: SignerMap;
  totalWeight: number;
  threshold: number;
  ourWeight: number;
}

interface Props extends WithStyles<typeof styles> {
  multisig: ethers.Contract;
  request: SigningRequest;
  onSignature: (sig: string) => any;
  children(sign: () => any, publish: () => any, title: string, data?: SigningRequestData, inputs?: Array<any>): JSX.Element;
}

interface State {
  signatories?: SignerMap;
  totalWeight: number;
  threshold: number;
  ourWeight: number;
  showConfirmationDialog: boolean;
  showSignOrSendDialog: boolean;
  lastTxId?: string;
}

class TransactionSigner extends Component<Props, State> {
  static contextType = ProviderContext;

  inputs?: Array<any>;

  constructor(props: Props) {
    super(props);

    this.state = {
      signatories: undefined,
      totalWeight: 0,
      threshold: 0,
      ourWeight: 0,
      showConfirmationDialog: false,
      showSignOrSendDialog: false,
    };

    const { abi, data } = props.request;
    if(abi && data && data.length >= 10) {
      const abiSignature = id(formatSignature(abi)).substring(0, 10).toLowerCase();
      if(data.slice(0, 10) === abiSignature) {
        this.inputs = defaultAbiCoder.decode(abi.inputs, '0x' + data.slice(10));
      }
    }
  }

  async componentDidMount() {
    const hash = arrayify(this.props.request.id);
    const sigs = await Promise.all(this.props.request.signatures.map(async (sig) => {
      const address = verifyMessage(hash, sig);
      const weight = await this.props.multisig.keyholders(address);
      if(!weight.isZero()) {
        return {signature: sig, weight: weight.toNumber(), address: address};
      }
    }));

    const signatories = Object.assign(this.state.signatories || {});
    let totalWeight = 0;
    for(let sig of sigs) {
      if(sig !== undefined) {
        signatories[sig.address] = sig;
        totalWeight += sig.weight;
      }
    }

    const threshold = await this.props.multisig.threshold();

    const account = await this.context.account();
    const ourWeight = await this.props.multisig.keyholders(account);

    this.setState({
      signatories: signatories,
      totalWeight: totalWeight,
      threshold: threshold.toNumber(),
      ourWeight: ourWeight.toNumber(),
    })
  }


  sign = () => {
    this.setState({
      showConfirmationDialog: true,
    })
  }

  onApprove = async () => {
    const signer = this.context.provider.getSigner();
    const address = await signer.getAddress();
    const ourWeight = await this.props.multisig.keyholders(address);
    if(this.state.totalWeight + ourWeight >= this.state.threshold) {
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

    const { multisig, request, onSignature } = this.props;
    const signer = this.context.provider.getSigner();

    const hash = await multisig.getTransactionHash(request.destination, request.value, request.data, request.nonce);
    const sig = await signer.signMessage(arrayify(hash));
    onSignature(sig);
  }

  publish = async () => {
    this.setState({
      showSignOrSendDialog: false,
    });

    if(!this.state.signatories) return;

    const { multisig, request } = this.props;
    const address = await this.context.provider.getSigner().getAddress();
    const sigs = Object.values(this.state.signatories)
      .filter((sig) => (sig.address !== address))
      .map((sig) => sig.signature);
    const tx = await multisig.submit(request.destination, request.value, request.data, request.nonce, sigs);
    this.setState({
      lastTxId: tx.hash,
    });
  }

  render() {
    const { multisig, children, request, classes } = this.props;
    const { signatories, totalWeight, threshold, ourWeight } = this.state;


    const destination = <AddressRenderer value={request.destination} showLaunchIcon={false} showCopyIcon={false} />;
    const value = bigNumberify(request.value || 0);
    const amount = (!value.isZero())?<> with {formatEther(value)} ether</>:'';
    let title: any = undefined;
    if(this.inputs && request.abi) {
      title = <>Call {request.abi.name} on {destination}{amount}</>;
    } else if(request.data) {
      title = <>Call an unknown function on {destination}{amount}</>;
    } else if(!value.isZero()) {
      title = <>Send {formatEther(value)} ether to {destination}</>;
    } else {
      title = <>Call {destination}</>;
    }

    return (
      <>
        <Dialog open={this.state.showConfirmationDialog} onClose={() => this.setState({showConfirmationDialog: false})} aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
          <DialogTitle id="confirmation-title">Sign Transaction?</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-text">{title}</DialogContentText>
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
            <Button onClick={this.publish} color="primary">Publish</Button>
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
        {children(this.sign, this.publish, title, (signatories&&threshold)?{signatories, totalWeight, threshold, ourWeight}:undefined, this.inputs)}
      </>
    );
  }
};

export default withStyles(styles)(TransactionSigner);
