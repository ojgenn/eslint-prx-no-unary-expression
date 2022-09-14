"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unaryExpressionFixer = (node, fixer, name) => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return fixer.replaceText(node, `${name} != null`);
    }
    catch (_a) {
        return;
    }
};
//# sourceMappingURL=fix.js.map