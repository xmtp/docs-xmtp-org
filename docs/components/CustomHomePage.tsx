import React from "react";
import { Link } from "react-router-dom";

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="custom-homepage">{children}</div>
);

const Headline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h1 className="custom-homepage-headline">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === "p") {
          const childElement = child as React.ReactElement<{
            className?: string;
          }>;
          return React.cloneElement(childElement, {
            className:
              `custom-homepage-headline-text ${childElement.props.className || ""}`.trim(),
          });
        }
        return <span className="custom-homepage-headline-text">{child}</span>;
      })}
    </h1>
  );
};

const Subhead: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="custom-homepage-subhead">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === "p") {
          const childElement = child as React.ReactElement<{
            className?: string;
          }>;
          return React.cloneElement(childElement, {
            className:
              `custom-homepage-subhead-text ${childElement.props.className || ""}`.trim(),
          });
        }
        return <span className="custom-homepage-subhead-text">{child}</span>;
      })}
    </div>
  );
};

const TileGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="custom-homepage-grid">{children}</div>
);

interface TileProps {
  href: string;
  title: string;
  description: string;
  icon?: string;
  isExternal?: boolean;
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="custom-homepage-tile-external-icon"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const Tile: React.FC<TileProps> = ({
  href,
  title,
  description,
  icon,
  isExternal,
}) => {
  const content = (
    <>
      {icon && <span className="custom-homepage-tile-icon">{icon}</span>}
      <h2 className="custom-homepage-tile-title">{title}</h2>
      <p className="custom-homepage-tile-description">{description}</p>
      {isExternal && (
        <img
          src="/.vocs/icons/arrow-diagonal.svg"
          alt=""
          className="custom-homepage-tile-external-icon"
        />
      )}
    </>
  );

  return isExternal ? (
    <a
      href={href}
      className="custom-homepage-tile custom-homepage-tile-external"
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link to={href} className="custom-homepage-tile">
      {content}
    </Link>
  );
};

interface SDKTileProps {
  href: string;
  src?: string;
  lightSrc?: string;
  darkSrc?: string;
  alt: string;
  name?: string;
}
const SDKGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="custom-homepage-sdk-grid">{children}</div>
);
const SDKTile: React.FC<SDKTileProps> = ({
  href,
  src,
  lightSrc,
  darkSrc,
  alt,
  name,
}) => (
  <Link to={href} className="custom-homepage-sdk-tile">
    {src ? (
      <img src={src} alt={alt} className="custom-homepage-sdk-icon" />
    ) : (
      <>
        <img
          src={lightSrc}
          alt={alt}
          className="custom-homepage-sdk-icon light-mode-icon"
        />
        <img
          src={darkSrc}
          alt={alt}
          className="custom-homepage-sdk-icon dark-mode-icon"
        />
      </>
    )}
    {name && <p className="custom-homepage-sdk-name">{name}</p>}
  </Link>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="custom-homepage-tile-title custom-homepage-section-title">
    {children}
  </h2>
);

export const CustomHomePage = {
  Root,
  Headline,
  Subhead,
  TileGrid,
  Tile,
  SDKGrid,
  SDKTile,
  SectionTitle,
};
