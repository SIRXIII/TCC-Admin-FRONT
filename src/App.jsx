import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Travelers from "./pages/Travelers/Travelers";
import Partners from "./pages/Partners/Partners";
import Riders from "./pages/Riders/Riders";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";

import Support from "./pages/Support/Support";

import Refunds from "./pages/Refunds/Refunds";

import Settings from "./pages/Settings";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/travelers" element={<Travelers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/riders" element={<Riders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/refund" element={<Refunds />} />
          
            <Route path="/support" element={<Support />} />
           
            <Route path="/settings" element={<Settings />} />

            <Route
              path="/travelers/profile/:id"
              element={<TravelerProfile />}
            />

            <Route path="/partners/add-partner" element={<AddPartners />} />
            <Route path="/partners/profile/:id" element={<PartnerProfile />} />

            {/* <Route path="/riders/add-rider" element={<AddRiders />} /> */}
            <Route path="/riders/add-rider" element={<AddRiders />} />
            <Route path="/riders/profile/:id" element={<RiderProfile />} /> 
            <Route path="/riders/update-rider/:id" element={<UpdateRider />} /> 
            
            <Route path="/orders/ordersdetail/:id" element={<OrdersDetail />} />
            <Route path="/orders/assignrider/:id" element={<AssignRider />} />

            <Route path="/products/productsdetail/:id" element={<ProductsDetail />} />

            <Route path="/refund/refundsdetail/" element={<RefundsDetail />} />

//             <Route path="/products/productsdetail/" element={<ProductsDetail />} />
            <Route path="/support/chatsupport/" element={<ChatSupport />} />






          </Route>

          
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
