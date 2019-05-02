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

import { SigningRequest } from './BackendSchema';
import AddressRenderer from './AddressRenderer';
import FunctionCallRenderer from './FunctionCallRenderer';
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
}

class MultisigSigningRequestCard extends Component<Props, State> {
  constructor(props : Props) {
    super(props);
  }

  onSign = (sig: string) => {
    console.log("New signature: " + sig);
  }

  render() {
    let {request, multisig, classes} = this.props;

    return (
      <TransactionSigner
        multisig={multisig}
        request={request}
        onSignature={this.onSign}
      >
        {(sign, publish, title, data, inputs) => (
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={title}
              subheader={data?(data.totalWeight + "/" + data.threshold + " signature weight"):undefined}
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
                    <TableCell>{ethers.utils.formatEther(request.value || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nonce</TableCell>
                    <TableCell>{request.nonce}</TableCell>
                  </TableRow>
                  {(inputs&&request.abi)?<>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>
                        <FunctionCallRenderer abi={request.abi} inputs={inputs} />
                      </TableCell>
                    </TableRow>
                  </>:''}
                </TableBody>
              </Table>
            </CardContent>
            <CardActions disableActionSpacing>
              <IconButton aria-label="Sign" disabled={!data || data.totalWeight >= data.threshold} onClick={sign} title="Sign this request"><CheckCircleIcon /></IconButton>
              <IconButton aria-label="Send" disabled={!data || data.totalWeight < data.threshold} onClick={publish} title="Publish this request to the blockchain"><SendIcon /></IconButton>
            </CardActions>
          </Card>
        )}
      </TransactionSigner>
    );
  }
};

export default withStyles(styles)(MultisigSigningRequestCard);
