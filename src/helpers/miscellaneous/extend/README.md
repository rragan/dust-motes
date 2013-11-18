# extend helper 

Define ad hoc custom helper or filter

## Definition

```
{@extend helper=string|filter=string /}code{/extend}

helper - name of the helper

filter - name of the filter
```

## Example

```
{@extend helper="assist"}
function assist (chk, ctx, bodies, params) {
        var key = dust.helpers.tap(params.key, chk, ctx);
        return chk.write(key + key);
}
{/extend}

{@assist key="go"/}


{@extend filter="my"}
function myfilter(string) {return "***" + string + "***"; };
{/extend}

FILTERED: {str | my}
```

## Usage
Depends on dustjs-helpers module to be loaded first since it defines
the dust.helpers property.

In node.js:
require('dustmotes-extend');

In browser:
If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.

