import { ESLintUtils } from '@typescript-eslint/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import rule from '../src/rules/no-multiple-logic-not';

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
ruleTester.run('no-multiple-logic-not', rule, {
  valid: [
    {
      code: `
            const a = {};
            !!a;
      `,
    },
  ],
  invalid: [
    {
      code: `const a: number | null = Math.random() > 0.5 ? 5 : null; !!a`,
      errors: [
        {
          messageId: 'noMultipleLogicNot',
        },
        {
          messageId: 'noMultipleLogicNot',
        },
      ],
    },
  ],
});
