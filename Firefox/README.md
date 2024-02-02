# Build Instructions

My operating system: macOS Sonoma 14.3
Node version: v20.10.0
NPM Version: 10.2.3

- `cd` into the source code folder
- Run `npm install` to install all dependencies
- Run `npm run build:firefox` to build the addon
- To create the zipped code use `npm run zip:firefox`

Used the [WXT framework](https://wxt.dev/), read more about its publishing instructions [here](https://wxt.dev/guide/publishing.html).

Build script

```
$ npm install
$ npm run build:firefox
```
