import { gql } from 'apollo-server-core';

export default gql`
  type User {
    id: Int!
    firstName: String!
    latName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    createAccount(
      firstName: String!
      latName: String
      username: String!
      email: String!
      password: String!
    ): User
  }
  type Query {
    seeProfile(username: String!): User
  }
`;
