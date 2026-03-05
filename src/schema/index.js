import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

// 1. Load all .graphql files and merge them into one schema object
const schema = loadSchemaSync("./src/schema/graphql/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

export default schema;
