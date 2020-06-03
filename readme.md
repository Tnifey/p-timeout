# p-timeout (deno)

> Timeout a promise after a specified amount of time
> compatible with deno

## Install

```ts
...
```

## Usage

```ts
import { pTimeout } from "...";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

pTimeout(sleep(200), 500).then(() => "bar"); // bar

pTimeout(sleep(500), 200).then(() => "foo");
//=> [TimeoutError: Promise timed out after 200 milliseconds]
```

## API

### pTimeout(input, milliseconds, message?)

### pTimeout(input, milliseconds, fallback?)

Returns a decorated `input` that times out after `milliseconds` time.

If you pass in a cancelable promise, specifically a promise with a `.cancel()` method, that method will be called when the `pTimeout` promise times out.

#### input

Type: `Promise`

Promise to decorate.

#### milliseconds

Type: `number`

Milliseconds before timing out.

Passing `Infinity` will cause it to never time out.

#### message

Type: `string` `Error`<br>
Default: `'Promise timed out after 50 milliseconds'`

Specify a custom error message or error.

If you do a custom error, it's recommended to sub-class `pTimeout.TimeoutError`.

#### fallback

Type: `Function`

Do something other than rejecting with an error on timeout.

You could for example retry:

```js
import { pTimeout } from "...";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

pTimeout(sleep(100), 50, () => {
	return pTimeout(sleep(100), 300);
});
```

### pTimeout.TimeoutError

Exposed for instance checking and sub-classing.

## Related

- [delay](https://github.com/sindresorhus/p-timeout) - Delay a promise a specified amount of time
