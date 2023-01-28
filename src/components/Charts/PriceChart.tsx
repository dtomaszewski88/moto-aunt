/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto';
import clsx from 'clsx';
import { map, noop } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import type { ChartArea, ChartData } from 'chart.js';

import { AuctionData, DataPoint } from './types';

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      onClick: noop,
      labels: {
        filter: (legend: any) => {
          return legend.text !== 'AuctionPoints';
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return context.raw.label ?? context.dataset.label;
        }
      }
    }
  },

  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  scales: {
    xAverageAxis: {
      min: 0,
      max: 11,
      type: 'linear',
      display: false,
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    xPointAxis: {
      axis: 'x',
      min: -365,
      max: 0,
      type: 'linear',
      display: false,
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },

    y: {
      position: 'right',
      grace: `20%`,
      display: false,
      grid: {
        display: false
      },
      border: {
        display: false
      }
    }
  }
};

const getColors = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(1, 'rgba(23, 101, 248 , 1)');
  gradient.addColorStop(0, 'rgba(255, 255, 255 , 1)');

  return {
    borderWidth: 2,
    borderColor: 'rgba(23, 101, 248 , 1)',
    backgroundColor: gradient
  };
};

interface PriceChartProps {
  auctionsData: AuctionData[];
  avgPriceData?: DataPoint[];
  className?: string;
  totalAvgData: DataPoint[];
}

export default function PriceChart(props: PriceChartProps) {
  const { auctionsData, avgPriceData, className, totalAvgData } = props;
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    datasets: []
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !avgPriceData || !totalAvgData) {
      return;
    }

    const chartColors = getColors(chart.ctx, chart.chartArea);

    const pointData = map(auctionsData, (data) => {
      return {
        type: 'scatter' as any,
        xAxisID: 'xPointAxis',
        label: 'AuctionPoints',
        data: data.points,
        fill: true,
        elements: {
          point: {
            radius: 5,
            hoverRadius: 10,
            borderWidth: 0,
            backgroundColor: data.color.value
          }
        }
      };
    });
    const chartData = {
      datasets: [
        ...pointData,
        {
          borderDash: [5, 5],
          borderWidth: 1,
          borderColor: 'rgba(23, 101, 248 , 1)',
          type: 'line' as any,
          xAxisID: 'xAverageAxis',
          label: 'Total Average',
          data: totalAvgData,
          borderCapStyle: 'round',
          elements: {
            point: {
              radius: 0
            }
          }
        },
        {
          ...chartColors,
          type: 'line' as any,
          xAxisID: 'xAverageAxis',
          label: 'Monthly Average',
          data: avgPriceData,
          borderCapStyle: 'round',
          fill: true,
          tension: 0.4,
          elements: {
            point: {
              radius: 0
            }
          }
        }
      ]
    };

    setChartData(chartData as any);
  }, [avgPriceData, totalAvgData, auctionsData]);

  return (
    <div className={clsx(className, 'relative -mr-[10px] -ml-[10px] h-72')}>
      <Chart data={chartData} options={options as any} ref={chartRef} type='line' />
    </div>
  );
}
