import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Modal.scss";

const ModalOverlay = (props) => {
  console.log("here", props);
  const { planData } = props;

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton={props?.closeButton}>
        <Modal.Title id="contained-modal-title-vcenter">
          {/* {planData?.businessName} */}
          Payment Summary
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="plan-details">
          <p className="plan-name">{planData?.subscriptionName} Plan</p>
          <p className="plan-price">
            &#x20B9; {planData?.ammountPerYear?.toFixed(2)}
          </p>
        </div>
        <div className="plan-benefits hdv-margin-bottom-24">
          {planData?.planInfo.map((info, i) => (
            <span>
              {info?.planName}
              {i !== planData?.planInfo?.length - 1 && " + "}{" "}
            </span>
          ))}
        </div>

        <div className="tax-holder hdv-margin-bottom-28">
          <span className="tax-name">
            {planData?.taxName} @{Number(planData?.taxValue)}%
          </span>
          <span className="tax-amount">
            &#x20B9; {(planData?.ammountPerYear * planData?.taxValue) / 100}
          </span>
        </div>

        <div className="total-container">
          <span className="total-title">Total Subscription Fees </span>
          <span className="total-amount">
            &#x20B9;{" "}
            {(
              planData?.ammountPerYear *
              (1 + Number(planData?.taxValue) / 100)
            ).toFixed(2)}
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props?.onConfirmPayment()}>Proceed</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalOverlay;
