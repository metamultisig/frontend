import { gql } from "apollo-boost";
import { Mutation, MutationFn } from "react-apollo";
import { ethers } from 'ethers';
import { BigNumber, defaultAbiCoder } from 'ethers/utils';
import React, { Component } from 'react';
import { EventFragment, FunctionFragment } from 'ethers/utils/abi-coder';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import Button from '@material-ui/core/Button';
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

import AddressField from './fields/AddressField';
import ABIFetcher from './ABIFetcher';
import ABIPicker from './ABIPicker';
//import findFunctionDefinition from './findFunctionDefinition';
import {ProviderContext} from './ProviderContext';
import {SigningRequest} from './BackendSchema';
import TransactionSigner from './TransactionSigner';

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

interface Variables {
  address: string;
  request: SigningRequest;
}

interface Props extends WithStyles<typeof styles> {
  multisig: ethers.Contract;
}

interface State {
  showCreateTxDialog: boolean;
  destination?: string;
  abi?: Array<EventFragment | FunctionFragment>;
  request?: SigningRequest;
  // showTxTypeDialog: boolean;
  // showAddKeyholderDialog: boolean;
  // showSetThresholdDialog: boolean;
  // lastTxId?: string;
}

type FieldValue = string|Uint8Array|BigNumber|undefined;

class MultisigTransactionCreator extends Component<Props, State> {
  static contextType = ProviderContext;

