import React, { useEffect, useRef, memo } from 'react';

export interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  theme = 'dark',
  autosize = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": autosize,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "fr",
      "enable_publishing": false,
      "hide_top_toolbar": true,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": true,
      "support_host": "https://www.tradingview.com"
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, theme, autosize]);

  return (
    <div 
      className="tradingview-widget-container h-full w-full overflow-hidden" 
      ref={containerRef} 
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
};

export default memo(TradingViewChart);
