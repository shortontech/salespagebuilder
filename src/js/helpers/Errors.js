/**
 * @class InvalidElementError
 * @extends Error
 * @description This error is thrown when an element is invalid.
 * @param {String} message - The error message.
 * @example
 * const element = document.querySelector('#my-element')
 * if (!element instanceof HTMLElement) {
 *   throw new InvalidElementError('Element is invalid')
 * }
 */
export class InvalidElementError extends Error {
  constructor(message) {
    super(message)
    this.message = message;
    this.name = "InvalidElementError";
    // this.stack = <call stack>; // non-standard, but most environments support it
  }
}
/**
 * @class UnexpectedError
 * @extends Error
 * @description This error is thrown when an unexpected error occurs.
 * @param {String} message - The error message.
 */
export class UnexpectedError extends Error{
  constructor(message) {
    super(message)
    this.message = message;
    this.name = "UnexpectedError";
  }
}