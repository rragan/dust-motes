(function(dust){

/**
 * iterate helper, loops over given object.
 * Inspired: https://github.com/akdubya/dustjs/issues/9
 *
 * Example:
 *    {@iterate key=obj}{$key}-{$value} of type {$type}{~n}{/iter}
 *
 * @param key - object of the iteration - Mandatory parameter
 * @param sort - Optional. If omitted, no sort is done. Values allowed:
*	sort="asc" - sort ascending (per JavaScript array sort rules)
 *	sort="desc" - sort descending
 *	sort="fname" - Look for fname object in global context,
 *	if found, treat it as a JavaScript array sort compare function.
 *	if not found, result is undefined (actually sorts ascending
 *	but you should not depend on it)
 */
dust.helpers.iterate = function (chunk, context, bodies, params) {
  var body = bodies.block,
    sort,
    arr,
    i,
    k,
    obj,
    compareFn;

  params = params || {};
  function desc(a, b) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  }

  function processBody(key, value) {
    return body(chunk, context.push({
      $key: key,
      $value: value,
      $type: typeof value
    }));
  }

  if (params.key) {
    obj = dust.helpers.tap(params.key, chunk, context);

    if (body) {
      if ( !! params.sort) {
        sort = dust.helpers.tap(params.sort, chunk, context);
        arr = [];
        for (k in obj) {
          if (obj.hasOwnProperty(k)) {
            arr.push(k);
          }
        }
        compareFn = context.global[sort];
        if (!compareFn && sort === 'desc') {
          compareFn = desc;
        }
        if (compareFn) {
          arr.sort(compareFn);
        } else {
          arr.sort();
        }
        for (i = 0; i < arr.length; i++) {
          chunk = processBody(arr[i], obj[arr[i]]);
        }
      } else {
        for (k in obj) {
          if (obj.hasOwnProperty(k)) {
            chunk = processBody(k, obj[k]);
          }
        }
      }
    } else {
      _console.log('Missing body block in the iter helper.');
    }
  } else {
    _console.log('Missing parameter \'key\' in the iter helper.');
  }
  return chunk;

};
}) (typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
