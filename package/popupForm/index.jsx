import React from 'react';
import createClass from 'create-react-class';
import createComponent from 'rce-pattern/createComponent';
import init from './init';
import update from './update';
import uniqueId from 'lodash/uniqueId';
import { view as LoadingScreen } from '../loadingScreen/';

// element.closest polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
    function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement));
        return el;
    };
}

let name = 'PopupForm';

let view = createClass({
  componentDidMount() {
    if ( this.props.model.show.val() ) {
      this.onOpen();
    }

    let formId = uniqueId(name);

    this.formId = formId;

    // ie|edge doesn't support button's "form" attribute
    // https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/7327649-add-support-for-the-form-attribute
    if ( navigator.userAgent.includes('Edge') ) {
      this.triggerFormSubmit = function() {
        let submitBtn = event.target.closest(`[form="${formId}"]`);
        if (submitBtn !== null) {
          document.querySelector(`#${formId}`).dispatchEvent(new Event("submit"));
        }
      };

      document.addEventListener('click', this.triggerFormSubmit, false);
    }
  },

  componentWillUnmount() {
    if (this.triggerFormSubmit) {
      document.removeEventListener('click', this.triggerFormSubmit);
    }
  },

  getData() {
    let { apiCalls, dispatch } = this.props;
    dispatch('getData', apiCalls);
  },

  onOpen() {
    this.getData();
    this.props.dispatch('setOpenAnimStatus', false);
  },

  afterOpen() {
    this.props.dispatch('setOpenAnimStatus', true);
  },

  onFormSubmit(event) {
    event.stopPropagation(); // form maybe nested at mount time
    event.preventDefault();
    this.save();
  },

  save() {
    let { form } = this;
    let { dispatch, apiCalls, onSave, validate } = this.props;
    dispatch('save', { apiCalls, onSave, validate, form });
  },

  setForm(elem) {
    this.form = elem;
  },

  Form(props) {
    let { formId, onFormSubmit } = this;
    return (
      <form
        {...props}
        ref={this.setForm}
        id={formId}
        onSubmit={onFormSubmit}
      />
    );
  },

  LoadingScreen(props) {
    let {
      isSaving,
      loadingScreenModel: {
        status,
        failedMsg,
        requestType
      }
    } = this.props.model;

    let { className, ...otherProps } = props;
    let { getData, save } = this;

    let requestTypes = {
      save: {
        retry: save,
        loadingMsg: '保存中'
      },
      getData: {
        retry: getData,
        loadingMsg: '加载中'
      }
    };

    let { loadingMsg, retry } = requestTypes[requestType.val()];

    return (
      <LoadingScreen
        {...otherProps}
        className={`${className} ${(isSaving.val() ? 'loadingScreen--cover' : '')}`}
        model={status}
        loadingMsg={loadingMsg}
        onRequestRetry={retry}
        failedMsg={failedMsg.val()}
      />
    );
  },

  render() {
    let {
      Form, formId, onOpen, afterOpen, getData,
      LoadingScreen
    } = this;

    return React.cloneElement(this.props.children, {
      Form, formId, onOpen, afterOpen, getData,
      LoadingScreen
    });
  },
});



view = createComponent({ name, view, update });
export { init, view };