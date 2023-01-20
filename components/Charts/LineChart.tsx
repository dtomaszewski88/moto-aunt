import { Chart as ChartJS, elements } from 'chart.js';
import 'chart.js/auto';
import { map } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';

import type { ChartArea, ChartData } from 'chart.js';

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: true,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5,
        maxRotation: 0,
        minRotation: 0
      },
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    xPointAxis: {
      axis: 'x',
      display: true,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5,
        maxRotation: 0,
        minRotation: 0
      },
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    y: {
      display: true,
      beginAtZero: true,
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

  gradient.addColorStop(1, 'blue');
  //   gradient.addColorStop(0.25, 'cyan');
  gradient.addColorStop(0, 'cyan');
  //   gradient.addColorStop(0, 'transparent');

  return {
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: gradient
  };
};

interface LineChartProps {
  avgPriceData?: { label: string; value: number }[];
  //   colorScheme: string;
  pointsData?: { x: number; y: number }[];
}

export default function LineChart(props: LineChartProps) {
  const { avgPriceData, pointsData } = props;
  console.log('data', avgPriceData);
  //   const data = useMemo(() => [1, 5, 20, 50], []);
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    datasets: []
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !avgPriceData || !pointsData) {
      return;
    }

    const chartColors = getColors(chart.ctx, chart.chartArea);
    const chartData = {
      labels: map(avgPriceData, 'label'),
      datasets: [
        {
          type: 'scatter' as any,
          data: pointsData,
          fill: true,
          elements: {
            point: {
              radius: 10,
              hoverRadius: 10
            }
          }
        },
        {
          ...chartColors,
          type: 'line' as any,
          data: map(avgPriceData, 'value'),
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

    setChartData(chartData);
  }, [avgPriceData, pointsData]);

  return (
    <div className='w-96 h-48 relative'>
      <Chart data={chartData} options={options} ref={chartRef} type='line' />
    </div>
  );
}
