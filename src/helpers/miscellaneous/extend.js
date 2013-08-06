dust.helpers.extend = function (chk, ctx, bodies, params) {
	var saveData = chk.data,
		result;

	chk.data = [];
	result =  bodies.block(chk, ctx).data.join('');
	chk.data = saveData;
	if (params.filter) {
/*jshint evil:true */
		dust.filters[params.filter] = eval('false||'+result);
	} else if (params.helper) {
/*jshint evil:true */
		dust.helpers[params.helper] = eval('false||'+result);
	}
	return chk.write('');
};
