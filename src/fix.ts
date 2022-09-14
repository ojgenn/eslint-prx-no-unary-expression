import {
  RuleFix,
  RuleFixer,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { TSESTree } from '@typescript-eslint/typescript-estree';

export const unaryExpressionFixer = (
  node: TSESTree.Identifier,
  fixer: RuleFixer,
  name: string,
): RuleFix | undefined => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return fixer.replaceText(node, `${name} != null`);
  } catch {
    return;
  }
};
