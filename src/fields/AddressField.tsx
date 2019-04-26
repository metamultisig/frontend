import { ethers } from 'ethers';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

interface Props {
  provider: ethers.providers.Provider;
  label: string;
  value?: string;
  onChange?: (value: string, valid: boolean, name?: string) => any;
}

const address_re = /^0x[0-9a-fA-F]{40}$/;

class AddressField extends Component<Props, {value: string, valid: boolean}> {
  private timerId?: ReturnType<typeof setTimeout>;

  constructor(props : Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.tryResolveName = this.tryResolveName.bind(this);
    this.state = {
      value: props.value || '',
      valid: props.value !== undefined && address_re.test(props.value),
    }

    if(props.value && props.value.includes('.') && !props.value.endsWith('.')) {
      this.timerId = setTimeout(this.tryResolveName, 200);
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(!e.target.value) return;

    const value = e.target.value;
    const valid = address_re.test(e.target.value);

    if(this.props.onChange) {
      this.props.onChange(value, valid);
    }

    if(value.includes('.') && !value.endsWith('.')) {
      if(this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }
      this.timerId = setTimeout(this.tryResolveName, 200);
    }

    this.setState({
      value: value,
      valid: valid,
    });
  }

  async tryResolveName() {
    const addr = await this.props.provider.resolveName(this.state.value);
    if(addr) {
      this.setState({
        valid: true,
      });
      if(this.props.onChange) {
        this.props.onChange(addr, true, this.state.value);
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
        value={this.state.value}
        error={!this.state.valid}
        placeholder="name.eth or 0x..."
      />
    );
  }
};

export default AddressField;
