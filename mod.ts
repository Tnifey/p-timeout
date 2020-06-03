"use strict";

export class TimeoutError extends Error {
	readonly name: "TimeoutError";

	constructor(message?: string) {
		super(message);
		this.name = "TimeoutError";
	}
}

/**
	Timeout a promise after a specified amount of time.

	If you pass in a cancelable promise, specifically a promise with a `.cancel()` method, that method will be called when the `pTimeout` promise times out.

	@param input - Promise to decorate.
	@param milliseconds - Milliseconds before timing out.
	@param message - Specify a custom error message or error. If you do a custom error, it's recommended to sub-class `pTimeout.TimeoutError`. Default: `'Promise timed out after 50 milliseconds'`.
	@returns A decorated `input` that times out after `milliseconds` time.

	@example
	```
	import delay = require('delay');
	import pTimeout = require('p-timeout');

	const delayedPromise = delay(200);

	pTimeout(delayedPromise, 50).then(() => 'foo');
	//=> [TimeoutError: Promise timed out after 50 milliseconds]
	```
	*/
export function pTimeout<T>(
	input: Promise<T>,
	milliseconds: number,
	message?: string | Error
): Promise<T>;

/**
	Timeout a promise after a specified amount of time.

	If you pass in a cancelable promise, specifically a promise with a `.cancel()` method, that method will be called when the `pTimeout` promise times out.

	@param input - Promise to decorate.
	@param milliseconds - Milliseconds before timing out. Passing `Infinity` will cause it to never time out.
	@param fallback - Do something other than rejecting with an error on timeout. You could for example retry.
	@returns A decorated `input` that times out after `milliseconds` time.

	@example
	```
	import delay = require('delay');
	import pTimeout = require('p-timeout');

	const delayedPromise = () => delay(200);

	pTimeout(delayedPromise(), 50, () => {
		return pTimeout(delayedPromise(), 300);
	});
	```
	*/
export function pTimeout<T>(
	input: Promise<T>,
	milliseconds: number,
	fallback: () => T | Promise<T>
): Promise<T>;

export function pTimeout<T>(
	promise: Promise<T>,
	milliseconds: number,
	fallback?: string | Error | (() => T | Promise<T>)
): Promise<T> {
	return new Promise((resolve, reject) => {
		if (typeof milliseconds !== "number" || milliseconds < 0) {
			throw new TypeError("Expected `milliseconds` to be a positive number");
		}

		if (milliseconds === Infinity) {
			resolve(promise);
			return;
		}

		const timer = setTimeout(() => {
			if (typeof fallback === "function") {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			const message =
				typeof fallback === "string"
					? fallback
					: `Promise timed out after ${milliseconds} milliseconds`;

			const timeoutError =
				fallback instanceof Error ? fallback : new TimeoutError(message);

			if (typeof (promise as any).cancel === "function") {
				(promise as any).cancel();
			}

			reject(timeoutError);
		}, milliseconds);

		promise.then(resolve, reject).finally(() => clearTimeout(timer));
	});
}

export default pTimeout;
