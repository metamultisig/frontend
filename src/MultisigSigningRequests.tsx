import { compose, graphql, ChildDataProps } from 'react-apollo';
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

interface ChildProps extends WithStyles<typeof styles> {
  multisig: ethers.Contract
  signingRequests?: Array<SigningRequest>;
  loading: boolean;
  error?: ApolloError;
}

const withSigningRequests = graphql<InputProps, Response, Variables, ChildProps>(GET_SIGNING_REQUESTS_QUERY, {
  options: ({ multisig }) => ({
    variables: { address: multisig.address },
  }),
  props: ({ data, ownProps: { multisig, classes } }) => ({
    multisig: multisig,
    classes: classes,
    loading: (!data || !data.loading)?false:data.loading,
    error: (!data)?undefined:data.error,
    signingRequests: (data === undefined || data.multisig === undefined)?undefined:data.multisig.signingRequests.map((request) => new SigningRequest(request)),
  }),
});

class MultisigSigningRequests extends Component<ChildProps, {}> {
  render() {
    const { multisig, signingRequests, loading, error, classes } = this.props;
    if(loading) return <Paper className={classes.paper}><Typography>Loading...</Typography></Paper>;
    if(error || !signingRequests) return <Paper className={classes.paper}><Typography>Error loading signing requests</Typography></Paper>;

    return (
      <Grid container spacing={24}>
        {signingRequests.map((sr: SigningRequest) => {
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
