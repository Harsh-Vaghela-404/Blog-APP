"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCommentType = exports.PostType = exports.BlogUserType = void 0;
const graphql_1 = require("graphql");
exports.BlogUserType = new graphql_1.GraphQLObjectType({
    name: 'BlogUserType',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        created_at: { type: graphql_1.GraphQLString },
        updated_at: { type: graphql_1.GraphQLString }
    })
});
exports.PostType = new graphql_1.GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        created_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        updated_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
    })
});
exports.PostCommentType = new graphql_1.GraphQLObjectType({
    name: 'PostCommentType',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        post_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
        content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        created_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        updated_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
    })
});
//# sourceMappingURL=schema.js.map