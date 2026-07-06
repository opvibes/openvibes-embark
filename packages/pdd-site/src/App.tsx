import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider } from "./i18n";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import Landing from "./pages/Landing/Landing";
import Docs from "./pages/Docs/Docs";
import { firstDocSlug } from "./pages/Docs/loadDocs";

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Navigate to={`/docs/${firstDocSlug}`} replace />} />
          <Route path="/docs/:slug" element={<Docs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </I18nProvider>
  );
}
