import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';
import * as ts from 'typescript';
import { Node, SyntaxKind, Type, TypeChecker } from 'typescript';

export = {
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

    function findFirstNonBoolean(node: TSESTree.Node): any {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const { kind, types } = checker.typeToTypeNode(getNodeType(node));
//    eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (kind === SyntaxKind.BooleanKeyword && node.operator === '!') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return findFirstNonBoolean(node.argument);
      }

      return {kind, types};
    }

    return {
      UnaryExpression(node: TSESTree.UnaryExpression): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const parent = checker.typeToTypeNode(getNodeType(node.parent));
        const child = checker.typeToTypeNode(getNodeType(node.argument));
        let searchNode;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line prettier/prettier
        if ((parent?.kind === SyntaxKind.BooleanKeyword && node.parent?.operator === '!') || (child?.kind === SyntaxKind.BooleanKeyword && node.argument.operator === '!')) {
          searchNode = findFirstNonBoolean(node.argument);
        }

        if (searchNode && searchNode.kind === SyntaxKind.UnionType) {
          // const sourceCode = context.getSourceCode();
          // const name = sourceCode.getText(node.argument);
          const typesAsSyntaxKind = searchNode.types.map(
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
