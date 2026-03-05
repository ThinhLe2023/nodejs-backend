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



### Frontend side for upload large file
chunkSize: 5 * 1024 * 1024;  -> 5 MB (minimum size)

Technic 1: upload chunk by chunk from FE -> BE -> S3 which uses AWS-SDK 2 as communication. Ex: appAWS.js
Technic 2: upload hold file from FE -> BE, here BE chunk by chunk to S3 which follow AWS SDK 3 (S3Client package). Ex: appAWS2.js
    cmd: npm install @aws-sdk/lib-storage @aws-sdk/client-s3

    + bucket policy:
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principle":"*",
                    "Action":"s3:GetObject",
                    "Resource":"arn:aws:s3:::youtube-demo-s3-upload/*"
                }
            ]
        }
