import * as React from 'react';

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const Collapsible = ({ title, children, defaultOpen = false }: CollapsibleProps) => {
  return (
    <>
      <style>{`
        .collapsible-container {
          margin: 1.5rem 0;
          border: 1px solid var(--vocs-color_infoBorder);
          border-radius: var(--vocs-borderRadius_4);
          overflow: hidden;
          background-color: var(--vocs-color_infoBackground);
        }

        .collapsible-summary {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          font-size: var(--vocs-fontSize_14);
          font-weight: 600;
          color: var(--vocs-color_infoText);
          background-color: var(--vocs-color_infoBackground);
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s ease;
          list-style: none;
        }

        .collapsible-summary::-webkit-details-marker {
          display: none;
        }

        .collapsible-summary:hover {
          opacity: 0.9;
        }

        .collapsible-summary:focus-visible {
          outline: 2px solid var(--vocs-color_borderAccent);
          outline-offset: -2px;
        }

        .collapsible-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.2s ease;
          color: var(--vocs-color_infoText);
        }

        .collapsible-container[open] .collapsible-icon {
          transform: rotate(180deg);
        }

        .collapsible-content {
          padding: 1.25rem;
          background-color: var(--vocs-color_infoBackground);
          color: var(--vocs-color_infoText);
          font-size: var(--vocs-fontSize_14);
        }

        .collapsible-content > *:not(:last-child) {
          margin-bottom: var(--vocs-space_16);
        }

        .collapsible-content > *:first-child {
          margin-top: 0;
        }

        .collapsible-content > *:last-child {
          margin-bottom: 0;
        }
      `}</style>
      <details className="collapsible-container" open={defaultOpen}>
        <summary className="collapsible-summary">
          <span>{title}</span>
          <span className="collapsible-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </summary>
        <div className="collapsible-content">
          {children}
        </div>
      </details>
    </>
  );
};
