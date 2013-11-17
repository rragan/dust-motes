# substr helper, Output a substring of a string

## Definition

```
{@substr str=string begin=b end=e len=l /}

str - String
begin - starting character position
end - ending character position
len - length of substring

```

## Example

```
{@substr str="abcdefg" begin="0" end="3"/}
  Output: abc

{@substr str="abcdefg" begin="1" len="4"/}
  Output: bcde
```

## Usage
Depends on dustjs-helpers module to be loaded first since it defines
the dust.helpers property.

In node.js:
require('dustmotes-iterate');

In browser:
If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.

