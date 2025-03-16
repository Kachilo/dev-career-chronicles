
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export const WhatsAppButton = ({ phoneNumber }: WhatsAppButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formattedNumber = phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-500 hover:scale-110 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
      aria-label="Contact on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="h-8 w-8" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
        </span>
      </div>
    </a>
  );
};
