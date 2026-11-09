import React from "react";

export default function BrandLogo({ placement = "header", className = "", variant = "primary" }) {
  return (
    <img
      className={`brand-logo brand-logo--${placement} ${className}`.trim()}
      src={variant === "reverse" ? "/assets/brand/invesg-logo-reverse.svg" : "/assets/brand/invesg-logo-transparent.svg"}
      alt="invesg"
    />
  );
}
