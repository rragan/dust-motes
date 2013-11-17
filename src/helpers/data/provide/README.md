# provide helper, provide rich dust parameter definitions.

## Definition

```
{@provide [optional parameters]}blocks{/provide}

    {@provide [optional params]}
      main block of dust
      {:block1}
        evaluation of this block defines a param named "block1"
      {:block2}
        evaluation of this block defines a param named "block2"
      ... as many blocks as you need params
    {/provide} 

```
## Examples

```
Find the size of an array and pass the value to a partial
{@provide}
  {>partial size=len /}
{:len}
  {@size key=array /}
{/provide}

Create an ad hoc structure to pass to a partial that expects a particular structure
{@provide}
  {>displayAddress data=struct}
{:struct}
  {"street":"{homeStreet}", "city":"{homeCity}", "state": "{homeState}" }
{/provide}
```

## Usage
Depends on dustjs-helpers module to be loaded first since it adds it's definition to the
the dust.helpers property.

In node.js:

require('dustmotes-provide');

In browser:

If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.

