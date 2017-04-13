import result from 'lodash/result';
import curry from 'lodash/curry';

let fn = function(path, props1, props2, val1, val2) {
  let target1 = result(props1, path);
  let target2 = result(props2, path);

  return target1 === val1 && target2 === val2;
};

export default curry(fn);