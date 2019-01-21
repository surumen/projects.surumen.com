module.exports = {
        typeDefs: /* GraphQL */ `type AggregateProject {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Mutation {
  createProject(data: ProjectCreateInput!): Project!
  updateProject(data: ProjectUpdateInput!, where: ProjectWhereUniqueInput!): Project
  updateManyProjects(data: ProjectUpdateManyMutationInput!, where: ProjectWhereInput): BatchPayload!
  upsertProject(where: ProjectWhereUniqueInput!, create: ProjectCreateInput!, update: ProjectUpdateInput!): Project!
  deleteProject(where: ProjectWhereUniqueInput!): Project
  deleteManyProjects(where: ProjectWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Project {
  id: ID!
  name: String!
  description: String!
  url: String!
  tools: String!
  repo: String!
  buttonBg: String!
  color: String!
  category: String!
  createdBy: User
}

type ProjectConnection {
  pageInfo: PageInfo!
  edges: [ProjectEdge]!
  aggregate: AggregateProject!
}

input ProjectCreateInput {
  name: String!
  description: String!
  url: String!
  tools: String!
  repo: String!
  buttonBg: String!
  color: String!
  category: String!
  createdBy: UserCreateOneWithoutProjectsInput
}

input ProjectCreateManyWithoutCreatedByInput {
  create: [ProjectCreateWithoutCreatedByInput!]
  connect: [ProjectWhereUniqueInput!]
}

input ProjectCreateWithoutCreatedByInput {
  name: String!
  description: String!
  url: String!
  tools: String!
  repo: String!
  buttonBg: String!
  color: String!
  category: String!
}

type ProjectEdge {
  node: Project!
  cursor: String!
}

enum ProjectOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
  url_ASC
  url_DESC
  tools_ASC
  tools_DESC
  repo_ASC
  repo_DESC
  buttonBg_ASC
  buttonBg_DESC
  color_ASC
  color_DESC
  category_ASC
  category_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ProjectPreviousValues {
  id: ID!
  name: String!
  description: String!
  url: String!
  tools: String!
  repo: String!
  buttonBg: String!
  color: String!
  category: String!
}

input ProjectScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  url: String
  url_not: String
  url_in: [String!]
  url_not_in: [String!]
  url_lt: String
  url_lte: String
  url_gt: String
  url_gte: String
  url_contains: String
  url_not_contains: String
  url_starts_with: String
  url_not_starts_with: String
  url_ends_with: String
  url_not_ends_with: String
  tools: String
  tools_not: String
  tools_in: [String!]
  tools_not_in: [String!]
  tools_lt: String
  tools_lte: String
  tools_gt: String
  tools_gte: String
  tools_contains: String
  tools_not_contains: String
  tools_starts_with: String
  tools_not_starts_with: String
  tools_ends_with: String
  tools_not_ends_with: String
  repo: String
  repo_not: String
  repo_in: [String!]
  repo_not_in: [String!]
  repo_lt: String
  repo_lte: String
  repo_gt: String
  repo_gte: String
  repo_contains: String
  repo_not_contains: String
  repo_starts_with: String
  repo_not_starts_with: String
  repo_ends_with: String
  repo_not_ends_with: String
  buttonBg: String
  buttonBg_not: String
  buttonBg_in: [String!]
  buttonBg_not_in: [String!]
  buttonBg_lt: String
  buttonBg_lte: String
  buttonBg_gt: String
  buttonBg_gte: String
  buttonBg_contains: String
  buttonBg_not_contains: String
  buttonBg_starts_with: String
  buttonBg_not_starts_with: String
  buttonBg_ends_with: String
  buttonBg_not_ends_with: String
  color: String
  color_not: String
  color_in: [String!]
  color_not_in: [String!]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
  category: String
  category_not: String
  category_in: [String!]
  category_not_in: [String!]
  category_lt: String
  category_lte: String
  category_gt: String
  category_gte: String
  category_contains: String
  category_not_contains: String
  category_starts_with: String
  category_not_starts_with: String
  category_ends_with: String
  category_not_ends_with: String
  AND: [ProjectScalarWhereInput!]
  OR: [ProjectScalarWhereInput!]
  NOT: [ProjectScalarWhereInput!]
}

type ProjectSubscriptionPayload {
  mutation: MutationType!
  node: Project
  updatedFields: [String!]
  previousValues: ProjectPreviousValues
}

input ProjectSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ProjectWhereInput
  AND: [ProjectSubscriptionWhereInput!]
  OR: [ProjectSubscriptionWhereInput!]
  NOT: [ProjectSubscriptionWhereInput!]
}

input ProjectUpdateInput {
  name: String
  description: String
  url: String
  tools: String
  repo: String
  buttonBg: String
  color: String
  category: String
  createdBy: UserUpdateOneWithoutProjectsInput
}

input ProjectUpdateManyDataInput {
  name: String
  description: String
  url: String
  tools: String
  repo: String
  buttonBg: String
  color: String
  category: String
}

input ProjectUpdateManyMutationInput {
  name: String
  description: String
  url: String
  tools: String
  repo: String
  buttonBg: String
  color: String
  category: String
}

input ProjectUpdateManyWithoutCreatedByInput {
  create: [ProjectCreateWithoutCreatedByInput!]
  delete: [ProjectWhereUniqueInput!]
  connect: [ProjectWhereUniqueInput!]
  disconnect: [ProjectWhereUniqueInput!]
  update: [ProjectUpdateWithWhereUniqueWithoutCreatedByInput!]
  upsert: [ProjectUpsertWithWhereUniqueWithoutCreatedByInput!]
  deleteMany: [ProjectScalarWhereInput!]
  updateMany: [ProjectUpdateManyWithWhereNestedInput!]
}

input ProjectUpdateManyWithWhereNestedInput {
  where: ProjectScalarWhereInput!
  data: ProjectUpdateManyDataInput!
}

input ProjectUpdateWithoutCreatedByDataInput {
  name: String
  description: String
  url: String
  tools: String
  repo: String
  buttonBg: String
  color: String
  category: String
}

input ProjectUpdateWithWhereUniqueWithoutCreatedByInput {
  where: ProjectWhereUniqueInput!
  data: ProjectUpdateWithoutCreatedByDataInput!
}

input ProjectUpsertWithWhereUniqueWithoutCreatedByInput {
  where: ProjectWhereUniqueInput!
  update: ProjectUpdateWithoutCreatedByDataInput!
  create: ProjectCreateWithoutCreatedByInput!
}

input ProjectWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  url: String
  url_not: String
  url_in: [String!]
  url_not_in: [String!]
  url_lt: String
  url_lte: String
  url_gt: String
  url_gte: String
  url_contains: String
  url_not_contains: String
  url_starts_with: String
  url_not_starts_with: String
  url_ends_with: String
  url_not_ends_with: String
  tools: String
  tools_not: String
  tools_in: [String!]
  tools_not_in: [String!]
  tools_lt: String
  tools_lte: String
  tools_gt: String
  tools_gte: String
  tools_contains: String
  tools_not_contains: String
  tools_starts_with: String
  tools_not_starts_with: String
  tools_ends_with: String
  tools_not_ends_with: String
  repo: String
  repo_not: String
  repo_in: [String!]
  repo_not_in: [String!]
  repo_lt: String
  repo_lte: String
  repo_gt: String
  repo_gte: String
  repo_contains: String
  repo_not_contains: String
  repo_starts_with: String
  repo_not_starts_with: String
  repo_ends_with: String
  repo_not_ends_with: String
  buttonBg: String
  buttonBg_not: String
  buttonBg_in: [String!]
  buttonBg_not_in: [String!]
  buttonBg_lt: String
  buttonBg_lte: String
  buttonBg_gt: String
  buttonBg_gte: String
  buttonBg_contains: String
  buttonBg_not_contains: String
  buttonBg_starts_with: String
  buttonBg_not_starts_with: String
  buttonBg_ends_with: String
  buttonBg_not_ends_with: String
  color: String
  color_not: String
  color_in: [String!]
  color_not_in: [String!]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
  category: String
  category_not: String
  category_in: [String!]
  category_not_in: [String!]
  category_lt: String
  category_lte: String
  category_gt: String
  category_gte: String
  category_contains: String
  category_not_contains: String
  category_starts_with: String
  category_not_starts_with: String
  category_ends_with: String
  category_not_ends_with: String
  createdBy: UserWhereInput
  AND: [ProjectWhereInput!]
  OR: [ProjectWhereInput!]
  NOT: [ProjectWhereInput!]
}

input ProjectWhereUniqueInput {
  id: ID
}

type Query {
  project(where: ProjectWhereUniqueInput!): Project
  projects(where: ProjectWhereInput, orderBy: ProjectOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Project]!
  projectsConnection(where: ProjectWhereInput, orderBy: ProjectOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ProjectConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  project(where: ProjectSubscriptionWhereInput): ProjectSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  projects(where: ProjectWhereInput, orderBy: ProjectOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Project!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  name: String!
  email: String!
  password: String!
  projects: ProjectCreateManyWithoutCreatedByInput
}

input UserCreateOneWithoutProjectsInput {
  create: UserCreateWithoutProjectsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutProjectsInput {
  name: String!
  email: String!
  password: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  name: String
  email: String
  password: String
  projects: ProjectUpdateManyWithoutCreatedByInput
}

input UserUpdateManyMutationInput {
  name: String
  email: String
  password: String
}

input UserUpdateOneWithoutProjectsInput {
  create: UserCreateWithoutProjectsInput
  update: UserUpdateWithoutProjectsDataInput
  upsert: UserUpsertWithoutProjectsInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutProjectsDataInput {
  name: String
  email: String
  password: String
}

input UserUpsertWithoutProjectsInput {
  update: UserUpdateWithoutProjectsDataInput!
  create: UserCreateWithoutProjectsInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  projects_every: ProjectWhereInput
  projects_some: ProjectWhereInput
  projects_none: ProjectWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    