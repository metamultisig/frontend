import { ethers } from 'ethers';
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

import { SigningRequest } from './BackendSchema';
import AddressRenderer from './AddressRenderer';
import FunctionCallRenderer from './FunctionCallRenderer';

const styles = (theme: Theme) =>
  createStyles({
    card: {
    },
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  request: SigningRequest;
}

interface State {
  label?: string;
}

class MultisigSigningRequestRenderer extends Component<Props, {}> {
  constructor(props : Props) {
    super(props);
    this.state = {
      label: undefined,
    }
  }

  render() {
    // TODO: Move ABI checking/resolving up, check that the ABI is correct before displaying it.
    let {request, provider, classes} = this.props;
    const destination = <AddressRenderer provider={provider} value={request.destination} showLaunchIcon={false} showCopyIcon={false} />;
    let title: any = undefined;
    if(request.data) {
      if(request.abi) {
        title = <>
          Call {request.abi.name} on {destination}
        </>;
      } else {
        title = <>
          Call an unknown function on {destination}
        </>;
      }
    } else if(request.value && !request.value.isZero()) {
      title = <>Send {ethers.utils.formatEther(request.value)} to {destination}</>
    }
    return (
      <Card className={classes.card}>
        <CardHeader title={title} />
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Destination</TableCell>
                <TableCell>
                  <AddressRenderer provider={provider} value={request.destination} />
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
              {request.data?<>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>
                    <FunctionCallRenderer provider={provider} abi={request.abi} data={request.data} />
                  </TableCell>
                </TableRow>
              </>:''}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions disableActionSpacing>
          <IconButton aria-label="Sign"><CheckCircleIcon /></IconButton>
        </CardActions>
      </Card>
    );
  }
};

export default withStyles(styles)(MultisigSigningRequestRenderer);
