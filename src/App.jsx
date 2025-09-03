import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Travelers from "./pages/Travelers/Travelers";
import Partners from "./pages/Partners/Partners";
import Riders from "./pages/Riders";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Refunds from "./pages/Refunds";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import TravelerProfile from "./pages/Travelers/TravelerProfile";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PartnerProfile from "./pages/Partners/PartnerProfile";
import AddPartners from "./pages/Partners/AddPartners";


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

          </Route>

          
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
