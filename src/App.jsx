import CreateAccount from "./components/CreateAccount/CreateAccount";
import LoginPage from "./components/Login/LoginPage";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.scss";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./element/ProtectedRoute/ProtectedRoute";
import MasterPage from "./components/Master";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useGlobalState } from "./context/GlobalProvider";
import SubCategory from "./components/SubCategory/SubCategory";
import BusinessList from "./components/SubCategory/BusinessList/BusinessList";
import ListedBusinessDetails from "./components/ListedBusinessDetails/ListedBusinessDetails";

import BusinessRegistrationNew from "./components/BusinessRegistration/BusinessRegistrationNew";
import AddNewBusinessPage from "./pages/AddNewBusiness/AddNewBusinessPage";

import ChangesPasswordPage from "./pages/ChangePassword/ChangesPasswordPage";

import UpdateBusiness from "./components/BusinessRegistration/UpdateBusiness/UpdateBusiness";
import EditProfile from "./components/Customer/EditProfile/EditProfile";

import RazorpayPayment from "./components/PaymentTest/RazorpayPayment";


const ProtectedLoginRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.name ? <Navigate to="/" /> : children;
};
const ProtectedAddBusinessRoute = ({ children }) => {
  const { addBusinessNumber } = useGlobalState();
  // return !addBusinessNumber ? children : children;
  return !addBusinessNumber ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <div className="hindavi-ads-container">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<CreateAccount />} />

            <Route
              path="/login"
              element={
                <ProtectedLoginRoute>
                  <LoginPage />
                </ProtectedLoginRoute>
              }
            />

            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="list-business" element={<AddNewBusinessPage />} />
              <Route path="update-business" element={<UpdateBusiness />} />

              <Route
                path="add-business"
                element={
                  <ProtectedAddBusinessRoute>
                <BusinessRegistrationNew />
                </ProtectedAddBusinessRoute>
                }
              />
              <Route
                path="business/:business"
                element={<ListedBusinessDetails />}
              />

              <Route
                path="master"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MasterPage />
                  </ProtectedRoute>
                }
              />

              <Route path="change-password" element ={<ChangesPasswordPage />} />
              {/* Dynamic Route */}
              <Route
                path="category/:category/:business-list"
                element={<BusinessList />}
              />
              <Route path="category/:category" element={<SubCategory />} />
              <Route path="edit-profile" element={<EditProfile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
