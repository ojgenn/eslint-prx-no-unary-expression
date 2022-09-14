"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unaryExpressionFixer = (node, fixer) => {
    try {
        // @ts-ignore
        return fixer.replaceText(node, `${node.argument.name} != null`);
    }
    catch (_a) {
        return;
    }
};
//# sourceMappingURL=fix.js.map