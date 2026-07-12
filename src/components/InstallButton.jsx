    import { useEffect, useState } from "react";

    export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone
        ) {
        setInstalled(true);
        }

        const beforeInstall = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        };

        const installedHandler = () => {
        setInstalled(true);
        setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", beforeInstall);
        window.addEventListener("appinstalled", installedHandler);

        return () => {
        window.removeEventListener("beforeinstallprompt", beforeInstall);
        window.removeEventListener("appinstalled", installedHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    if (installed || !deferredPrompt) return null;

    return (
        <div className="max-w-xl mx-auto px-4 mt-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-2xl shadow-sm px-6 py-4 text-center">

            <h3 className="text-lg md:text-xl font-bold text-gray-800">
        Stay Connected
    </h3>

            <p className="text-sm text-gray-600 mt-2 mb-4 leading-relaxed">
            Get new arrivals, exclusive offers and rental updates — always just one tap away.
            </p>

            <button
            onClick={handleInstall}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-7 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
            >
            📲 Install MOMCHIC App
            </button>

        </div>
        </div>
    );
    }