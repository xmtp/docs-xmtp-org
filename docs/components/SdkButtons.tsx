import React from 'react';

type SdkButtonsProps = {
  children: React.ReactNode;
};

type SdkButtonProps = {
  href: string;
  children: React.ReactNode;
};

export const SdkButtons = ({ children }: SdkButtonsProps) => {
  return (
    <>
      <style>{`
        .sdk-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin: 20px 0;
        }

        .sdk-button {
          padding: 8px 16px;
          background-color: #4F46E5;
          border-radius: 5px;
          text-decoration: none;
          color: #ffffff;
          font-weight: 400;
          transition: all 0.2s;
        }

        .sdk-button:hover {
          background-color: #4338CA;
        }
      `}</style>
      <div className="sdk-buttons">{children}</div>
    </>
  );
};

export const SdkButton = ({ href, children }: SdkButtonProps) => {
  return (
    <a href={href} className="sdk-button">
      {children}
    </a>
  );
};
