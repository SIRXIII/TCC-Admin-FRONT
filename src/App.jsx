import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Travelers from "./pages/Travelers/Travelers";
import Partners from "./pages/Partners";
import Riders from "./pages/Riders";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Refunds from "./pages/Refunds";
// import Returns from "./pages/Returns";
// import Reviews from "./pages/Reviews";
// import Payouts from "./pages/Payouts";
// import Reports from "./pages/Reports";
import Support from "./pages/Support";
// import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import TravelerProfile from "./pages/Travelers/TravelerProfile";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


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
          {/* <Route path="/returns" element={<Returns />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/reports" element={<Reports />} /> */}
          <Route path="/support" element={<Support />} />
          {/* <Route path="/help" element={<Help />} /> */}
          <Route path="/settings" element={<Settings />} />


          <Route path="/travelers/profile/:id" element={<TravelerProfile />} />

        </Route>
      </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
