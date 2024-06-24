const jsep = require('jsep');

const operators = {
  '==': '$eq',
  '!=': '$ne',
  '>': '$gt',
  '>=': '$gte',
  '<': '$lt',
  '<=': '$lte',
};

const parseAndTranslateQuery = (query) => {
  const expression = jsep(query);
  return parseExpression(expression);
};

const parseExpression = (expression) => {
  switch (expression.type) {
    case 'BinaryExpression':
      return parseBinaryExpression(expression);
    case 'LogicalExpression':
      return parseLogicalExpression(expression);
    case 'Literal':
      return expression.value;
    case 'Identifier':
      return `$${expression.name}`;
    case 'MemberExpression':
      return parseMemberExpression(expression);
    case 'Compound':
      return parseCompoundExpression(expression);
    case 'SequenceExpression':
      return parseSequenceExpression(expression);
    case 'CallExpression':
      return parseCallExpression(expression);
    default:
      throw new Error(`Unsupported expression type: ${expression.type}`);
  }
};

const parseCallExpression = (expression) => {
  // Example: Handle function calls by parsing arguments
  if (!expression.callee || expression.callee.type !== 'Identifier') {
    throw new Error('Invalid or unsupported function call expression.');
  }

  const functionName = expression.callee.name;
  const args = expression.arguments.map(parseExpression);

  // Example: Construct MongoDB query or perform custom logic based on function call
  if (functionName === 'customFunction') {
    // Implement custom logic for this function call
    // Example: return { customField: args[0] };
    // Modify as per your specific use case
    // Ensure to handle the parsed arguments appropriately
  } else {
    throw new Error(`Unsupported function call: ${functionName}`);
  }
};

const parseSequenceExpression = (expression) => {
  if (!expression.expressions || !expression.expressions.length) {
    throw new Error('Sequence expression has no expressions.');
  }

  const parsedExpressions = expression.expressions.map(parseExpression);
  return parsedExpressions.join(', ');
};

const parseCompoundExpression = (expression) => {
  if (!expression.body || !expression.body.length) {
    throw new Error('Compound expression has no body.');
  }

  // Example: Assume all expressions in the compound are $and combined
  const parsedExpressions = expression.body.map(parseExpression);
  return { $and: parsedExpressions };
};

const parseBinaryExpression = (expression) => {
  const left = parseExpression(expression.left);
  const right = parseExpression(expression.right);
  const operator = operators[expression.operator];

  return { [left]: { [operator]: right } };
};

const parseLogicalExpression = (expression) => {
  const left = parseExpression(expression.left);
  const right = parseExpression(expression.right);
  const operator = expression.operator.toLowerCase() === 'and' ? '$and' : '$or';

  return { [operator]: [left, right] };
};

const parseMemberExpression = (expression) => {
  if (expression.object.type === 'Identifier' && expression.property.type === 'Identifier') {
    return `${expression.object.name}.${expression.property.name}`;
  }
  throw new Error(`Unsupported member expression: ${expression}`);
};

module.exports = { parseAndTranslateQuery };


//https://www.youtube.com/watch?v=bQD1L8aQCSc