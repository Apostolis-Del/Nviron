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

const app = express();

app.use(cors())
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) =>({req,pubsub})
});


// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	next();
//   });
//auta einai kainourgia gia tis eikones

server.applyMiddleware({ app, path: '/graphql' });
app.use(express.static('public'));


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


////////NEWWWWWWWW

app.post('/subscription', cors(), async (req, res) => {
	console.log(req.body)

	try{
	const {email, payment_method} = req.body;
	const customer = await stripe.customers.create({
	  payment_method: payment_method,
	  email: email,
	  invoice_settings: {
		default_payment_method: payment_method,
	  },
	});
  
	const subscription = await stripe.subscriptions.create({
	  customer: customer.id,
	  items: [{ plan: 'price_1JCjg4FJrBPtXE2sq5SDfowy' }],
	  expand: ['latest_invoice.payment_intent']
	});
	
	const status = subscription['latest_invoice']['payment_intent']['status'] 
	const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  
	res.json({
		'client_secret': client_secret,
	 	'status': status,
		 message: "Payment successful",
		});

} catch (error) {
	console.log("Error", error)
	res.json({
		message: "Payment failed",
		success: false
	})
}
  })

  app.post('/subscriptiontwo', cors(), async (req, res) => {
	console.log(req.body)

	try{
	const {email, payment_method} = req.body;
	const customer = await stripe.customers.create({
	  payment_method: payment_method,
	  email: email,
	  invoice_settings: {
		default_payment_method: payment_method,
	  },
	});
  
	const subscription = await stripe.subscriptions.create({
	  customer: customer.id,
	  items: [{ plan: 'price_1JCjiuFJrBPtXE2st7kN5532' }],
	  expand: ['latest_invoice.payment_intent']
	});
	
	const status = subscription['latest_invoice']['payment_intent']['status'] 
	const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  
	res.json({
		'client_secret': client_secret,
	 	'status': status,
		 message: "Payment successful",
		});

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

