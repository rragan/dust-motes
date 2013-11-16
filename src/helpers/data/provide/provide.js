dust.helpers.provide = function provide(chunk, ctx, bodies, params) {
  'use strict';
  var resData,
    paramVals = {},
    k,
    localCtx = ctx,
    saveData = chunk.data;

  if (params) {
    localCtx = ctx.push(params); // make params available to all bodies
  }

  for (k in bodies) {
    if (k !== 'block') {
      chunk.data = [];
      resData = JSON.parse(bodies[k](chunk, localCtx).data.join(''));
      paramVals[k] = resData;
    }
  }
  chunk.data = saveData;

  // combine block-defined params with any existing ones.
  // Block param overrides if name duplicates regular 11Guparam
  return bodies.block(chunk, localCtx.push(paramVals));

};

