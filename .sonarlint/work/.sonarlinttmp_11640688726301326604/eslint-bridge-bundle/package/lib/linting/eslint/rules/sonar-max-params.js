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
// https://sonarsource.github.io/rspec/#/rspec/S107/javascript
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./decorators/helpers");
const core_1 = require("./core");
const helpers_2 = require("./helpers");
const eslintMaxParams = core_1.eslintRules['max-params'];
exports.rule = {
    meta: {
        messages: { ...(_a = eslintMaxParams.meta) === null || _a === void 0 ? void 0 : _a.messages },
    },
    create(context) {
        /**
         * Decorates ESLint `max-params` to ignore TypeScript constructor when its parameters
         * are all parameter properties, e.g., `constructor(private a: any, public b: any) {}`.
         */
        const ruleDecoration = (0, helpers_1.interceptReport)(eslintMaxParams, function (context, descriptor) {
            if ('node' in descriptor) {
                const functionLike = descriptor.node;
                if (!isException(functionLike)) {
                    context.report(descriptor);
                }
            }
            function isException(functionLike) {
                return hasOnlyParameterProperties(functionLike) || isAngularConstructor(functionLike);
            }
            function hasOnlyParameterProperties(functionLike) {
                return functionLike.params.every(param => param.type === 'TSParameterProperty');
            }
            function isAngularConstructor(functionLike) {
                var _a;
                /** A constructor is represented as MethodDefinition > FunctionExpression */
                const maybeConstructor = functionLike.parent;
                if (!isConstructor(maybeConstructor)) {
                    return false;
                }
                /** A component is represented as ClassDeclaration > ClassBody */
                const maybeComponent = (_a = maybeConstructor.parent) === null || _a === void 0 ? void 0 : _a.parent;
                if (!isAngularComponent(maybeComponent)) {
                    return false;
                }
                return true;
                function isConstructor(node) {
                    return ((node === null || node === void 0 ? void 0 : node.type) === 'MethodDefinition' &&
                        (0, helpers_2.isIdentifier)(node.key, 'constructor'));
                }
                function isAngularComponent(node) {
                    var _a;
                    return ((node === null || node === void 0 ? void 0 : node.type) === 'ClassDeclaration' &&
                        ((_a = node.decorators) === null || _a === void 0 ? void 0 : _a.some(decorator => {
                            var _a;
                            const node = decorator.expression;
                            return ((0, helpers_2.isFunctionCall)(node) &&
                                (0, helpers_2.isIdentifier)(node.callee, 'Component') &&
                                ((_a = (0, helpers_2.getModuleNameOfImportedIdentifier)(context, node.callee)) === null || _a === void 0 ? void 0 : _a.value) === '@angular/core');
                        })));
                }
            }
        });
        /**
         * Extends ESLint `max-params` to detect TypeScript function
         * declarations, e.g., `function f(p: any): any;`.
         */
        const ruleExtension = {
            meta: {
                messages: { ...ruleDecoration.meta.messages },
            },
            create(context) {
                return {
                    TSDeclareFunction: checkFunction,
                    TSEmptyBodyFunctionExpression: checkFunction,
                };
                function checkFunction(node) {
                    const functionLike = node;
                    const maxParams = context.options[0];
                    const numParams = functionLike.params.length;
                    if (numParams > maxParams) {
                        context.report({
                            messageId: 'exceed',
                            loc: getFunctionHeaderLocation(functionLike),
                            data: {
                                name: getFunctionNameWithKind(functionLike),
                                count: numParams.toString(),
                                max: maxParams.toString(),
                            },
                        });
                    }
                    function getFunctionHeaderLocation(functionLike) {
                        const sourceCode = context.getSourceCode();
                        const functionNode = (functionLike.type === 'TSEmptyBodyFunctionExpression'
                            ? functionLike.parent
                            : functionLike);
                        const headerStart = sourceCode.getFirstToken(functionNode);
                        const headerEnd = sourceCode.getFirstToken(functionNode, token => token.value === '(');
                        return {
                            start: headerStart.loc.start,
                            end: headerEnd.loc.start,
                        };
                    }
                    function getFunctionNameWithKind(functionLike) {
                        let name;
                        let kind = 'function';
                        switch (functionLike.type) {
                            case 'TSDeclareFunction':
                                kind = 'Function declaration';
                                if (functionLike.id) {
                                    name = functionLike.id.name;
                                }
                                break;
                            case 'TSEmptyBodyFunctionExpression':
                                kind = 'Empty function';
                                const parent = functionLike.parent;
                                if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'MethodDefinition' && parent.key.type === 'Identifier') {
                                    name = parent.key.name;
                                }
                                break;
                        }
                        if (name) {
                            return `${kind} '${name}'`;
                        }
                        else {
                            return kind;
                        }
                    }
                }
            },
        };
        const decorationListeners = ruleDecoration.create(context);
        const extensionListeners = ruleExtension.create(context);
        return (0, helpers_1.mergeRules)(decorationListeners, extensionListeners);
    },
};
//# sourceMappingURL=sonar-max-params.js.map