import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Travelers from "./pages/Travelers/Travelers";
import Partners from "./pages/Partners/Partners";
import Riders from "./pages/Riders/Riders";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Settings from "./pages/Settings/Settings";
import Support from "./pages/Support/Support";
import Refunds from "./pages/Refunds/Refunds";
import StripePayments from "./pages/StripePayments";
import TravelerProfile from "./pages/Travelers/TravelerProfile";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PartnerProfile from "./pages/Partners/PartnerProfile";
import AddPartners from "./pages/Partners/AddPartners";
import AddRiders from "./pages/Riders/AddRiders";
import RiderProfile from "./pages/Riders/RiderProfile";
import OrdersDetail from "./pages/Orders/OrdersDetail";
import AssignRider from "./pages/Orders/AssignRider";
import ProductsDetail from "./pages/Products/ProductsDetail";
import ChatSupport from "./pages/Support/ChatSupport";
import RefundsDetail from "./pages/Refunds/RefundsDetail";
import UpdateRider from "./pages/Riders/UpdateRider";
import TwoFactor from "./components/TwoFactor";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthCallback from "./components/OAuthCallback";
import UpdatePartner from "./pages/Partners/UpdatePartner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
       
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/two-factor" element={<TwoFactor />} />

          {/* OAuth Callback Routes */}
          <Route path="/oauth/google/callback" element={<OAuthCallback />} />
          <Route path="/oauth/apple/callback" element={<OAuthCallback />} />
          <Route path="/oauth/shopify/callback" element={<OAuthCallback />} />
         
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/travelers" element={<Travelers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/riders" element={<Riders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/refund" element={<Refunds />} />
            <Route path="/card-payments" element={<StripePayments />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />

           
            <Route
              path="/travelers/profile/:id"
              element={<TravelerProfile />}
            />

          
            <Route path="/partners/add-partner" element={<AddPartners />} />
            <Route path="/partners/profile/:id" element={<PartnerProfile />} />
            <Route path="/partners/update-partner/:id" element={<UpdatePartner />} />


         
            <Route path="/riders/add-rider" element={<AddRiders />} />
            <Route path="/riders/profile/:id" element={<RiderProfile />} />
            <Route path="/riders/update-rider/:id" element={<UpdateRider />} />

         
            <Route path="/orders/ordersdetail/:id" element={<OrdersDetail />} />
            <Route path="/orders/assignrider/:id" element={<AssignRider />} />

          
            <Route
              path="/products/productsdetail/:id"
              element={<ProductsDetail />}
            />
            <Route
              path="/products/productsdetail"
              element={<ProductsDetail />}
            />

            <Route
              path="/refund/refundsdetail/:id"
              element={<RefundsDetail />}
            />

        
            <Route
              path="/support/chatsupport/:id"
              element={<ChatSupport />}
            />
          </Route>
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
