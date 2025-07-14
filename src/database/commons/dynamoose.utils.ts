export function getModelToken(model: string) {
  return `DYNAMOOSE_MODEL_${model.toUpperCase()}`;
}
