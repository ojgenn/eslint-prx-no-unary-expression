---
description: 'Disallow unary expressions for number string | null or string | undefined or number  | null or number | undefined on if statements'
---

## Installation
`npm i --save-dev eslint-plugin-no-unary-expression`  
or  
`yarn add --dev eslint-plugin-no-unary-expression`

## Usage

In your `.eslintrc` add `eslint-plugin-no-unary-expression` to the plugin section.

```json
{
  "plugins": ["eslint-plugin-no-unary-expression"],
  "rules": {
    "no-unary-expression/no-unary-expression": 2
  }
}
```

## Rule Details

The following expressions are checked:

- number | null
- number | undefined
- string | null
- string | undefined

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
let a = [1,2,3];
let b = a.find(item => item === 7);
if (!b) {}
```

### ✅ Correct

```ts
let a = [1,2,3];
let b = a.find(item => item === 7);
if (b !== undefined) {}
```
