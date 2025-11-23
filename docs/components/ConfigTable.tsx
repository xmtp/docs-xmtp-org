import React from 'react';

type ConfigTableProps = {
  children: React.ReactNode;
};

export const ConfigTable = ({ children }: ConfigTableProps) => {
  return (
    <>
      <style>{`
        .config-table-wrapper {
          overflow-x: auto;
        }

        .config-table-wrapper table {
          table-layout: fixed;
          width: 100%;
          min-width: 900px;
        }

        .config-table-wrapper table th:nth-child(1),
        .config-table-wrapper table td:nth-child(1) {
          width: 15%;
        }

        .config-table-wrapper table th:nth-child(2),
        .config-table-wrapper table td:nth-child(2) {
          width: 8%;
        }

        .config-table-wrapper table th:nth-child(3),
        .config-table-wrapper table td:nth-child(3) {
          width: 20%;
        }

        .config-table-wrapper table th:nth-child(4),
        .config-table-wrapper table td:nth-child(4) {
          width: 17%;
        }

        .config-table-wrapper table th:nth-child(5),
        .config-table-wrapper table td:nth-child(5) {
          width: 40%;
        }
      `}</style>
      <div className="config-table-wrapper">{children}</div>
    </>
  );
};
