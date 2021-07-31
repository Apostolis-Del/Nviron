  
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"


const PUBLIC_KEY = "pk_test_51JCLhJFJrBPtXE2sfhDv5a56yJnmtb9sRFe3JSIybI7sYrMGlgFKF7ncK4YR0fSC5BLTI6wuLi84oj5M5YXqgFWV00V3AP42MO"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer(email,orgId) {
	return (
		
		
		<Elements stripe={stripeTestPromise}>
			<PaymentForm email={email} orgId={orgId}/>
		</Elements>

	 
	)
}