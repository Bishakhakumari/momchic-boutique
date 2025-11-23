export default function FloatingWhatsApp() {
  const whatsappUrl =
    "https://wa.me/919204613635?text=Hi%20MOMCHIC!%20I%20saw%20your%20collection%20and%20want%20to%20know%20more.";

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const url = whatsappUrl;

    // Fire Google conversion
    try {
      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17695821706/Acj4CNi_5MQbEIQfg_ZB",
        });
      }
    } catch (err) {}

    // Safe delayed redirect
    setTimeout(() => {
      window.location.href = url; // SAME TAB → required for tracking
    }, 300);
  };

  return (
    <a
      href={whatsappUrl}
      onClick={handleWhatsAppClick}
      className="fixed bottom-5 right-5 z-50 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-transform duration-300"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-8 h-8 hover:scale-110 transition-transform"
      />
    </a>
  );
}
