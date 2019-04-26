import { ethers } from 'ethers';
import { BigNumber} from 'ethers/utils';
import { Interface, FunctionDescription } from 'ethers/utils';
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FunctionABIEntry from './FunctionABIEntry';

type FieldValue = string|Uint8Array|BigNumber|undefined;

interface Props {
  provider: ethers.providers.Provider;
  interface: Interface;
  type: string;
  onSubmit?: (abi: FunctionDescription, args: Array<FieldValue>) => any;
}

interface State {
}

class ABIPicker extends Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
  }

  onSubmit(abi: FunctionDescription, args: Array<FieldValue>) {
    if(this.props.onSubmit) {
      this.props.onSubmit(abi, args);
    }
  }

  render() {
    const functions = Object.values(this.props.interface.functions).filter(
      desc => (this.props.type == desc.type));
    functions.sort((a, b) => a.name.localeCompare(b.name));
    const panels = functions.map(func => {
      return (
        <ExpansionPanel key={func.name}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{func.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FunctionABIEntry provider={this.props.provider} abi={func} onSubmit={(args) => this.onSubmit(func, args)} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
    return panels;
  }
};

export default ABIPicker;
