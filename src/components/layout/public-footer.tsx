import * as React from "react";
import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "Regulatory Compliance", href: "#" },
  ];

  return (
    <footer className="w-full py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6 select-none mt-auto">
      <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
        <span className="text-headline-sm font-bold text-on-surface">MedBids</span>
        <span className="text-body-sm text-on-surface-variant">
          © {currentYear} MedBids Marketplace. All rights reserved. Precision Healthcare Logistics.
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-stack-sm md:gap-stack-md">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default PublicFooter;
