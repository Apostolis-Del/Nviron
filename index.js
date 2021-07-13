const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const express=require('express');
const { MONGODB } = require('./config.js');
const { getOperationAST } = require('graphql');
const cors = require("cors")

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) =>({req,pubsub})
});

//auta einai kainourgia gia tis eikones

const app = express();
server.applyMiddleware({ app, path: '/graphql' });
app.use(express.static('public'));
app.use(cors())
app.use(express.json());

app.post('/payment', cors(), async (req, res) => {
	try {
        console.log(req.body)
        const { amount, id } = req.body

		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Spatula company",
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})
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

