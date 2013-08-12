dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/strings/substr.js');
var assert = require('assert');

describe('Substr', function() {
	it('substr begin/end', function() {
		var code = '{@substr str="abcdefg" begin="0" end="3"/}';
		dust.renderSource(code, {}, function (err, out) {
			assert.equal(out,'abc');
		});
	}),
	it('substr begin/end from context', function() {
		var context = {abc:"abcdefghijkl"};
		var code = '{@substr str=abc begin="0" end="3"/}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'abc');
		});
	}),
	it('substr no begin/end/len return all of str', function() {
		var code = '{@substr str="abcdef"/}';
		dust.renderSource(code, {}, function (err, out) {
			assert.equal(out,'abcdef');
		});
	}),
	it('substr no begin param, then it defaults to zero', function() {
		var code = '{@substr str="abcdef" len=5/}';
		dust.renderSource(code, {}, function (err, out) {
			assert.equal(out,'abcde');
		});
	}),
	it('substr begin/len', function() {
		var code = '{@substr str="abcdefg" begin="1" len="4"/}';
		dust.renderSource(code, {}, function (err, out) {
			assert.equal(out,'bcde');
		});
	});
});
