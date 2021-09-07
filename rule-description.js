const reqAll = require('import-modules');
const createIndex = require('create-eslint-index');
const index = require('./index.js');

const rules = reqAll('rules', {camelize: false});

const settings = {
  descriptionField: 'meta.docs.description',
  docPath: 'docs/rules',
};

const exampleConfiguration = {
  name: 'my-awesome-project',
  eslintConfig: {
    env: {
      es6: true,
    },
    plugins: [
      'fp',
    ],
    rules: index.configs.recommended.rules,
  },
};

module.exports = {
  RULES: `\n${createIndex.createRulesDescription(settings, rules)}\n\n`,
  EXAMPLE_CONFIGURATION: '\n```json\n' + JSON.stringify(exampleConfiguration, null, 2) + '\n```\n',
};
