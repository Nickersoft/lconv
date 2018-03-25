# lconv
lconv is a tiny JavaScript module for converting between ISO 639 language codes. We know, we know, there are a bunch of libraries that do this out
there already. So why make our own? Well this module pulls data *directly* from the [official SIL website](http://www-01.sil.org/iso639-3/codes.asp), and has the ability to 
download the latest offline data. As a result, this library supports *every language* whether it's dead, dying, deceased,
active, historic, literary... you name it!
 
This library also supports ISO code resolution. Say, for example, you're looking up the Cantonese Language code `yue`, 
which only exists as an ISO 639-3 language code. Therefore, requesting the ISO 639-1 code for Cantonese would return 
`null`. *However,* Cantonese belongs to the Chinese macro-language, which *does* have an ISO 639-1 code. If we resolve
the Cantonese language code to Chinese, then we'll get `zh` back instead of `null`. Pretty neat, eh?

## Generating Data
If you do for some reason clone this repo, to generate the JSON data file needed for the module to run, just run:

```bash
$ npm run data
```

## Testing
We'll... umm... add tests at some point. Check back later.