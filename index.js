const reqAll = require('import-modules');
const createIndex = require('create-eslint-index');

const rules = reqAll('rules', {camelize: false});

const externalRecommendedRules = {
  'no-var': 'error',
};

const internalRecommendedRules = createIndex.createConfig({
  plugin: 'fp',
  field: 'meta.docs.recommended',
}, rules);

module.exports = {
  rules,
  configs: {
    recommended: {
      rules: {...internalRecommendedRules, ...externalRecommendedRules},
    },
  },
};
