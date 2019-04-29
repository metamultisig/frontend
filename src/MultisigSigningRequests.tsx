import { Query, QueryResult } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils/abi-coder';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { SigningRequest } from './BackendSchema';
import MultisigSigningRequestRenderer from './MultisigSigningRequestRenderer';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing.unit,
      margin: theme.spacing.unit,
      marginBottom: 3 * theme.spacing.unit,
    },
  });

const getSigningRequests = gql`
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

interface Data {
  multisig: {
    signingRequests: Array<SigningRequest>
  },
}

interface Variables {
  address: string,
}

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.JsonRpcProvider;
  address: string;
}

class MultisigSigningRequests extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { address, classes } = this.props;

    return (
      <Query<Data, Variables>
        query={getSigningRequests}
        variables={{address: this.props.address}}
      >
        {(result) => {
          if(result.loading) return <Paper className={classes.paper}><Typography>Loading...</Typography></Paper>;
          if(result.error || !result.data) return <Paper className={classes.paper}><Typography>Error loading signing requests.</Typography></Paper>;
          return result.data.multisig.signingRequests.map((sr: SigningRequest) => (
            <MultisigSigningRequestRenderer key={sr.id} provider={this.props.provider} request={sr} />
          ));
        }}
      </Query>
    );
  }
};

export default withStyles(styles)(MultisigSigningRequests);
