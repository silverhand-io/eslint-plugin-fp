'use strict';

const mutatingMethods = new Set([
  '__defineGetter__',
  '__defineSetter__',
]);

function getNameIfPropertyIsIdentifier(property) {
  return property.type === 'Identifier'
    && mutatingMethods.has(property.name)
    && property.name;
}

function getNameIfPropertyIsLiteral(property) {
  return property.type === 'Literal'
    && mutatingMethods.has(property.value)
    && property.value;
}

const create = function (context) {
  return {
    Property(node) {
      if (node.kind === 'get' || node.kind === 'set') {
        context.report({
          node,
          message: `Unallowed use of \`${node.kind}\``,
        });
      }
    },
    CallExpression(node) {
      if (node.callee.type !== 'MemberExpression' || node.callee.object.type !== 'Identifier') {
        return;
      }

      const name = getNameIfPropertyIsIdentifier(node.callee.property) || getNameIfPropertyIsLiteral(node.callee.property);
      if (name) {
        context.report({
          node,
          message: name === '__defineGetter__'
            ? 'Unallowed use of a getter using `__defineGetter__`'
            : 'Unallowed use of a setter using `__defineSetter__`',
        });
      }
    },
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of getters and setters.',
      recommended: 'error',
      url: 'https://github.com/silverhand-io/eslint-plugin-fp/blob/master/docs/rules/no-get-set.md',
    },
  },
};
