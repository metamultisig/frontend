import { ethers } from 'ethers';
import {
  arrayify,
  bigNumberify,
  BigNumber,
  defaultAbiCoder,
  formatEther,
  formatSignature,
  FunctionFragment,
  verifyMessage
} from 'ethers/utils';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SendIcon from '@material-ui/icons/Send';

import { SigningRequest, SigningRequestStatus } from './BackendSchema';
import AddressRenderer from './AddressRenderer';
import FunctionCallRenderer from './FunctionCallRenderer';
import { ProviderContext } from './ProviderContext';
import TransactionSigner from './TransactionSigner';

const styles = (theme: Theme) =>
  createStyles({
    card: {
    },
    cardHeader: {
    },
  });

interface Props extends WithStyles<typeof styles> {
  multisig: ethers.Contract;
  request: SigningRequest;
}

interface State {
  status?: SigningRequestStatus;
  ourAddress?: string
}

class MultisigSigningRequestCard extends Component<Props, State> {
  static contextType = ProviderContext;

  constructor(props : Props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    const status = await this.props.request.getStatus(this.context.provider);
    const ourAddress = await this.context.provider.getSigner().getAddress();
    this.setState({status, ourAddress});
  }

  onSign = (sig: string) => {
    console.log("New signature: " + sig);
  }

  render() {
    const {request, multisig, classes} = this.props;
    const {status, ourAddress} = this.state;
    const inputs = request.inputs();

    return (
      <TransactionSigner
        multisig={multisig}
        onSignature={this.onSign}
      >
        {({sign, publish}) => (
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={request.title()}
              subheader={status?(status.totalWeight + "/" + status.threshold + " signature weight"):undefined}
            />
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Destination</TableCell>
                    <TableCell>
                      <AddressRenderer value={request.destination} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>{ethers.utils.formatEther(request.value)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nonce</TableCell>
                    <TableCell>{request.nonce}</TableCell>
                  </TableRow>
                  {(request.abi && inputs)?<>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>
                        <FunctionCallRenderer abi={request.abi} inputs={inputs} />
                      </TableCell>
                    </TableRow>
                  </>:''}
                  <TableRow>
                    <TableCell>Signers</TableCell>
                    <TableCell>{status && Object.keys(status.signatories).join(', ')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardActions disableActionSpacing>
              <IconButton aria-label="Sign" disabled={!status || status.totalWeight >= status.threshold || !ourAddress || status.signatories[ourAddress] !== undefined} onClick={() => sign(request)} title="Sign this request"><CheckCircleIcon /></IconButton>
              <IconButton aria-label="Send" disabled={!status || status.totalWeight < status.threshold} onClick={() => publish(request)} title="Publish this request to the blockchain"><SendIcon /></IconButton>
            </CardActions>
          </Card>
        )}
      </TransactionSigner>
    );
  }
};

export default withStyles(styles)(MultisigSigningRequestCard);
