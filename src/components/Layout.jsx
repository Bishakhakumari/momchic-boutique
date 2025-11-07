import FloatingWhatsapp from "./FloatingWhatsapp";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {children}
      <FloatingWhatsapp /> {/* ✅ Visible on every page */}
    </div>
  );
}
