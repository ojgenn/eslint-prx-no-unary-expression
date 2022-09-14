"use strict";
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const typescript_1 = require("typescript");
module.exports = {
    name: 'no-multiple-logic-not',
    meta: {
        docs: {
            description: 'No Multiple Logic Not',
            recommended: 'error',
            category: 'Possible Errors',
        },
        messages: {
            noMultipleLogicNot: "Don't use multiple logic NOT",
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
        function findFirstNonBoolean(node) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const { kind, types } = checker.typeToTypeNode(getNodeType(node));
            //    eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (kind === typescript_1.SyntaxKind.BooleanKeyword && node.operator === '!') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                return findFirstNonBoolean(node.argument);
            }
            return { kind, types };
        }
        return {
            UnaryExpression(node) {
                var _a;
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const parent = checker.typeToTypeNode(getNodeType(node.parent));
                const child = checker.typeToTypeNode(getNodeType(node.argument));
                let searchNode;
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                // eslint-disable-next-line prettier/prettier
                if (((parent === null || parent === void 0 ? void 0 : parent.kind) === typescript_1.SyntaxKind.BooleanKeyword && ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.operator) === '!') || ((child === null || child === void 0 ? void 0 : child.kind) === typescript_1.SyntaxKind.BooleanKeyword && node.argument.operator === '!')) {
                    searchNode = findFirstNonBoolean(node.argument);
                }
                if (searchNode && searchNode.kind === typescript_1.SyntaxKind.UnionType) {
                    // const sourceCode = context.getSourceCode();
                    // const name = sourceCode.getText(node.argument);
                    const typesAsSyntaxKind = searchNode.types.map(
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
                            messageId: 'noMultipleLogicNot',
                            node,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-multiple-logic-not.js.map