import React, { useState, useEffect, useRef } from "react";
import "./Subscription.scss";
import ModalOverlay from "./Modal/Modal";

import {
  API_ROUTE,
  API_NETWORK_ERROR,
  API_SUCCESS_CODE,
  RAZOR_PAY_ORDER_ERROR,
} from "../../const/common";

import rightTick from "../../assets/right-tick.svg";
import hdvLogo from "../../assets/hdv_logo.svg";

import { getApiData, postApiData } from "../../utils/axios-utility";

import ErrorPopup from "../../element/ErrorPopup/ErrorPopup";

const Subscription = ({ businessData }) => {
  const [planDetails, setPlanDetails] = useState([]);
  const [apiError, setApirError] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [taxValues, setTaxValues] = useState({});
  const [paymentVarified, setPaymentVariefied] = useState(false);

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  const fetchSubscriptionPlanDetails = async () => {
    try {
      const resp = await getApiData({
        url: API_ROUTE.GET_ACTIVE_SUBSCRIPTION,
      });
      if (resp.status === API_SUCCESS_CODE) {
        setPlanDetails(resp?.data?.businessSubscriptionPlanDTO);
        setTaxValues({
          taxName: resp?.data?.taxName,
          taxValue: resp?.data?.taxValue,
        });
      } else {
        setApirError(resp?.message || "");
      }
    } catch (error) {
      setApirError(API_NETWORK_ERROR);
    }
  };

  useEffect(() => {
    if (planDetails.length === 0) fetchSubscriptionPlanDetails();
  }, []);

  const handleModalOpen = (modalDetails) => {
    console.log("model", businessData, modalDetails);
    setModalShow(true);
    setModalData({
      ...modalDetails,
      businessId: businessData?.id,
      businessName: businessData?.businessName,
      taxValue: taxValues?.taxValue,
      taxName: taxValues?.taxName,
    });
  };

  const handleModalClose = () => {
    setModalShow(false);
    setModalData({});
  };

  const handlePaymentCheckOut = async (details) => {
    console.log("details", details);
    var options = {
      key: "rzp_test_AUtPjYPE2CbSG3",
      amount: details?.amountWithGST * 100,
      currency: "INR",
      name: "Hindavi Adds Hub",
      image: {hdvLogo},
      order_id: details?.orderId,
      config: {
        display: {
          hide: [
            {
              method: "paylater",
            },
            {
              method: "wallet",
            },
          ],
          preferences: {
            show_default_blocks: true, // Should Checkout show its default blocks?
            show_phone: false,
          },
        },
      },
      handler: async (response) => {
        console.log("here", response);

        let body = {
          businessId: modalData?.businessId,
          subscriptionId: modalData?.subscriptionId,
          orderId: response?.razorpay_order_id,
          paymentId: response?.razorpay_payment_id,
          signature: response?.razorpay_signature,
        };

        try {
          const resp = await postApiData({
            url: API_ROUTE.TRANSACTION_VERIFY_PAYMENT,
            body,
          });
          console.log("pay", resp);
          if (resp.status === API_SUCCESS_CODE) {
            setPaymentVariefied(true);
          } else {
            setApirError(resp?.message || "");
          }
        } catch (e) {
          setApirError(RAZOR_PAY_ORDER_ERROR);
        }
      },
      modal: {
        ondismiss: function () {
          if (confirm("Are you sure, you want to close the form?")) {
            txt = "You pressed OK!";
            console.log("Checkout form closed by the user");
          } else {
            txt = "You pressed Cancel!";
            console.log("Complete the Payment");
          }
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    if (paymentVarified) {
      setModalShow(false);
      setModalData({});
      alert("payment is verified");
      setPaymentVariefied(false);
    }
  }, [paymentVarified]);

  const handlePaymentInitiated = async () => {
    const body = {
      businessId: modalData?.businessId ||6,
      subscriptionId: modalData?.subscriptionId,
      businessName: modalData?.businessName || 'hi',
      amountWithGST: Number(
        (
          modalData?.ammountPerYear *
          (1 + Number(taxValues?.taxValue) / 100)
        ).toFixed(2)
      ),
      taxValue: taxValues?.taxValue,
      taxName: taxValues?.taxName,
      amount: modalData?.ammountPerYear,
    };

    try {
      const resp = await postApiData({
        url: API_ROUTE.TRANSACTION_CREATE_ORDER,
        body,
      });
      if (resp.status === API_SUCCESS_CODE && resp?.data?.orderId) {
        handlePaymentCheckOut({ ...body, orderId: resp?.data?.orderId });
      } else {
        setApirError(resp?.message || "");
      }
    } catch (e) {
      setApirError(RAZOR_PAY_ORDER_ERROR);
    }
  };

  return (
    <>
      {planDetails.length > 0 && (
        <div className="pricing-container carousel-container businee-active-subscription">
          <div className="carousel" ref={carouselRef}>
            {planDetails?.map((plan) => (
              <div className="subscription-card" key={plan?.subscriptionId}>
                <div className="card-header">
                  <h3 className="paln-name">{plan?.subscriptionName}</h3>
                  <p>
                    &#x20B9; {plan?.ammountPerYear}
                    <span>/Year</span>
                  </p>
                  <span>Annual Subscription</span>
                </div>
                <div className="get-subsCription-btn hdv-margin-bottom-20">
                  <button
                    type="button"
                    className="subsCription-button"
                    onClick={() => handleModalOpen(plan)}
                  >
                    Get Subcription
                  </button>
                </div>

                <ul className="card-features">
                  {plan?.planInfo?.map((feature, index) => (
                    <li key={index}>
                      <img src={rightTick} />
                      <span>{feature.planName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {planDetails.length > 4 && (
            <>
              <button className="scroll-button left" onClick={scrollLeft} />
              <button className="scroll-button right" onClick={scrollRight} />
            </>
          )}
        </div>
      )}
      {modalShow && (
        <ModalOverlay
          show={modalShow}
          onHide={handleModalClose}
          onConfirmPayment={handlePaymentInitiated}
          planData={modalData}
          centered
          closeButton={true}
        />
      )}
    </>
  );
};

export default Subscription;
