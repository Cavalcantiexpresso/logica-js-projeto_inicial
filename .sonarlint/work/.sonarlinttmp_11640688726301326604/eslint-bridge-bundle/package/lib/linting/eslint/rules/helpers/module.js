"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceTo = exports.reduceToIdentifier = exports.getFullyQualifiedName = exports.hasFullyQualifiedName = exports.getModuleAndCalledMethod = exports.isCallToFQN = exports.getModuleNameFromRequire = exports.getRequireCalls = exports.getImportDeclarations = exports.getModuleNameOfImportedIdentifier = exports.getModuleNameOfNode = exports.getModuleNameOfIdentifier = void 0;
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
const assert_1 = __importDefault(require("assert"));
const ast_1 = require("./ast");
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
function getModuleNameOfIdentifier(context, identifier) {
    const { name } = identifier;
    // check if importing using `import * as X from 'module_name'`
    const importDeclaration = getImportDeclarations(context).find(importDecl => (0, ast_1.isNamespaceSpecifier)(importDecl, name) || (0, ast_1.isDefaultSpecifier)(importDecl, name));
    if (importDeclaration) {
        return importDeclaration.source;
    }
    // check if importing using `const X = require('module_name')`
    const writeExpression = (0, ast_1.getUniqueWriteUsage)(context, name);
    if (writeExpression) {
        return getModuleNameFromRequire(writeExpression);
    }
    return undefined;
}
exports.getModuleNameOfIdentifier = getModuleNameOfIdentifier;
/**
 * Returns the module name of either a directly `require`d or referenced module in
 * the following cases:
 *
 *  1. If `node` is a `require('m')` call;
 *  2. If `node` is an identifier `i` bound by an import, as in `import i from 'm'`;
 *  3. If `node` is an identifier `i`, and there is a single assignment with a `require`
 *     on the right hand side, i.e. `var i = require('m')`;
 *
 * then, in all three cases, the returned value will be the name of the module `'m'`.
 *
 * @param node the expression that is expected to evaluate to a module
 * @param context the rule context
 * @return literal with the name of the module or `undefined`.
 */
