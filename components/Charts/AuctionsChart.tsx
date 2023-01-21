/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto';
import clsx from 'clsx';
import { map, times } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const twcolors = (fullConfig.theme?.colors as Record<string, string>) ?? {};

type DataPoint = { label?: string; x: number; y: number };

type AuctionData = {
  color: {
    name: string;
    value: string;
  };
  domain: string;
  points: DataPoint[];
};

interface AuctionsChartProps {
  auctionsData: AuctionData[];
  className?: string;
}

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  }
};

export const AuctionsChart = (props: AuctionsChartProps) => {
  const { auctionsData, className } = props;
  const chartRef = useRef<ChartJS>(null);

  const [chartData, setChartData] = useState({
    datasets: []
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !auctionsData) {
      return;
    }

    const chartData = {
      labels: map(auctionsData, 'domain'),
      datasets: [
        {
          label: '# of Auctions',
          data: map(auctionsData, ({ points }) => points.length),
          backgroundColor: map(auctionsData, ({ color }) => color.value),
          borderColor: map(auctionsData, ({ color }) => color.value),
          borderWidth: 1
        }
      ]
    };

    setChartData(chartData as any);
  }, [auctionsData]);
  return (
    <div className={clsx(className, 'w-full h-full relative')}>
      <Chart data={chartData as any} options={options as any} ref={chartRef} type='doughnut' />
    </div>
  );
};

export default AuctionsChart;
