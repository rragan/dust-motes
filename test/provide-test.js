_console = console;
dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/data/provide.js');
var assert = require('assert');


describe('provide', function() {
	it('simple param', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@provide}{#param}{.}{/param}{:param}[1,2,3]{/provide}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'123');
		});
	}),
	it('supply two blocks', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@provide}{#p2}{.}{/p2}{#param}{.}{/param}{:param}[1,2,3]{:p2}[3,4,5,6]{/provide}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'3456123');
		});
	}),
	it('supply an object', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@provide}{param.pi}{:param}{"pi":"3.1415"}{/provide}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'3.1415');
		});
	}),
	it('capture helper value in object', function() {
		var context = { obj: [1,2,3,4,5,6] };
		var code = '{@provide}{param.len}{:param}{"len":{@size key=obj/}}{/provide}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'6');
		});
	}),
	it('capture helper as simple format', function() {
		var context = { obj: [1,2,3,4,5,6] };
		var code = '{@provide}{param}{:param}{@size key=obj/}{/provide}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'6');
		});
	});
});
