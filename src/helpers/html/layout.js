dust.helpers.layout = function (chk, ctx, bodies, params) {
    var base = dust.helpers.tap(params.base, chk, ctx),
      prevBlocks = ctx.blocks ? ctx.blocks[ctx.blocks.length - 1] : {};

    for (var key in prevBlocks) {
        bodies[key] = prevBlocks[key];
    }
    ctx.blocks = [bodies];
    return chk.partial(base, ctx, null);
}
