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
			assert.equal(out,'123');
		});
	}),
	it('supply two blocks', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@defineParams}{#p2}{.}{/p2}{#param}{.}{/param}{:param}[1,2,3]{:p2}[3,4,5,6]{/defineParams}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'3456123');
		});
	}),
	it('supply an object', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@defineParams}{param.pi}{:param}{"pi":"3.1415"}{/defineParams}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'3.1415');
		});
	}),
	it('capture helper value as param', function() {
		var context = { obj: [1,2,3,4,5,6] };
		var code = '{@defineParams}{param.len}{:param}{"len":{@size key=obj/}}{/defineParams}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'6');
		});
	});
});
