import React, { useState } from "react";

const RazorpayUPI = () => {
 

  // Function to open Razorpay Checkout
  const handlePayment = async () => {

      var options = {
          key: "rzp_test_AUtPjYPE2CbSG3", // Use your Razorpay Key ID
        "amount": "1000",
        "currency": "INR",
        "description": "Acme Corp",
        "image": "example.com/image/rzp.jpg",
        config: {
          display: {
            hide: [
                {
                method: "paylater"
                }
              ],
            preferences: {
              show_default_blocks: true // Should Checkout show its default blocks?
            }
          }
        },
        "handler": function (response) {
          alert(response.razorpay_payment_id);
        },
        "modal": {
          "ondismiss": function () {
            if (confirm("Are you sure, you want to close the form?")) {
              txt = "You pressed OK!";
              console.log("Checkout form closed by the user");
            } else {
              txt = "You pressed Cancel!";
              console.log("Complete the Payment")
            }
          }
        }
      };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h2>Razorpay UPI Payment</h2>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay via UPI
      </button>
    </div>
  );
};

export default RazorpayUPI;
