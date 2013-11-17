# iterate helper, loops over given object.

## Definition 

``
{@iterate key=obj}{$key}-{$value} of type {$type}{~n}{/iter}

key - object of the iteration - Mandatory parameter

sort - Optional. If omitted, no sort is done. Values allowed:
       sort="asc" - sort ascending (per JavaScript array sort rules)
       sort="desc" - sort descending
       sort="fname" - Look for fname object in global context,
       if found, treat it as a JavaScript array sort compare function.
       if not found, result is undefined.
```

Variables $key, $value, and $type are defined within the iteration block

## Example
```
              Data: { obj: {a:"A", b:"B", c:"C" } }

              {@iterate key=obj}
                {$key}:{$value} {$type}
              {/iterate}

              Output: a:A string b:B string c:C string
```

## Usage
Depends on dustjs-helpers module to be loaded first since it defines
the dust.helpers property.

In node.js:
require('dustmotes-iterate');

In browser:
If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.

