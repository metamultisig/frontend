import { ethers } from 'ethers';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { SigningRequest } from './BackendSchema';
import AddressRenderer from './AddressRenderer';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing.unit,
      margin: theme.spacing.unit,
      marginBottom: 3 * theme.spacing.unit,
    },
    grid: {
      padding: 2 * theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  request: SigningRequest;
}

class MultisigSigningRequestRenderer extends Component<Props, {}> {
  constructor(props : Props) {
    super(props);
  }

  render() {
    let {classes} = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={24} className={classes.grid}>
          <Grid item xs={6}>
            <Typography>Destination</Typography>
          </Grid>
          <Grid item xs={6}>
            <AddressRenderer provider={this.props.provider} value={this.props.request.destination} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Value</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{ethers.utils.formatEther(this.props.request.value || 0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Nonce</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{this.props.request.nonce}</Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
};

export default withStyles(styles)(MultisigSigningRequestRenderer);
