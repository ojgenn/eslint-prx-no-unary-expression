"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const typescript_1 = require("typescript");
module.exports = {
    name: 'no-unary-expression',
    meta: {
        docs: {
            description: 'No unary expression',
            recommended: 'error',
            category: 'Possible Errors',
        },
        messages: {
            noUnaryExpression: 'Use value !== null or value !== undefined etc',
        },
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        const parserServices = experimental_utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        function getConstrainedTypeAtLocation(checker, node) {
            const nodeType = checker.getTypeAtLocation(node);
            const constrained = checker.getBaseConstraintOfType(nodeType);
            return constrained !== null && constrained !== void 0
                ? constrained
                : nodeType;
        }
        function getNodeType(node) {
            const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
            return getConstrainedTypeAtLocation(checker, tsNode);
        }
        return {
            UnaryExpression(node) {
                if (node.operator !== '!') {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const { kind, types } = checker.typeToTypeNode(getNodeType(node.argument));
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (node.parent.operator === '!') {
                    return;
                }
                if (kind === typescript_1.SyntaxKind.UnionType) {
                    const typesAsSyntaxKind = types.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (item) => item.kind);
                    const hasNull = typesAsSyntaxKind.includes(typescript_1.SyntaxKind.NullKeyword);
                    const hasUndefined = typesAsSyntaxKind.includes(typescript_1.SyntaxKind.UndefinedKeyword);
                    const hasNumber = typesAsSyntaxKind.includes(typescript_1.SyntaxKind.NumberKeyword);
                    const hasString = typesAsSyntaxKind.includes(typescript_1.SyntaxKind.StringKeyword);
                    if ((hasNumber && hasUndefined) ||
                        (hasNumber && hasNull) ||
                        (hasString && hasNull) ||
                        (hasString && hasUndefined)) {
                        context.report({
                            messageId: 'noUnaryExpression',
                            node,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-unary-expression.js.map