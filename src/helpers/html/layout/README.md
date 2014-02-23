# layout helper 

Page layout support with multi-level inheritance

## Definition

```
{@layout base=string}blocks{/layout}

base - name of parent template
```

## Example

Base templates are written using the normal dust {+xxx} syntax for replaceable content blocks.

```
base_template.dust
Start{~n}{+title}Base Title{/title}{~n}{+main}Base Content{/main}{~n}End
```
Then using

{@layout base="base_template"}{:title}Child title{:main}Child Content{/layout}

will output

```
Start
Child title
Child Content
End
```

If either the title or main block was omitted, the default value from the
base template will be output.

If params are supplied on the @layout, then they can be referenced in the base template for 
substitution and in the definition blocks defining the subsitutions in the layout.

## Usage
Depends on dustjs-helpers module to be loaded first since it defines
the dust.helpers property.

In node.js:
require('dustmotes-layout');

In browser:
If not using require, load the JS some other way and call it with the dust object. As noted earlier,
dustjs-helpers must be loaded earlier.

