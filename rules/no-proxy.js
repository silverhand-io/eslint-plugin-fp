'use strict';

const create = function (context) {
  return {
    Identifier(node) {
      if (node.name === 'Proxy') {
        context.report({
          node,
          message: 'Unallowed use of `Proxy`',
        });
      }
    },
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of `Proxy`.',
      recommended: 'error',
      url: 'https://github.com/silverhand-io/eslint-plugin-fp/blob/master/docs/rules/no-proxy.md',
    },
  },
};
