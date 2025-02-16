import React from "react";
import "./index.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import EmployeeList from "./Employee/EmployeeList";
import SubscriptionPlans from "./Subscription/SubscriptionPlans";

const MasterDashboard = () => {
  return (
    <div className="hdv-container master-container">
      <div className="hdv-row">
        <div className="hdv-col-12">
          <h1 className="master-title">Dashboard</h1>
        </div>
        <div className="hdv-col-12">
          <Tabs
            defaultActiveKey="employeeInfo"
            id="dashboard-tabs"
            variant="underline"
          >
            <Tab eventKey="employeeInfo" title="Employee info">
              <EmployeeList />
              {/* <AddEditEmployee /> */}
            </Tab>
            <Tab eventKey="businessApproval" title="Business Approval">
              Tab content for Profile
            </Tab>
            <Tab eventKey="manageSubscription" title="Manage Subscription">
            <SubscriptionPlans />
            </Tab>
            <Tab eventKey="Dummy1" title="Dummy1">
              Tab content for Contact
            </Tab>
            <Tab eventKey="Dummy2" title="Dummy2">
              Tab content for Contact
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
