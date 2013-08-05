dust.helpers.substr = function (chunk, ctx, bodies, params) {
// Get the values of all the parameters. The tap function takes care of resolving any variable references
// used in parameters (e.g. param="{name}"
  var str = dust.helpers.tap(params.str, chunk, ctx),
    begin = dust.helpers.tap(params.begin, chunk, ctx),
    end = dust.helpers.tap(params.end, chunk, ctx),
    len = dust.helpers.tap(params.len, chunk, ctx);

  begin = begin || 0; // Default begin to zero if omitted
  // Use JavaScript substr if len is supplied.
  // Helpers need to return some value using chunk. Here we write the substring into chunk.
  // If you have nothing to output, just return chunk.write("");
  if (!(typeof(len) === 'undefined')) {
    return chunk.write(str.substr(begin,len));
  }
  if (!(typeof(end) === 'undefined')) {
    return chunk.write(str.slice(begin,end));
  }
  return chunk.write(str);
}

