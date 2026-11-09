import React from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({
  title,
  description,
  image,
  href,
  icon: Icon,
  theme,
  lead,
  imagePosition,
}) {
  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <Link
      className="card feature-card"
      to={href}
      aria-label={`Explore ${title}`}
      onKeyDown={handleKeyDown}
      style={{ "--card-theme": theme }}
    >
      <div
        className="image"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundPosition: `${imagePosition} center`,
        }}
      />
      <div className="round" aria-hidden="true">
        <Icon />
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <i aria-hidden="true" />
        <b>{lead}</b>
        <p>{description}</p>
      </div>
    </Link>
  );
}
