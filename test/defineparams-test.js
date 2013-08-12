_console = console;
dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/data/defineParams.js');
var assert = require('assert');


describe('defineParams', function() {
	it('simple param', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@defineParams}{#param}{.}{/param}{:param}[1,2,3]{/defineParams}';
		dust.renderSource(code, context, function (err, out) {
console.log("OUT",out);
			assert.equal(out,'123');
		});
	});
});
