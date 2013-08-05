dust.helpers.defineParams = function (chk, ctx, bodies, params) {
    var resData,
      paramVals = {},
      saveData = chk.data;

    for (var k in bodies) {
        if (k !== 'block') {
            chk.data = [];
            resData = JSON.parse(bodies[k](chk, ctx).data.join(""));
            paramVals[k] = resData;
        }
    }
    chk.data = saveData;
    return bodies.block(chk, ctx.push(paramVals));
};
