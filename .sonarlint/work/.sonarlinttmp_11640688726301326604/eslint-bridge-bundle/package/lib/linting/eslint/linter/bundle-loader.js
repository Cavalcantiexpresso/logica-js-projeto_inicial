"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBundles = exports.loadCustomRules = void 0;
const core_1 = require("linting/eslint/rules/core");
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const eslint_plugin_react_1 = require("eslint-plugin-react");
const eslint_plugin_1 = require("@typescript-eslint/eslint-plugin");
const eslint_1 = require("linting/eslint");
const custom_rules_1 = require("./custom-rules");
const decoration_1 = require("./decoration");
const helpers_1 = require("helpers");
function loadCustomRules(linter, rules = []) {
    for (const rule of rules) {
        linter.defineRule(rule.ruleId, rule.ruleModule);
    }
}
exports.loadCustomRules = loadCustomRules;
function loadBundles(linter, rulesBundles) {
    for (const bundleId of rulesBundles) {
        loaders[bundleId](linter);
    }
}
exports.loadBundles = loadBundles;
/**
 * Loaders for each of the predefined rules bundles. Each bundle comes with a
 * different data structure (array/record/object), plus on some cases
 * there are specifics that must be taken into account, like ignoring some
 * rules from some bundles or decorating them in order to be compatible.
 */
const loaders = {
    /**
     * Loads external rules
     *
     * The external ESLint-based rules include all the rules that are
     * not implemented internally, in other words, rules from external
     * dependencies which include ESLint core rules. Furthermore, the
     * returned rules are decorated either by internal decorators or by
     * special decorations.
     */
    externalRules(linter) {
        const externalRules = {};
        /**
         * The order of defining rules from external dependencies is important here.
         * Core ESLint rules could be overridden by the implementation from specific
         * dependencies, which should be the default behaviour in most cases. If for
         * some reason a different behaviour is needed for a particular rule, one can
         * specify it in `decorateExternalRules`.
         */
        const dependencies = [core_1.eslintRules, eslint_plugin_1.rules, eslint_plugin_react_1.rules];
        for (const dependencyRules of dependencies) {
            for (const [name, module] of Object.entries(dependencyRules)) {
                externalRules[name] = module;
            }
        }
        linter.defineRules((0, decoration_1.decorateExternalRules)(externalRules));
    },
    /**
     * Loads plugin rules
     *
     * Adds the rules from the Sonar ESLint plugin.
     */
    pluginRules(linter) {
        linter.defineRules(eslint_plugin_sonarjs_1.rules);
    },
    /**
     * Loads internal rules
     *
     * Adds the rules from SonarJS plugin, i.e. rules in path
     * /src/linting/eslint/rules
     */
    internalRules(linter) {
        linter.defineRules(eslint_1.rules);
    },
    /**
     * Loads global context rules
     *
     * Context bundles define a set of external custom rules (like the taint analysis rule)
     * including rule keys and rule definitions that cannot be provided to the linter
     * wrapper using the same feeding channel as rules from the active quality profile.
     */
    contextRules(linter) {
        const { bundles } = (0, helpers_1.getContext)();
        const customRules = [];
        for (const ruleBundle of bundles) {
            const bundle = require(ruleBundle);
            customRules.push(...bundle.rules);
            const ruleIds = bundle.rules.map((r) => r.ruleId);
            (0, helpers_1.debug)(`Loaded rules ${ruleIds} from ${ruleBundle}`);
        }
        loadCustomRules(linter, customRules);
    },
    /**
     * Loads internal custom rules
     *
     * These are rules used internally by SonarQube to have the symbol highlighting and
     * the cognitive complexity metrics.
     */
    internalCustomRules(linter) {
        loadCustomRules(linter, custom_rules_1.customRules);
    },
};
//# sourceMappingURL=bundle-loader.js.map