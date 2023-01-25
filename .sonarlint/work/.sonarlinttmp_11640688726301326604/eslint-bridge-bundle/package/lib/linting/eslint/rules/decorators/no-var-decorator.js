"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateNoVar = void 0;
const helpers_1 = require("./helpers");
function decorateNoVar(rule) {
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const { node, ...rest } = reportDescriptor;
            const { declarations: [firstDecl, ..._], } = node;
            const varToken = context.getSourceCode().getTokenBefore(firstDecl.id);
            const identifierEnd = firstDecl.id.loc.end;
            if (varToken == null) {
                // impossible
                return;
            }
            context.report({
                loc: {
                    start: varToken.loc.start,
                    end: identifierEnd,
                },
                ...rest,
            });
        }
    });
}
exports.decorateNoVar = decorateNoVar;
//# sourceMappingURL=no-var-decorator.js.map