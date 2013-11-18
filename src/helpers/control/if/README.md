# if helper

Another version of the LinkedIn @if helper which does not use eval.
Note that is supports the existing @if cond="expr" attribute and uses
eval if you use that attribute for compatibility as you migrate away
from using the eval form.

## Definition 

```
{@if test="expr"}block{/if}

test - Mandatory parameter specifying the expression used for the if test.
       If you use the cond="expr" attribute of the current dustjs-helpers @if
       it will work exactly like the current one including the use of eval.
       Try to convert your usages to test="expr". The old form is provided
       for ease of migration.
```
The test="expr" expression is intentionally limited. So what is allowed is:

The variables are restricted to dust names and path  used to access values from the context. 
Constants are JavaScript integer, float, hex and string forms ("xx" or 'xx'). 
Operands can be a "variable", a constant, or a binary or unary expression yielding a value. 
Relational operators are <, >, <=, >=, ==, !=. Boolean operators are ! (unary), || and &&.. 
Operator precedence is the same as JavaScript and parentheses are allowed for clarity or for when the precedence is not what you want.
Expressions are easier to write because names and paths do not have to be wrapped in braces or braces within quotes. E.g. {@if cond="\'{state}\' == 'CA' "} versus {@if test="state == 'CA'}

## Examples
```
Context:
{
  x:1,
  y:2,
  a: {b: 5},
  arr: [1, 2, 3], nums:[1, 2, 3]
}
{@if test="x"}3{/if} is true and outputs 3
{@if test="a.b == 5"}5{/if} is true and outputs 5
{@if test="arr[nums[1]]==3"}3{/if} is true and outputs 3
{@if test="2>1 && 3>=3 && 4==4"}true{/if} outputs true
{@if test=" x && y "}X and Y exist{:else}X and Y do not exists/if} outputs "X and Y exist"
{#arr}{@if test=". < 4"}1{/if}{/arr} outputs 111 because all elements of arr are < 4
{@if test="!!0"}true{:else}false{/if} outputs false
```

## Usage
Depends on dustjs-helpers module to be loaded first since it redefines
the if dust.helpers property.

In node.js:
require('dustmotes-if');

In browser:
If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.


