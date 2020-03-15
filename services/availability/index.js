const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Product @key(fields: "upc") {
    upc: String! @external
    isAvailable(location: String = "anywhere"): Boolean
  }
`;

const resolvers = {
  Product: {
    isAvailable(product, args, context, info) {
      const location = args.location;
      if (product.upc == 1) { // table
        if (location == "anywhere") return true;
        if (location == "Boston, MA") return true;
      } else if (product.upc == 2) { // couch
        if (location == "anywhere") return true;
        if (location == "Kansas City, MO") return true;
      }
      return false;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

