import React from 'react';
import createComponent from 'rce-pattern/createComponent';
import RenderInBody from './renderInBody';
import { view as PopupContent, init as popupContentInit } from './popupContent';


let name = 'Popup';

let init = popupContentInit;

let update = function({ type, payload, model, dispatch }) {};

let view = function(props) {
  return (
    <RenderInBody>
      <PopupContent {...props}></PopupContent>
    </RenderInBody>
  );
};



view = createComponent({ name, view, update });
export { init, view };