import { ethers } from 'ethers';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

interface Props {
  provider: ethers.providers.Provider;
  label: string;
  value: string|null;
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
    this.valid = props.value != null && address_re.test(props.value);

    if(props.value != null && props.value.includes('.') && !props.value.endsWith('.')) {
      this.timerId = setTimeout(this.tryResolveName, 200);
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(!e.target.value) return;

    this.valid = address_re.test(e.target.value);

    if(this.props.onChange) {
      this.props.onChange(e.target.value, address_re.test(e.target.value), e.target.value);
    }

    if(e.target.value.includes('.') && !e.target.value.endsWith('.')) {
      if(this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }
      this.timerId = setTimeout(this.tryResolveName, 200);
    }
  }

  async tryResolveName() {
    const addr = await this.props.provider.resolveName(this.props.value as string);
    if(addr) {
      this.valid = true;
      if(this.props.onChange) {
        this.props.onChange(this.props.value as string, true, addr);
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
        value={this.props.value || ''}
        error={!this.valid}
        placeholder="name.eth or 0x..."
      />
    );
  }
};

export default AddressField;
