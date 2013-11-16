dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/miscellaneous/extend');
var assert = require('assert');

describe('extend', function() {
	it('adding a new ad hoc helper', function() {
		var code = '{@extend helper="adhoc"}function adhoc(chk,ctx,bodies,params) {return chk.write("adhoc");}{/extend}{@adhoc/}';
		dust.renderSource(code, {}, function (err, out) {
			assert.equal(out,'adhoc');
		});
	}),
	it('adding a new ad hoc filter', function() {
		var context = {"abc":"123456789"};
		var code = '{@extend filter="size"}function size(value) {return value.length;}{/extend}{abc|size}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'9');
		});
	});
});
