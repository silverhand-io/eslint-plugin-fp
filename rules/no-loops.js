'use strict';

const create = function (context) {
  function reportForLoop(node) {
    context.report({
      node,
      message: 'Unallowed use of `for` loop',
    });
  }

  function reportWhileLoop(node) {
    context.report({
      node,
      message: 'Unallowed use of `while` loop. Use recursion instead',
    });
  }

  return {
    ForStatement: reportForLoop,
    ForInStatement: reportForLoop,
    ForOfStatement: reportForLoop,

    WhileStatement: reportWhileLoop,
    DoWhileStatement: reportWhileLoop,
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of loops.',
      recommended: 'error',
      url: 'https://github.com/silverhand-io/eslint-plugin-fp/blob/master/docs/rules/no-loops.md',
    },
  },
};
