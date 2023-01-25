import { Rule } from 'eslint';
/**
 * A decorator of an ESLint rule
 *
 * The purpose of a decorator is to refine the behaviour of external
 * ESLint rules. These refinements can include reducing the noise by
 * adding exceptions, extending the scope of the rule, adding quick fixes, etc.
 */
export declare type RuleDecorator = (rule: Rule.RuleModule) => Rule.RuleModule;
/**
 * The set of internal ESLint rule decorators
 *
 * Once declared here, these decorators are automatically applied
 * to the corresponding rule definitions by the linter's wrapper.
 * There is no further setup required to enable them, except when
 * one needs to test them using ESLint's rule tester.
 */
export declare const decorators: Record<string, RuleDecorator>;
