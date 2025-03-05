import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(), // Added isDone field
    })
    .authorization((allow) => [allow.publicApiKey()]),
  User: a.model({
    id: a.id(),
    username: a.string().required(),
    email: a.string().required(),
    role: a.string().required(), // 'STUDENT', 'PARENT', or 'EMPLOYER'
    parentID: a.id(), // Reference to Parent if role is 'STUDENT'
    parent: a.belongsTo('User', 'parentID'), // Inverse relationship
    children: a.hasMany('User', 'parentID'), // For 'PARENT' role
    postedJobs: a.hasMany('Job', 'postedByID'), // For 'EMPLOYER' role
    applications: a.hasMany('Application', 'userID'), // For 'STUDENT' role
  })
    .authorization((allow) => [allow.publicApiKey()]),
  Job: a.model({
    id: a.id(),
    title: a.string().required(),
    description: a.string().required(),
    location: a.string(),
    postedByID: a.id().required(), // Reference to Employer
    postedBy: a.belongsTo('User', 'postedByID'),
    applications: a.hasMany('Application', 'jobID'),
  }).authorization((allow) => [allow.publicApiKey()]),
  Application: a.model({
    id: a.id(),
    jobID: a.id().required(),
    job: a.belongsTo('Job', 'jobID'),
    userID: a.id().required(), // Reference to Student
    user: a.belongsTo('User', 'userID'),
    status: a.string().required(), // 'PENDING', 'ACCEPTED', 'REJECTED'
    appliedAt: a.datetime().required(),
  }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },

});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
