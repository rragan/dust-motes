/*global _console: true */
_console = console;
/*global dust: true */
require('dustjs-linkedin');
require('dustjs-helpers');
require('../src/helpers/control/if');
var assert = require('assert');

describe('if tests', function () {
  it("if/test helper simple name", function () {
    var code = '{@if test="x"}3{/if}';
    var context = {
      x: 1
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "3");
    });
  });
  it("if/test helper with path", function () {
    var code = '{@if test="a.b.c.d == 5"}5{/if}';
    var context = {
      a: {
        b: {
          c: {
            d: 5
          }
        }
      }
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "5");
    });
  });
  it("if/test helper with path in bracket", function () {
    var code = '{@if test="arr[nums[1]]==3"}3{/if}';
    var context = {
      "arr": [1, 2, 3],
      nums: [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "3");
    });
  });
  it("if/test helper with parenthesized expr in bracket", function () {
    var code = '{@if test="arr[(1&&0)]"}2{/if}';
    var context = {
      "arr": [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "2");
    });
  });
  it("if/test helper with path with expr in bracket", function () {
    var code = '{@if test="arr[1&&0]"}2{/if}';
    var context = {
      "arr": [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "2");
    });
  });
  it("if/test helper with array with bracket in path", function () {
    var code = '{@if test="arr[0].biz==\'123\'"}123{/if}{$idx}';
    var context = {
      "arr": [{
        "biz": "123"
      }, {
        "biz": "345"
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "123");
    });
  });
  it("if/test helper with path with bracket", function () {
    var code = '{@if test="arr[1]==2"}2{/if}';
    var context = {
      "arr": [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "2");
    });
  });
  it("if/test helper with no body", function () {
    var code = '{@if test="{x}<{y}"/}';
    var context = {
      x: 2,
      y: 3
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with else using the and condition", function () {
    var code = '{@if test="( {x} ) && ({x}==1)"}<div> X exists and is 1 </div>{:else}<div> x is not there </div>{/if}';
    var context = {
      x: 1
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X exists and is 1 </div>");
    });
  });
  it("if/test helper test all relational ops", function () {
    var code = '{@if test="2>1 && 3>=3 && 4==4 && 5!=6 && 8>7 && 9>=9 && 10>=9 && 9<=10"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper without else", function () {
    var code = '{@if test="{x}<{y}"}X < Y{/if}';
    var context = {
      x: 2,
      y: 3
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "X < Y");
    });
  });
  it("if/test helper short-circuit and test ", function () {
    var code = '{@if test="x && x.y"}x.y worked?{:else}false expected{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false expected");
    });
  });
  it("if/test helper short-circuit and test explicit undefined", function () {
    var code = '{@if test="x && x.y"}x.y worked?{:else}false expected{/if}';
    var context = {
      x: undefined
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false expected");
    });
  });
  it("if/test helper short-circuit or test", function () {
    var code = '{@if test="x || y"}true expected{:else}false wrong{/if}';
    var context = {
      x: true
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true expected");
    });
  });
  it("if/test helper short-circuit or test explicit undefined", function () {
    var code = '{@if test="x || y || z"}true expected{:else}false wrong{/if}';
    var context = {
      x: undefined,
      z: true
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true expected");
    });
  });
  it("if/test helper without else using direct names", function () {
    var code = '{@if test="x<y"}<div> X < Y </div>{/if}';
    var context = {
      x: 2,
      y: 3
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X < Y </div>");
    });
  });
  it("if/test helper with else block && operator", function () {
    var code = '{@if test=" \'{x}\' && \'{y}\' "}<div> X and Y exists </div>{:else}<div> X and Y does not exists </div>{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X and Y does not exists </div>");
    });
  });
  it("if/test helper with else block && operator and direct names", function () {
    var code = '{@if test=" x && y "}<div> X and Y exists </div>{:else}<div> X and Y does not exists </div>{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X and Y does not exists </div>");
    });
  });
  it("if/test helper with else using the or condition", function () {
    var code = '{@if test=" \'{x}\' || \'{y}\' "}<div> X or Y exists </div>{:else}<div> X or Y does not exists </div>{/if}';
    var context = {
      x: 1
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X or Y exists </div>");
    });
  });
  it("if/test helper with strings", function () {
    var code = '{@if test="\'abc\' == \'abc\'"}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "1");
    });
  });
  it("if/test helper with strings NEQ", function () {
    var code = '{@if test="\'abc\' != \'abc\'"}1{:else}0{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "0");
    });
  });
  it("if/test helper with use of just number", function () {
    var code = '{@if test=".25"}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "1");
    });
  });
  it("if/test helper with hex operands", function () {
    var code = '{@if test="0xf < 0x10"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper with negative operand", function () {
    var code = '{@if test="-5 < -4"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper with float values", function () {
    var code = '{@if test=".5 < 0.6e+0"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper with other float values", function () {
    var code = '{@if test="5e1 < 6.0e+1"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper with negative float values", function () {
    var code = '{@if test="-.5 < -0.6e+0"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false");
    });
  });
  it("if/test helper with use of .name", function () {
    var code = '{#arr}{@if test=".val == $idx"}{$idx}{/if}{/arr}';
    var context = {
      arr: [{
        "val": 0
      }, {
        "val": 1
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "01");
    });
  });
  it("if/test helper with use of . for current value", function () {
    var code = '{#arr}{@if test=". < 4"}1{/if}{/arr}';
    var context = {
      arr: [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "111");
    });
  });
  it("if/test helper with array with bracket and dot name", function () {
    var code = '{#arr}{@if test=".[0]==$idx"}{$idx}{/if}{/arr}';
    var context = {
      "arr": [
        [0],
        [1]
      ]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "01");
    });
  });
  it("if/test helper with unary operator", function () {
    var code = '{@if test="!0"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper test all relational ops", function () {
    var code = '{@if test="2>1 && 3>=3 && 4==4 && 5!=6 && 8>7 && 9>=9 && 10>=9 && 9<=10"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper test all relational ops using names", function () {
    var code = '{@if test="two>one && three>=three && four==four && five!=six && eight>seven && nine>=nine && ten>=nine && nine<=ten"}true{/if}';
    var context = {
      "one": 1,
      "two": 2,
      "three": 3,
      "four": 4,
      "five": 5,
      "six": 6,
      "seven": 7,
      "eight": 8,
      "nine": 9,
      "ten": 10
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper test all relational ops using paths", function () {
    var code = '{@if test="a.two>a.one && a.three>=a.three && a.four==a.four && a.five!=a.six && a.eight>a.seven && a.nine>=a.nine && a.ten>=a.nine && a.nine<=a.ten"}true{/if}';
    var context = {
      a: {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10
      }
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper test NOT all relational ops and parens", function () {
    var code = '{@if test="!(2>1 && 3>=3 && 4==4 && 5!=6 && 8>7 && 9>=9 && 10>=9 && 9<=10)"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false");
    });
  });
  it("if/test helper with precedence", function () {
    var code = '{@if test="!0 && 5==5"}true{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper adjacent operators OK ||", function () {
    var code = '{@if test="(((4)<2) || (1))"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "true");
    });
  });
  it("if/test helper adjacent operators OK &&", function () {
    var code = '{@if test="(((4)<2) && (1))"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false");
    });
  });
  it("if/test helper with double unary", function () {
    var code = '{@if test="!!0"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "false");
    });
  });
  it("if/test helper with empty brackets err", function () {
    var code = '{@if test="arr[]"}true{:else}false{/if}';
    var context = {
      arr: [1, 2, 3]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with empty parens - error case", function () {
    var code = '{@if test="()"}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with invalid expression - error case", function () {
    var code = '{@if test="2[7]"}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper using $idx", function () {
    var code = '{#list}{@if test="( {$idx} == 1 )"}<div>{y}</div>{/if}{/list}';
    var context = {
      x: 1,
      list: [{
        y: 'foo'
      }, {
        y: 'bar'
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div>bar</div>");
    });
  });
  it("if/test helper using direct $idx", function () {
    var code = '{#list}{@if test=" $idx == 1 "}<div>{y}</div>{/if}{/list}';
    var context = {
      x: 1,
      list: [{
        y: 'foo'
      }, {
        y: 'bar'
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div>bar</div>");
    });
  });
  it("if/test helper using direct $len", function () {
    var code = '{#list}{@if test=" $len == 2 "}2{/if}{/list}';
    var context = {
      x: 1,
      list: [{
        y: 'foo'
      }, {
        y: 'bar'
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "22");
    });
  });
  it("if/test helper with array with bad syntax", function () {
    var code = '{@if test="arr.[0]==\'123\'"}123{/if}{$idx}';
    var context = {
      "arr": [
        [{
          "biz": "123"
        }],
        [{
          "biz": "345"
        }]
      ]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with consecutive operands", function () {
    var code = '{@if test="2 3"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with bad operator", function () {
    var code = '{@if test="2*3"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with unclosed string", function () {
    var code = '{@if test="\'abc"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with unclosed string", function () {
    var code = '{@if test="\'abc"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with invalid number - bad exponent", function () {
    var code = '{@if test="3.25D+27"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with invalid number double dots", function () {
    var code = '{@if test="3..1"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with consecutive periods", function () {
    var code = '{@if test=".."}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with invalid number", function () {
    var code = '{@if test="3.25.8"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with use of a. - invalid name", function () {
    var code = '{@if test="a."}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with use of a..b - invalid name", function () {
    var code = '{@if test="a..b"}1{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if/test helper with consecutive operators", function () {
    var code = '{@if test="==||"}true{:else}false{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if helper with no body using tap", function () {
    var code = '{@if test="{x}<{y}"/}';
    var context = {
      x: 2,
      y: 3
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "");
    });
  });
  it("if helper without else using tap", function () {
    var code = '{@if test="{x}<{y}"}<div> X < Y </div>{/if}';
    var context = {
      x: 2,
      y: 3
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X < Y </div>");
    });
  });
  it("if helper with else block using tap", function () {
    var code = '{@if test=" \'{x}\' && \'{y}\' "}<div> X and Y exists </div>{:else}<div> X and Y does not exists </div>{/if}';
    var context = {};
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X and Y does not exists </div>");
    });
  });
  it("if helper with else using the or condition using tap", function () {
    var code = '{@if test=" \'{x}\' || \'{y}\'"}<div> X or Y exists </div>{:else}<div> X or Y does not exists </div>{/if}';
    var context = {
      x: 1
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X or Y exists </div>");
    });
  });
  it("if helper with else using the and conditon using tap", function () {
    var code = '{@if test="( \'{x}\') && ({x}<3)"}<div> X exists and is 1 </div>{:else}<div> x is not there </div>{/if}';
    var context = {
      x: 1
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div> X exists and is 1 </div>");
    });
  });
  it("if helper using $idx using tap", function () {
    var code = '{#list}{@if test="( {$idx} == 1 )"}<div>{y}</div>{/if}{/list}';
    var context = {
      x: 1,
      list: [{
        y: 'foo'
      }, {
        y: 'bar'
      }]
    };
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, "<div>bar</div>");
    });
  });
});