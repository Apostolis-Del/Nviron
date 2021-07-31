import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import gql from 'graphql-tag';
import {Button} from "semantic-ui-react"
import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react'


const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

export default function PaymentForm({email,orgId}) {
    const [success, setSuccess ] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

const orgid=email.orgId;
console.log(orgid)
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         const {error, paymentMethod} = await stripe.createPaymentMethod({
//             type: "card",
//             card: elements.getElement(CardElement)
//         })
       

//     if(!error) {
//         try {
//             const {id} = paymentMethod
//             const response = await axios.post("http://localhost:5000/payment", {
//                 amount: 1000,
//                 id
//             })

//             if(response.data.success) {
//                 console.log("Successful payment")
//                 setSuccess(true)
//             }

//         } catch (error) {
//             console.log("Error", error)
//         }
//     } else {
//         console.log(error.message)
//     }
// }

////////////////NEWWWWWWWWWWWWWWWW

const [createDono] = useMutation(ADD_DONATION, {    
  variables:{
    orgId:orgid
  }
  ,
  //otan mpei sto update simainei oti to post exei diagraftei epityxws
  update(proxy, result) {
    const data = proxy.readQuery({
      query: FETCH_SINGLEORG_QUERY,
      variables:{
        orgId:orgid
      }
    });
    console.log(result,"to result")
    console.log(data,"to data")
            proxy.writeQuery({
            query: FETCH_SINGLEORG_QUERY,
            data: {
                getOrganization:[ result.data.createDonation.donations.username, result.data.createDonation.donateDate, ...data.getOrganization.donations ]
            },
            variables:{
              orgId:orgid

          }
        }); 
     
  }
  
});

const handleSubmitSub5 = async (e) => {
  e.preventDefault()
    console.log(email.email)
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email.email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const res = await axios.post('http://localhost:5000/subscription', {'payment_method': result.paymentMethod.id, 'email': email.email});
      // eslint-disable-next-line camelcase
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            createDono();
            console.log('You got the money!');
                setSuccess(true)
            // Show a success message to your customer
          }
        });
      } else {
        createDono();
        console.log('You got the money!');
        console.log("Successful payment")
        // No additional information was needed
        // Show a success message to your customer
      }
    }
  };
  const handleSubmitSub10 = async (e) => {
    e.preventDefault()
      console.log(email.email)
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          email: email.email,
        },
      });
  
      if (result.error) {
        console.log(result.error.message);
      } else {
        const res = await axios.post('http://localhost:5000/subscriptiontwo', {'payment_method': result.paymentMethod.id, 'email': email.email});
        // eslint-disable-next-line camelcase
        const {client_secret, status} = res.data;
  
        if (status === 'requires_action') {
          stripe.confirmCardPayment(client_secret).then(function(result) {
            if (result.error) {
              console.log('There was an issue!');
              console.log(result.error);
              // Display error message in your UI.
              // The card was declined (i.e. insufficient funds, card has expired, etc)
            } else {
              console.log('You got the money!');
                  setSuccess(true)
              // Show a success message to your customer
            }
          });
        } else {
          console.log('You got the money!');
          console.log("Successful payment")
          // No additional information was needed
          // Show a success message to your customer
        }
      }
    };
  ////////////////////////
    return (
        <>
        {!success ? 
        <form //onSubmit={handleSubmitSub}
        >
            <fieldset className="FormGroup">
                <div className="FormRow">
                    <CardElement options={CARD_OPTIONS}/>
                </div>
            </fieldset>
            <Button onClick={handleSubmitSub5}>Subscribe for 5€/month.</Button>
            <Button onClick={handleSubmitSub10}>Subscribe for 10€/month.</Button>
        </form>
        :
       <div>
           <h2>You just donated 10 dollars.</h2>
       </div> 
        }
            
        </>
    )
}
const ADD_DONATION = gql`
  mutation createDonation($orgId:ID!) {
    createDonation(orgId: $orgId){
        orgName
        donations{
          username
          donateDate
        }
    }
  }
`;
const FETCH_SINGLEORG_QUERY=gql`
    query($orgId:ID!){
        getOrganization(orgId:$orgId){
            id
            orgName
            orgDescription
            orgLocationLat
            orgType
            orgLocationLong
            orgOwner{
                id username
            }
            donations{
                username
                donateDate
            }
            instagramLink
            youtubeLink
            twitterLink
            facebookLink
        }
    }
`;