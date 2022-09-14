import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
import * as ts from 'typescript';
import { Node, SyntaxKind, Type, TypeChecker } from 'typescript';
import { unaryExpressionFixer } from '../fix';
import { RuleFixer } from '@typescript-eslint/experimental-utils/dist/ts-eslint';

export = {
  name: 'no-unary-expression',
  meta: {
    type: 'problem',
    fixable: 'code',
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
  create: function(context: any) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    function getConstrainedTypeAtLocation(
      checker: TypeChecker,
      node: Node,
    ): Type {
      const nodeType = checker.getTypeAtLocation(node);
      const constrained = checker.getBaseConstraintOfType(nodeType);
      return constrained !== null && constrained !== void 0
        ? constrained
        : nodeType;
    }

    function getNodeType(node: TSESTree.Node): ts.Type {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      return getConstrainedTypeAtLocation(checker, tsNode);
    }

    return {
      UnaryExpression(node: TSESTree.UnaryExpression): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const { kind, types } = checker.typeToTypeNode(
          getNodeType(node.argument),
        );
        if (kind === SyntaxKind.UnionType) {
          const typesAsSyntaxKind = types.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: { kind: any }) => item.kind,
          );
          const hasNull: boolean = typesAsSyntaxKind.includes(
            SyntaxKind.NullKeyword,
          );
          const hasUndefined: boolean = typesAsSyntaxKind.includes(
            SyntaxKind.UndefinedKeyword,
          );
          const hasNumber: boolean = typesAsSyntaxKind.includes(
            SyntaxKind.NumberKeyword,
          );
          const hasString: boolean = typesAsSyntaxKind.includes(
            SyntaxKind.StringKeyword,
          );
          if (
            (hasNumber && hasUndefined) ||
            (hasNumber && hasNull) ||
            (hasString && hasNull) ||
            (hasString && hasUndefined)
          ) {
            const sourceCode = context.getSourceCode();
            const name = sourceCode.getText(node.argument);
            context.report({
              messageId: 'noUnaryExpression',
              node,
              fix: (fixer: RuleFixer) =>
                unaryExpressionFixer(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  node,
                  fixer,
                  name,
                ),
            });
          }
        }
      },
    };
  },
};
