import { compose, graphql, ChildProps } from 'react-apollo';
import { ApolloError, gql } from 'apollo-boost';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils/abi-coder';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { SigningRequest } from './BackendSchema';
import MultisigSigningRequestCard from './MultisigSigningRequestCard';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing.unit,
      margin: theme.spacing.unit,
      marginBottom: 3 * theme.spacing.unit,
    },
  });

const GET_SIGNING_REQUESTS_QUERY = gql`
  query Multisig($address: Address!) {
    multisig(address: $address) {
      signingRequests {
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
  }
`;

interface Response {
  multisig: {
    signingRequests: Array<{
      id?: string,
      destination: string,
      value: string,
      data: string,
      abi: FunctionFragment,
      nonce: number,
      signatures: Array<string>,
      description?: string,
    }>
  };
}

interface Variables {
  address: string;
}

interface InputProps extends WithStyles<typeof styles> {
  multisig: ethers.Contract;
}

const withSigningRequests = graphql<InputProps, Response>(GET_SIGNING_REQUESTS_QUERY, {
  options: ({ multisig }) => ({
    variables: { address: multisig.address },
  }),
});

class MultisigSigningRequests extends Component<ChildProps<InputProps, Response>, {}> {
  render() {
    const { data, multisig, classes } = this.props;
    if(!data || data.loading) return <Paper className={classes.paper}><Typography>Loading...</Typography></Paper>;
    if(!data.multisig || !data.multisig.signingRequests || data.error) return <Paper className={classes.paper}><Typography>Error loading signing requests</Typography></Paper>;

    var requests = data.multisig.signingRequests.map((request) => new SigningRequest(multisig.address, request))
    return (
      <Grid container spacing={24}>
        {requests.map((sr: SigningRequest) => {
          return (
            <Grid item xs={6} key={sr.id}>
              <MultisigSigningRequestCard key={sr.id} multisig={multisig} request={sr} />
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default compose(withSigningRequests, withStyles(styles))(MultisigSigningRequests);