function getModuleNameOfNode(context, node) {
    if (node.type === 'Identifier') {
        return getModuleNameOfIdentifier(context, node);
    }
    else {
        return getModuleNameFromRequire(node);
    }
}
exports.getModuleNameOfNode = getModuleNameOfNode;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
function getModuleNameOfImportedIdentifier(context, identifier) {
    // check if importing using `import { f } from 'module_name'`
    const importedDeclaration = getImportDeclarations(context).find(({ specifiers }) => specifiers.some(spec => spec.type === 'ImportSpecifier' && spec.imported.name === identifier.name));
    if (importedDeclaration) {
        return importedDeclaration.source;
    }
    // check if importing using `const f = require('module_name').f` or `const { f } = require('module_name')`
    const writeExpression = (0, ast_1.getUniqueWriteUsage)(context, identifier.name);
    if (writeExpression) {
        let maybeRequireCall;
        if (writeExpression.type === 'MemberExpression' &&
            (0, ast_1.isIdentifier)(writeExpression.property, identifier.name)) {
            maybeRequireCall = writeExpression.object;
        }
        else {
            maybeRequireCall = writeExpression;
        }
        return getModuleNameFromRequire(maybeRequireCall);
    }
    return undefined;
}
exports.getModuleNameOfImportedIdentifier = getModuleNameOfImportedIdentifier;
function getImportDeclarations(context) {
    const program = context.getSourceCode().ast;
    if (program.sourceType === 'module') {
        return program.body.filter(node => node.type === 'ImportDeclaration');
    }
    return [];
}
exports.getImportDeclarations = getImportDeclarations;
function getRequireCalls(context) {
    const required = [];
    const { scopeManager } = context.getSourceCode();
    scopeManager.scopes.forEach(scope => scope.variables.forEach(variable => variable.defs.forEach(def => {
        if (def.type === 'Variable' && def.node.init) {
            if (isRequire(def.node.init)) {
                required.push(def.node.init);
            }
            else if (def.node.init.type === 'MemberExpression' && isRequire(def.node.init.object)) {
                required.push(def.node.init.object);
            }
        }
    })));
    return required;
}
exports.getRequireCalls = getRequireCalls;
function isRequire(node) {
    return (node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1);
}
function getModuleNameFromRequire(node) {
    if (node.type === 'CallExpression' &&
        (0, ast_1.isIdentifier)(node.callee, 'require') &&
        node.arguments.length === 1) {
        const moduleName = node.arguments[0];
        if (moduleName.type === 'Literal') {
            return moduleName;
        }
    }
    return undefined;
}
exports.getModuleNameFromRequire = getModuleNameFromRequire;
function isCallToFQN(context, callExpression, moduleName, functionName) {
    const { callee } = callExpression;
    if (callee.type !== 'MemberExpression') {
        return false;
    }
    const module = getModuleNameOfNode(context, callee.object);
    return (module === null || module === void 0 ? void 0 : module.value) === moduleName && (0, ast_1.isIdentifier)(callee.property, functionName);
}
exports.isCallToFQN = isCallToFQN;
function getModuleAndCalledMethod(callee, context) {
    let module;
    let method;
    if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
        module = getModuleNameOfIdentifier(context, callee.object);
        method = callee.property;
    }
    if (callee.type === 'Identifier') {
        module = getModuleNameOfImportedIdentifier(context, callee);
        method = callee;
    }
    return { module, method };
}
exports.getModuleAndCalledMethod = getModuleAndCalledMethod;
/**
 * Checks that an ESLint member expression matches a fully qualified name
 *
 * A fully qualified name here denotes a value that is accessed through an imported
 * symbol, e.g., `foo.bar.baz` where `foo` was imported either from a require call
 * or an import statement:
 *
 * ```
 * const foo = require('lib');
 * foo.bar.baz.qux; // matches the fully qualified name ['lib', 'bar', 'baz', 'qux']
 * ```
 *
 * @param context the rule context
 * @param expr the member expression
 * @param qualifiers the qualifiers to match
 */
function hasFullyQualifiedName(context, expr, ...qualifiers) {
    (0, assert_1.default)(qualifiers.length >= 2, 'A fully qualified name should include two qualifiers at least.');
    let node = expr;
    while (node.type === 'MemberExpression') {
        const qualifier = qualifiers.pop();
        if (!qualifier || !(0, ast_1.isIdentifier)(node.property, qualifier)) {
            return false;
        }
        node = node.object;
    }
    if (node.type !== 'Identifier') {
        return false;
    }
    const module = getModuleNameOfImportedIdentifier(context, node);
    const qualifier = qualifiers.pop();
    if (!qualifier || (module === null || module === void 0 ? void 0 : module.value) !== qualifier) {
        return false;
    }
    return qualifiers.length === 0;
}
exports.hasFullyQualifiedName = hasFullyQualifiedName;
/**
 * Returns the fully qualified name of ESLint node
 *
 * A fully qualified name here denotes a value that is accessed through an imported
 * symbol, e.g., `foo.bar.baz` where `foo` was imported either from a require call
 * or an import statement:
 *
 * ```
 * const foo = require('lib');
 * foo.bar.baz.qux; // matches the fully qualified name ['lib', 'bar', 'baz', 'qux']
 * const foo2 = require('lib').bar;
 * foo2.baz.qux; // matches the fully qualified name ['lib', 'bar', 'baz', 'qux']
 * ```
 *
 * Returns null when an FQN could not be found.
 *
 * @param context the rule context
 * @param node the node
 * @param fqn the already traversed FQN (for recursive calls)
 * @param scope scope to look for the variable definition, used in recursion not to
 *              loop over same variable always in the lower scope
 */
