import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import Landing from "./pages/Landing/Landing";
import Docs from "./pages/Docs/Docs";

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </I18nProvider>
  );
}
