'use strict';

const mutatingMethods = new Set([
  'copyWithin',
  'pop',
  'push',
  'reverse',
  'shift',
  'sort',
  'splice',
  'unshift',
  'unwatch',
  'watch',
]);

const mutatingObjectMethods = new Set([
  'defineProperties',
  'defineProperty',
  'setPrototypeOf',
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

function isFollowedBySliceCallee(callee) {
  /**
   * `callee.object` will be always truthy.
   * See https://github.com/estree/estree/blob/master/es5.md#memberexpression
   */

  if (callee.object.type !== 'CallExpression') {
    return false;
  }

  if (!callee.object.callee || !callee.object.callee.property) {
    return false;
  }

  const {property} = callee.object.callee;
  return property.type === 'Identifier' && property.name === 'slice';
}

const create = function (context) {
  const options = context.options[0] || {};
  const allowedObjects = options.allowedObjects || [];

  return {
    CallExpression(node) {
      if (node.callee.type !== 'MemberExpression') {
        return;
      }

      if (node.callee.object.type === 'Identifier' && allowedObjects.includes(node.callee.object.name)) {
        return;
      }

      if (node.callee.object.name === 'Object') {
        if (mutatingObjectMethods.has(node.callee.property.name)) {
          context.report({
            node,
            message: `The use of method \`Object.${node.callee.property.name}\` is not allowed as it will mutate its arguments`,
          });
        }

        return;
      }

      const name = getNameIfPropertyIsIdentifier(node.callee.property) || getNameIfPropertyIsLiteral(node.callee.property);

      if (name) {
        if (name === 'sort') {
          // https://stackoverflow.com/questions/30431304/functional-non-destructive-array-sort
          if (!isFollowedBySliceCallee(node.callee)) {
            context.report({
              node,
              message: `The use of method \`${name}\` is not allowed as it might be a mutating method, use \`.slice()\` before to avoid direct mutation`,
            });
          }

          return;
        }

        context.report({
          node,
          message: `The use of method \`${name}\` is not allowed as it might be a mutating method`,
        });
      }
    },
  };
};

const schema = [{
  type: 'object',
  properties: {
    allowedObjects: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}];

module.exports = {
  create,
  schema,
  meta: {
    docs: {
      description: 'Forbid the use of mutating methods.',
      recommended: 'error',
      url: 'https://github.com/jfmengels/eslint-plugin-fp/tree/master/docs/rules/no-mutating-methods.md',
    },
  },
};
