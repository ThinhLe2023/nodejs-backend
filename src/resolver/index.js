import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';

const resolversArray = loadFilesSync(
     join(import.meta.dirname,'./**/*.resolver.js'),
     { recursive: true }
); 

console.log('Loaded Resolvers:', resolversArray);

// Merge your resolvers (imported from your modules)
const resolvers = mergeResolvers(resolversArray);

export default resolvers;