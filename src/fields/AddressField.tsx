import { ethers } from 'ethers';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

interface Props {
  provider: ethers.providers.Provider;
  label: string;
  value: string;
  onChange?: (value: string, valid: boolean, addr: string) => any;
}

const address_re = /^0x[0-9a-fA-F]{40}$/;

class AddressField extends Component<Props, {}> {
  private valid: boolean;
  private timerId?: ReturnType<typeof setTimeout>;

  constructor(props : Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.tryResolveName = this.tryResolveName.bind(this);
    this.valid = address_re.test(props.value);

    if(props.value.includes('.') && !props.value.endsWith('.')) {
      this.timerId = setTimeout(this.tryResolveName, 200);
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(!e.target.value) return;

    this.valid = address_re.test(e.target.value);

    if(this.props.onChange) {
      this.props.onChange(e.target.value, address_re.test(e.target.value), e.target.value);
    }

    if(this.props.value.includes('.') && !this.props.value.endsWith('.')) {
      if(this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }
      this.timerId = setTimeout(this.tryResolveName, 200);
    }
  }

  async tryResolveName() {
    const addr = await this.props.provider.resolveName(this.props.value);
    if(addr) {
      this.valid = true;
      if(this.props.onChange) {
        this.props.onChange(this.props.value, true, addr);
      }
    }
  }

  componentWillUnmount() {
    if(this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  render() {
    return (
      <TextField
        onChange={this.onChange}
        label={this.props.label}
        value={this.props.value}
        error={!this.valid}
        placeholder="name.eth or 0x..."
      />
    );
  }
};

export default AddressField;
