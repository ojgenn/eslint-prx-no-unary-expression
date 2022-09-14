import {
  RuleFix,
  RuleFixer,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { TSESTree } from '@typescript-eslint/typescript-estree';

export const unaryExpressionFixer = (
  node: TSESTree.Identifier,
  fixer: RuleFixer,
): RuleFix | undefined => {
  try {
    // @ts-ignore
    return fixer.replaceText(node, `${node.argument.name} != null`);
  } catch {
    return;
  }
};
