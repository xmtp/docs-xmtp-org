// docs/components/Mermaid.tsx
'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

type MermaidProps = {
  chart: string;
  id?: string;
};

export default function Mermaid({ chart, id = 'mermaid-graph' }: MermaidProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(id, chart);
        if (container.current) {
          container.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (container.current) {
          container.current.innerHTML = `<pre style="color: red;">Failed to render diagram: ${String(error)}</pre>`;
        }
      }
    };

    renderChart();
  }, [chart, id]);

  return <div ref={container} />;
}
