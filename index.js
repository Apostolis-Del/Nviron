const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const express=require('express');
const { MONGODB } = require('./config.js');
const { getOperationAST } = require('graphql');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) =>({req,pubsub})
});

//auta einai kainourgia gia tis eikones

const app = express();
server.applyMiddleware({ app, path: '/graphql' });
app.use(express.static('public'));

// app.listen({port:5000},()=>{
//     console.log('server running at port 5000')
// })
mongoose.connect(MONGODB, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("Mongodb connected")
});

app.listen({port:5000},() => {
    console.log("server running at port:5000")
})
// mongoose
//     .connect(MONGODB, {useNewUrlParser: true,useUnifiedTopology: true})
//     .then (() => {
//         console.log('MongoDB connected');
//         return app.listen({ port: 5000 });
//     })
//     .then((res) => {
//         console.log(`Server running at ${res.url}`);
//     });

