import { ethers } from 'ethers';
import { BigNumber} from 'ethers/utils';
import { Interface, EventFragment, FunctionFragment } from 'ethers/utils';
import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FunctionABIEntry from './FunctionABIEntry';
import { isFunctionFragment } from './findFunctionDefinition';

type FieldValue = string|Uint8Array|BigNumber|undefined;

interface Props {
  abi: Array<EventFragment | FunctionFragment>;
  constant: boolean;
  onChange?: (abi: FunctionFragment|undefined, args: Array<FieldValue>|undefined) => any;
}

interface State {
  selected: number;
}

class ABIPicker extends Component<Props, State> {
  functions: Array<FunctionFragment>;

  constructor(props : Props) {
    super(props);
    this.state = {
      selected: -1,
    }

    this.functions = Object.values(this.props.abi).filter(
      desc => (isFunctionFragment(desc) && this.props.constant == desc.constant)) as Array<FunctionFragment>;
    this.functions.sort((a, b) => a.name.localeCompare(b.name));
  }

  componentWillUnmount() {
  }

  onChange = (abi: FunctionFragment, args: Array<{value?: FieldValue, valid: boolean}>) => {
    if(this.props.onChange) {
      if(args.every((arg) => arg.valid)) {
        this.props.onChange(abi, args.map((arg) => arg.value));
      } else {
        this.props.onChange(abi, undefined);
      }
    }
  }

  onPanelChange = (panel: number) => (event: React.ChangeEvent<{}>, expanded: boolean) => {
    this.setState({
      selected: expanded?panel:-1,
    });
    if(this.props.onChange) {
      this.props.onChange(undefined, undefined);
    }
  }

  render() {
    const { selected } = this.state;

    const panels = this.functions.map((func, idx) => {
      return (
        <ExpansionPanel key={idx} expanded={selected === idx} onChange={this.onPanelChange(idx)}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{func.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {(selected === idx) && <FunctionABIEntry abi={func} onChange={(args) => this.onChange(func, args)} />}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
    return panels;
  }
};

export default ABIPicker;