  constructor(props: Props) {
    super(props);

    this.state = {
      showCreateTxDialog: false,
      // showTxTypeDialog: false,
      // showAddKeyholderDialog: false,
      // showSetThresholdDialog: false,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // onNewTxClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showTxTypeDialog: true,
  //   });
  // }
  //
  // onNewTxClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showTxTypeDialog: false,
  //   });
  // }
  //
  // onAddKeyholderClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showTxTypeDialog: false,
  //     showAddKeyholderDialog: true,
  //   });
  // }
  //
  // onAddKeyholderClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showAddKeyholderDialog: false,
  //   });
  // }
  //
  // onSetThresholdClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showTxTypeDialog: false,
  //     showSetThresholdDialog: true,
  //   });
  // }
  //
  // onSetThresholdClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({
  //     showSetThresholdDialog: false,
  //   });
  // }
  //
  // onAddKeyholder = async (args: Array<FieldValue>, submit: (variables: any) => any) => {
  //   const descriptor = this.props.contract.interface.functions['setKeyholderWeight'];
  //   const fragment = findFunctionDefinition(this.props.contract.interface.abi, descriptor.sighash);
  //   const encoded = descriptor.encode(args);
  //   const nonce = (await this.props.contract.nextNonce()).toNumber();
  //   const id = await this.props.contract.getTransactionHash(this.props.contract.address, 0, encoded, nonce);
  //   var sig = await this.context.provider.getSigner().signMessage(ethers.utils.arrayify(id));
  //   console.log(await submit({
  //     variables: {
  //       address: this.props.contract.address,
  //       request: {
  //         destination: this.props.contract.address,
  //         data: encoded,
  //         abi: fragment,
  //         nonce: nonce,
  //         signatures: [sig],
  //       },
  //     },
  //   }));
  //   this.setState({
  //     showAddKeyholderDialog: false,
  //     lastTxId: id,
  //   });
  // }
  //
  // onSetThreshold = async (args: Array<FieldValue>) => {
  //   this.setState({
  //     showSetThresholdDialog: false,
  //   });
  //
  //   const descriptor = this.props.contract.interface.functions['setThreshold'];
  //   const encoded = descriptor.encode(args);
  //   var nonce = await this.props.contract.nextNonce();
  //   var tx = await this.props.contract.submit(
  //     this.props.contract.address,
  //     0,
  //     encoded,
  //     nonce,
  //     []
  //   );
  //   this.setState({
  //     lastTxId: tx.hash,
  //   });
  // }
  //
  // closeTxSnackbar = (e: React.SyntheticEvent<any, Event>, reason: string) => {
  //   if(reason == 'clickaway') {
  //     return;
  //   }
  //
  //   this.setState({
  //     lastTxId: undefined,
  //   });
  // }

  onAddressChange = async (value: string, valid: boolean, name?: string) => {
    if(valid) {
      const fetcher = new ABIFetcher(this.context.provider);
      const abi = await fetcher.fetch(value, name);
      this.setState({
        destination: value,
        abi: abi,
      });
    } else {
      this.setState({
        destination: undefined,
        abi: undefined,
      });
    }
  }

  onAbiChange = async (abi: FunctionFragment|undefined, args: Array<FieldValue>|undefined) => {
    if(abi && args && this.state.destination) {
      const nonce = await this.props.multisig.nextNonce();
      this.setState({
        request: new SigningRequest({
          destination: this.state.destination,
          inputs: args,
          abi: abi,
          nonce: nonce.toNumber(),
          value: 0,
          signatures: [],
        }),
      });
    } else {
      this.setState({
        request: undefined,
      });
    }
  }

  onSignature = (sig: string, submitMutation: MutationFn<SigningRequest, Variables>) => {
    const request = this.state.request as SigningRequest;
    request.signatures.push(sig);
    submitMutation({variables: {
      address: this.props.multisig.address,
      request: request
    }});
  }

  render() {
    const { classes, multisig } = this.props;
    const { request } = this.state;

    let signButton = <Button color="primary" disabled>Propose</Button>;
    if(request) {
      signButton = <Mutation<SigningRequest, Variables> mutation={submitSigningRequest}>
        {(submitMutation) => (
          <TransactionSigner
            multisig={multisig}
            request={request}
            onSignature={(sig) => this.onSignature(sig, submitMutation)}
          >
            {(sign) => (
              <Button
                onClick={sign}
                color="primary"
                disabled={this.state.request === undefined}
              >
                Propose
              </Button>
            )}
          </TransactionSigner>
        )}
      </Mutation>;
    }

    return (
      <>
        <Dialog open={this.state.showCreateTxDialog} onClose={() => this.setState({showCreateTxDialog: false})} aria-labelledby="createtxdialog-title">
          <DialogTitle id="createtxdialog-title">Propose a transaction</DialogTitle>
          <DialogContent>
            <AddressField label="Address" onChange={this.onAddressChange} />
            {this.state.abi && <ABIPicker abi={this.state.abi} constant={false} onChange={this.onAbiChange} />}
          </DialogContent>
          <DialogActions>
            {signButton}
            <Button onClick={() => this.setState({showCreateTxDialog: false})} color="primary">Cancel</Button>
          </DialogActions>
        </Dialog>
        <Fab color="primary" onClick={() => this.setState({showCreateTxDialog: true})} aria-label="New Transaction" className={classes.fab}>
          <AddIcon />
        </Fab>
      </>
    );
  }
};

// <Dialog open={this.state.showTxTypeDialog} onClose={this.onNewTxClose} aria-labelledby="txtype-title">
//   <DialogTitle id="txtype-title">Select Transaction Type</DialogTitle>
//   <div>
//     <List>
//       <ListItem button onClick={this.onAddKeyholderClick} key="addKeyholder">
//         <ListItemIcon><PersonAddIcon /></ListItemIcon>
//         <ListItemText primary="Add Keyholder" />
//       </ListItem>
//       <ListItem button onClick={this.onSetThresholdClick} key="setThreshold">
//         <ListItemIcon><TimelapseIcon /></ListItemIcon>
//         <ListItemText primary="Set Signing Threshold" />
//       </ListItem>
//     </List>
//   </div>
// </Dialog>
//
// <Dialog open={this.state.showAddKeyholderDialog} onClose={this.onAddKeyholderClose} aria-labelledby="addkeyholder-title">
//   <DialogTitle id="addkeyholder-title">Add a Keyholder</DialogTitle>
//   <DialogContent>
//     <Mutation mutation={submitSigningRequest}>
//       {(submit: (variables: any) => any) => (
//         <FunctionABIEntry
//           abi={contract.interface.functions['setKeyholderWeight']}
//           onSubmit={(args: Array<FieldValue>) => this.onAddKeyholder(args, submit)} />
//       )}
//     </Mutation>
//   </DialogContent>
// </Dialog>
//
// <Dialog open={this.state.showSetThresholdDialog} onClose={this.onSetThresholdClose} aria-labelledby="setthreshold-title">
//   <DialogTitle id="setthreshold-title">Set Signing Threshold</DialogTitle>
//   <DialogContent>
//     <FunctionABIEntry
//       abi={contract.interface.functions['setThreshold']}
//       onSubmit={this.onSetThreshold} />
//   </DialogContent>
// </Dialog>
//
// <Snackbar
//   anchorOrigin={{
//     vertical: 'bottom',
//     horizontal: 'left',
//   }}
//   open={this.state.lastTxId !== undefined}
//   autoHideDuration={6000}
//   onClose={this.closeTxSnackbar}
//   ContentProps={{
//     'aria-describedby': 'message-id',
//   }}
//   message={<span id="message-id">Transaction <Link href={"https://etherscan.io/tx/" + this.state.lastTxId}>{this.state.lastTxId}</Link> sent</span>}
// />

export default withStyles(styles)(MultisigTransactionCreator);
