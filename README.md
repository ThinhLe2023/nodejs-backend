"# nodejs-backend" 
support FE as here: https://github.com/ThinhLe2023/frontend-feed

This BE will prepare APIs to serve FE as fetch data or saving new data into Mongooes (Database as a Service) which has supported by AWS / Azure / GCP already.

### Templates for Backend:
- GraphQL : npm run appWithGraphQL.js
    + Take advantage for Codegen :  graphql-codegen package
        cmd: npm i -D @graphql-codegen
        Deploy: run codegen, before build and release with below cmd:
            npm run generate
- Rest API: npm run app.js, replace package_bk.json to the current json file

### Steps Create Mongooes as Databse as a Service in GCP
1. For demo only, connect mongodb via URI
2. For postgre, need to setup database in k8s by running docker compose file below

### CICD : using git action
- TODO