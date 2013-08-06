dust.helpers.defineParams = function (chk, ctx, bodies) {
  var resData,
    paramVals = {},
    k,
    saveData = chk.data;

  for (k in bodies) {
    if (k !== 'block') {
      chk.data = [];
      resData = JSON.parse(bodies[k](chk, ctx).data.join(''));
      paramVals[k] = resData;
    }
  }
  chk.data = saveData;
  return bodies.block(chk, ctx.push(paramVals));
};
