import React from 'react';
import createClass from 'create-react-class';
import identity from 'lodash/identity';
import rome from 'rome';
import createComponent from 'rce-pattern/createComponent';
import { view as TextFieldBtn } from '../textField/button';
import { view as Dialog } from '../confirm';
import { view as Slot } from '../slot/';


let name = 'dateTimePicker';

let init = function() {
  return {
    show: false,
    time: Date.now(),
  };
};

let update = function({ type, payload, model, dispatch }) {
  let actions = {
    showPicker() {
      model.show.set(true);
    },

    confirm() {
      model.time.set(+payload);
    },
  };
  actions[type]();
};

let Picker = createClass({
  componentDidMount() {
    let { elem } = this.refs;
    let { initialValue, romeOptions = {} } = this.props;
    let options = Object.assign(romeOptions, {
      initialValue: new Date(initialValue),
      timeInterval: 3600,
    });

    this.instance = rome(elem, options);
  },

  componentWillUnmount() {
    this.instance.destroy();
  },

  componentWillReceiveProps(nextProps) {
    let nextModel = nextProps.model;
    let curModel = this.props.model;

    if (nextModel !== curModel) {
      this.instance.setValue(nextModel.time.val());
    }
  },

  getDate() {
    return this.instance.getDate();
  },

  render() {
    return (
      <div ref="elem" />
    );
  },
});

let view = createClass({
  confirm(closeDialog) {
    let time = this.refs.picker.getDate();
    this.props.dispatch('confirm', time);
    closeDialog();
  },

  render() {
    let { model, dispatcher, label, timeFormatter = identity, ...otherProps } = this.props;
    let time = model.time.val();

    return (
      <div ref="main">
        <Dialog
          className="dialog--noContentSidePadding dateTimeRangePicker_dialog"
          model={model.show}
          onConfirm={this.confirm}
        >
          <Slot name="content">
            <Picker
              initialValue={time}
              ref="picker"
            />
          </Slot>
        </Dialog>

        <TextFieldBtn
          className="textField--dropDown"
          floatingLabel={label}
          onClick={dispatcher('showPicker')}
          value={timeFormatter(time)}
        />
      </div>
    );
  },
});

view = createComponent({ name, view, update });
export { init, view };