/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto';
import clsx from 'clsx';
import { map } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import { AuctionData } from './types';

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  }
};

interface AuctionsChartProps {
  auctionsData: AuctionData[];
  className?: string;
}

export default function AuctionsChart(props: AuctionsChartProps) {
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
}
