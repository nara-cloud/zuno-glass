import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import TryOn from "./pages/TryOn";
import Pulse from "./pages/Pulse";
import Lab from "./pages/Lab";
import Squad from "./pages/Squad";
import Pro from "./pages/Pro";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Community from "./pages/Community";
import ZunoApp from "./pages/ZunoApp";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Checkout from "@/pages/Checkout";
import Orders from "./pages/Orders";
import Shipping from "./pages/Shipping";
import Warranty from "./pages/Warranty";
import SizeGuide from "./pages/SizeGuide";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminSales from "./pages/AdminSales";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminStock from "./pages/AdminStock";
import AdminUsers from "./pages/AdminUsers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MinhaConta from "./pages/MinhaConta";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/try-on"} component={TryOn} />
      <Route path={"/pulse"} component={Pulse} />
      <Route path={"/lab"} component={Lab} />
      <Route path={"/squad"} component={Squad} />
      <Route path={"/pro"} component={Pro} />
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/community"} component={Community} />
      <Route path={"/app"} component={ZunoApp} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/checkout/success"} component={CheckoutSuccess} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/shipping"} component={Shipping} />
      <Route path={"/warranty"} component={Warranty} />
      <Route path={"/size-guide"} component={SizeGuide} />
      <Route path={"/contact"} component={Contact} />
      {/* Auth routes */}
      <Route path={"/entrar"} component={Login} />
      <Route path={"/cadastro"} component={Register} />
      <Route path={"/minha-conta"} component={MinhaConta} />
      {/* Admin routes */}
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/sales"} component={AdminSales} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/orders/:id"} component={AdminOrderDetail} />
      <Route path={"/admin/stock"} component={AdminStock} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <CartDrawer />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
