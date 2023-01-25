import { Linter } from 'eslint';
import { CustomRule } from './custom-rules';
export declare function loadCustomRules(linter: Linter, rules?: CustomRule[]): void;
export declare function loadBundles(linter: Linter, rulesBundles: (keyof typeof loaders)[]): void;
/**
 * Loaders for each of the predefined rules bundles. Each bundle comes with a
 * different data structure (array/record/object), plus on some cases
 * there are specifics that must be taken into account, like ignoring some
 * rules from some bundles or decorating them in order to be compatible.
 */
declare const loaders: {
    [key: string]: Function;
};
export {};
