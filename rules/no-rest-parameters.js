'use strict';

const create = function (context) {
  return {
    RestElement(node) {
      context.report({
        node,
        message: 'Unallowed use of rest parameters. Use regular function arguments instead',
      });
    },
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of rest parameters.',
      recommended: 'error',
      url: 'https://github.com/silverhand-io/eslint-plugin-fp/blob/master/docs/rules/no-rest-parameters.md',
    },
  },
};
