// Placeholder for GraphQL usage
import { shopify } from './restClient.js';
export function graphql(query, variables={}) {
  return shopify.post('/graphql.json', { query, variables });
}
