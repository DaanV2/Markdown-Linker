/**
 * Portions of this file are derived from the @actions/core package
 * from the actions/toolkit repository: https://github.com/actions/toolkit
 * 
 * Original code is licensed under the MIT License:
 * 
 * The MIT License (MIT)
 * Copyright 2019 GitHub
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { EOL } from 'os';

export namespace GitHub {
	export function getInput(name: string, options: { required?: boolean; trimWhitespace?: boolean } | undefined): string {
		const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
		if (options && options.required && !val) {
			throw new Error(`Input required and not supplied: ${name}`);
		}
		if (options && options.trimWhitespace === false) {
			return val;
		}
		return val.trim();
	}

	export function getMultilineInput(name: string, options: { trimWhitespace?: boolean } | undefined): string[] {
		const inputs = getInput(name, options)
			.split('\n')
			.filter(x => x !== '');
		if (options && options.trimWhitespace === false) {
			return inputs;
		}
		return inputs.map(input => input.trim());
	}

	export function setFailed(message: string) {
		process.exitCode = 1; // mark process as failed
		error(message);
	}

	export function error(message: string, properties = {}) {
		outputCommand('error', properties, message);
	}
	export function warning(message: string, properties = {}) {
		outputCommand('warning', properties, message);
	}
	export function notice(message: string, properties = {}) {
		outputCommand('notice', properties, message);
	}
	export function info(message: string, properties = {}) {
		outputCommand('info', properties, message);
	}
	export function debug(message: string, properties = {}) {
		outputCommand('debug', properties, message);
	}

	/**
	 * Begin an output group.
	 *
	 * Output until the next `groupEnd` will be foldable in this group
	 *
	 * @param name The name of the output group
	 */
	export function startGroup(name: string) {
		outputCommand('group', {}, name);
	}
	exports.startGroup = startGroup;
	/**
	 * End an output group.
	 */
	export function endGroup() {
		outputCommand('endgroup', {});
	}
	/**
	 * Wrap an asynchronous function call in a group.
	 *
	 * Returns the same type as the function itself.
	 *
	 * @param name The name of the group
	 * @param fn The function to wrap in the group
	 */
	export async function group<T>(name: string, fn: () => Promise<T>): Promise<T> {
		startGroup(name);
		try {
			return await fn();
		}
		finally {
			endGroup();
		}
	}
}

/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function outputCommand(command: string, properties: { [key: string]: any }, message?: string) {
	const props = Object
		.entries(properties || {})
		.map(([key, val]) => `${key}=${escapeProperty(val)}`)
		.join(',');

	process.stdout.write(`::${command}${props.length > 0 ? ' ' : ''}${props}::${escapeData(message)}${EOL}`);
}

function escapeData(s: string | undefined | null): string {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s: string | undefined | null): string {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}

/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input: string | String | null | undefined): string | String {
	if (input === null || input === undefined) {
		return '';
	}
	else if (typeof input === 'string' || input instanceof String) {
		return input;
	}
	return JSON.stringify(input);
}