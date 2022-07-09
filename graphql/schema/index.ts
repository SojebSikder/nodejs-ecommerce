import { buildSchema } from "graphql";

export const schema = buildSchema(`
type Data{
  title: String!
  text: String!
}
input DataInput {
  title: String!
  text: String!
}


type Query {
  datas: [Data!]!
},
type Mutation {
  createData(input: DataInput): Data
}
`);
