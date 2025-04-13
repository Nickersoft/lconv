# lconv
lconv is a tiny JavaScript module for converting between ISO 639 language codes, as well as ISO code resolution. 

Say, for example, you're looking up the Cantonese Language code `yue`, which only exists as an ISO 639-3 language code. Therefore, requesting the ISO 639-1 code for Cantonese would return `null`. *However,* Cantonese belongs to the Chinese macro-language, which *does* have an ISO 639-1 code. If we resolve the Cantonese language code to Chinese, then we'll get `zh` back instead of `null`. 

Pretty neat, eh?

## Using the API

To use lconv is extremely simple. Use it like this:

```typescript
import { convert } from 'lconv';

convert('English', { from: 'label', to: 2 }); // ==> eng
convert('eng', { from: 3, to: 1 }); // 
convert('yue', { from: 3, to: 1, resolve: true }); // ==> zh
```

You can also retrieve language objects directly based on a string, optionally and explicitly specifying the format you're using:

```typescript
import { getLanguage } from 'lconv';

getLanguage('English');
getLanguage("en", 1);
```

This will return all language codes and a human-readable language name, as well as language type and status.

`convert` takes three options:

- **from:** The ISO code of the given string. Can be either 1, 2, 3, or "label". If it is not provided it will be guessed.
- **to:** The ISO code to convert to. Can be either 1, 2, 3, or "label". If it is not provided it will be guessed. 
- **resolve:** Boolean denoting whether to resolve language codes or not. By default this is set to "false".

## Generating Data

If you do for some reason clone this repo, to generate the JSON data file needed for the module to run, just run:

```bash
$ pnpm run import
```

