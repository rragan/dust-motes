_console = console;
dust = require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/html/layout');
var assert = require('assert');

var body = 'Start{+title}Base Title{/title}{+main}Base Content{/main}{+foot}base footer{/foot}End';
var compiled = dust.compile(body, "base_template");
dust.loadSource(compiled);
var body = '{@layout base="base_template"}{:title}ttl{:main}child{/layout}';
var compiled = dust.compile(body, "child_template");
dust.loadSource(compiled);
var body = '{@layout base="base_template"}{:title}ttl{:main}child{:foot}child footer{/layout}';
var compiled = dust.compile(body, "child_template_footer");
dust.loadSource(compiled);

describe('layout', function () {
  it('show base defaults', function () {
    var context = {};
    var code = '{@layout base="base_template"}{/layout}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'StartBase TitleBase Contentbase footerEnd');
    });
  }),
  it('replace base defaults', function () {
    var context = {};
    var code = '{@layout base="base_template"}{:title}ttl{:main}child{:foot}pod{/layout}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'StartttlchildpodEnd');
    });
  }),
  it('partial replace  base defaults', function () {
    var context = {};
    var code = '{@layout base="base_template"}{:main}child{/layout}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'StartBase Titlechildbase footerEnd');
    });
  }),
  it('two level inheritance - all values from immediate child', function () {
    var context = {};
    var code = '{@layout base="child_template_footer"}{:title}wee title{:main}wee content{:foot}wee foot{/layout}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'Startwee titlewee contentwee footEnd');
    });
  }),
  it('two level inheritance but get a value from base template', function () {
    var context = {};
    var code = '{@layout base="child_template"}{:title}wee title{:main}wee content{/layout}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'Startwee titlewee contentbase footerEnd');
    });
  });
});