function getFullyQualifiedName(context, node, fqn = [], scope) {
    var _a, _b, _c, _d;
    let nodeToCheck = reduceToIdentifier(node, fqn);
    if (!(0, ast_1.isIdentifier)(nodeToCheck)) {
        return null;
    }
    const variable = (0, ast_1.getVariableFromScope)(scope || context.getScope(), nodeToCheck.name);
    if (!variable || variable.defs.length > 1) {
        return null;
    }
    const definition = variable.defs.find(({ type }) => ['ImportBinding', 'Variable'].includes(type));
    if (!definition) {
        return null;
    }
    // imports
    if (definition.type === 'ImportBinding') {
        const specifier = definition.node;
        const importDeclaration = definition.parent;
        // import {default as cdk} from 'aws-cdk-lib';
        // vs.
        // import { aws_s3 as s3 } from 'aws-cdk-lib';
        if (specifier.type === 'ImportSpecifier' && ((_a = specifier.imported) === null || _a === void 0 ? void 0 : _a.name) !== 'default') {
            fqn.unshift((_b = specifier.imported) === null || _b === void 0 ? void 0 : _b.name);
        }
        if (typeof ((_c = importDeclaration.source) === null || _c === void 0 ? void 0 : _c.value) === 'string') {
            const importedQualifiers = importDeclaration.source.value.split('/');
            fqn.unshift(...importedQualifiers);
            return fqn.join('.');
        }
    }
    const value = (0, ast_1.getUniqueWriteReference)(variable);
    // requires
    if (definition.type === 'Variable' && value) {
        // case for `const {Bucket} = require('aws-cdk-lib/aws-s3');`
        // case for `const {Bucket: foo} = require('aws-cdk-lib/aws-s3');`
        if (definition.node.id.type === 'ObjectPattern') {
            for (const property of definition.node.id.properties) {
                if (property.value === definition.name) {
                    fqn.unshift(property.key.name);
                }
            }
        }
        const nodeToCheck = reduceTo('CallExpression', value, fqn);
        const module = (_d = getModuleNameFromRequire(nodeToCheck)) === null || _d === void 0 ? void 0 : _d.value;
        if (typeof module === 'string') {
            const importedQualifiers = module.split('/');
            fqn.unshift(...importedQualifiers);
            return fqn.join('.');
        }
        else {
            return getFullyQualifiedName(context, nodeToCheck, fqn, variable.scope);
        }
    }
    return null;
}
exports.getFullyQualifiedName = getFullyQualifiedName;
/**
 * Helper function for getFullyQualifiedName to handle Member expressions
 * filling in the FQN array with the accessed properties.
 * @param node the Node to traverse
 * @param fqn the array with the qualifiers
 */
function reduceToIdentifier(node, fqn = []) {
    return reduceTo('Identifier', node, fqn);
}
exports.reduceToIdentifier = reduceToIdentifier;
/**
 * Reduce a given node through its ancestors until a given node type is found
 * filling in the FQN array with the accessed properties.
 * @param type the type of node you are looking for to be returned. Returned node still needs to be
 *             checked as its type it's not guaranteed to match the passed type.
 * @param node the Node to traverse
 * @param fqn the array with the qualifiers
 */
function reduceTo(type, node, fqn = []) {
    let nodeToCheck = node;
    while (nodeToCheck.type !== type) {
        if (nodeToCheck.type === 'MemberExpression') {
            const { property } = nodeToCheck;
            if (property.type === 'Literal' && typeof property.value === 'string') {
                fqn.unshift(property.value);
            }
            else if (property.type === 'Identifier') {
                fqn.unshift(property.name);
            }
            nodeToCheck = nodeToCheck.object;
        }
        else if (nodeToCheck.type === 'CallExpression' && !getModuleNameFromRequire(nodeToCheck)) {
            nodeToCheck = nodeToCheck.callee;
        }
        else if (nodeToCheck.type === 'NewExpression') {
            nodeToCheck = nodeToCheck.callee;
        }
        else if (nodeToCheck.type === 'ChainExpression') {
            nodeToCheck = nodeToCheck.expression;
        }
        else if (nodeToCheck.type === 'TSNonNullExpression') {
            nodeToCheck = nodeToCheck.expression;
        }
        else {
            break;
        }
    }
    return nodeToCheck;
}
exports.reduceTo = reduceTo;
//# sourceMappingURL=module.js.map