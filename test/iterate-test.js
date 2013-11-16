_console = console;
dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/control/iterate');
var assert = require('assert');

var compareNumbers = function(a,b) {var aa= parseInt(a, 10); var bb = parseInt(b, 10);return aa-bb;}

describe('iterate', function() {
	it('simple object iteration', function() {
		var context = { obj: {a:"A", b:"B", c:"C" } };
		var code = '{@iterate key=obj}{$key}:{$value} {$type} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'a:A string b:B string c:C string ');
		});
	}),
	it('iterate ascending sort', function() {
		var context = { obj: {c:"C", a:"A", b:"B" } };
		var code = '{@iterate key=obj sort="asc"}{$key}:{$value} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'a:A b:B c:C ');
		});
	}),
	it('iterate descending sort', function() {
		var context = { obj: {c:"C", a:"A", b:"B" } };
		var code = '{@iterate key=obj sort="desc"}{$key}:{$value} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'c:C b:B a:A ');
		});
	}),
	it('iterate no key param', function() {
		var context = { };
		var code = '{@iterate foo=1}{$key}{/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'');
		});
	}),
	it('iterate helper pass array obj for key', function() {
		var context = {arr: [1,2,3]};
		var code = '{@iterate key=arr}{$key}:{$value} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'0:1 1:2 2:3 ');
		});
	}),
	it('iterate helper pass string obj for key', function() {
		var context = {name: "dust"};
		var code = '{@iterate key=name}{$key}:{$value} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'0:d 1:u 2:s 3:t ');
		});
	}),
	it('iterate with user-supplied compare function for numeric sort', function() {
		var context = { obj: {10:"C", 1:"A", 300:"B" } };
                var base = dust.makeBase({"compareNumbers": compareNumbers});
		var code = '{@iterate key=obj sort="compareNumbers"}{$key}:{$value} {/iterate}';
		dust.renderSource(code, base.push(context), function (err, out) {
			assert.equal(out,'1:A 10:C 300:B ');
		});
	}),
	it('iterate helper showing types', function() {
		var context = { obj: {a:"A", b:2, c:[1,2], d:{a:4}, e:true, f:null, g:undefined, h:function f(){}} };
		var code = '{@iterate key=obj}{$key} {$type} {/iterate}';
		dust.renderSource(code, context, function (err, out) {
			assert.equal(out,'a string b number c object d object e boolean f object g undefined h function ');
		});
	});
});
