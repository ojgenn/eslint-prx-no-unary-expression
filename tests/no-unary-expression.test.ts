import { ESLintUtils } from '@typescript-eslint/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import rule from '../src/rules/no-unary-expression';

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
ruleTester.run('no-unary-expression', rule, {
  valid: [
    {
      code: `
            const a: Record<string, number | null> = {
            test: 5,
            test1: null,
            test2: 7
          };

          if (!a) {}
      `,
    },
    {
      code: `
            typeof x === 'number' ? x : Infinity
      `,
    },
    {
      code: `const b = [1,2,3]; let a = b.find(index => index === 7); if (a !== null && a !== undefined) {}`,
    },
    {
      code: `const b: number | null = 5; if (!a ) {}`,
    },
    {
      code: `const b: number | null = 5; if (!a ) {}`,
    },
    {
      code: `
      let b: NotSupernumber[] = [{ str: 'test' }]; let a: NotSupernumber | undefined = b.find(item => item.str === 'test1'); if (!a) {}
      `,
    },
    {
      code: `
      let b: NotSupernumber[] = [{ str: 'test' }]; let a = b.find(item => item.str === 'test1'); if (!a) {}
      `,
    },
    {
      code: `
      const a = true;
      if (!a) {}
      `,
    },
  ],
  invalid: [
    {
      code: `const b = [1,2,3]; let a = b.find(index => index === 7); if (!a) {}`,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `const b = [1,2,3]; let a = b.find(index => index === 7) ?? null; if (!a) {}`,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      function b(a?: number) {
        if (!a) {}
      }
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      class A {
        public a?: number;
        constructor(a?: number) {
          this.a = a;
        }

        public init() {
          if (!this.a) {

          }
        }
      }
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      let a: number | null = (Math.random() > 0.5) ? 5 : null; if (!a) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      let a: string | null = (Math.random() > 0.5) ? '5' : null; if (!a) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      const rand = Math.random();
      let a: string | number | null = (rand < 0.3) ? 5 : rand > 0.7 ? '7' : null; if (!a) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      const rand = Math.random();
      let a: number | null | string = (rand < 0.3) ? '5' : rand > 0.7 ? 7 : null; if (!a) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      let a: Record<string, Record<string, number | null>> | number | null = (Math.random() > 0.5) ? null : (Math.random() > 0.5) ? 5 : {}; if (!a ) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      type unit = number;
      let a: unit | null = Math.random() > 0.5 ? 1 : null;
      if (!a) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
    {
      code: `
      const c: {b: number | undefined} = {b: 5};
        const a = [1,2,3];
        c.b = a.find(item => item === 0);
        if (!c.b) {}
      `,
      errors: [
        {
          messageId: 'noUnaryExpression',
        },
      ],
    },
  ],
});
