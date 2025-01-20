import { Line } from 'react-chartjs-2';
import { useGetSalesQuery } from '../state/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const { data: sales } = useGetSalesQuery();

  if (!sales) return <p>Loading...</p>;

  const totalSales = sales.reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
  const formattedTotalSales = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NRP'
  }).format(totalSales);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = {
    labels: sales.map(item => formatDate(item.sales_date)),
    datasets: [{
      label: 'Sales',
      data: sales.map(item => item.total_sales),
      borderColor: 'blue',
      pointRadius: 3, // Default point size
      pointHoverRadius: 5, // Size on hover
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10, // Show maximum 10 ticks on x-axis
          maxRotation: 45, // Rotate labels for better readability
          autoSkip: true, // Automatically skip labels if too crowded
        },
        grid: {
          display: false // Remove vertical grid lines
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'NRP',
              maximumSignificantDigits: 3
            }).format(value);
          }
        }
      }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false, // Show tooltip when cursor is anywhere along the vertical line
        callbacks: {
          label: (context) => {
            return `Sales: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'NRP'
            }).format(context.raw)}`;
          }
        }
      },
      legend: {
        display: false // Hide legend since we only have one dataset
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="">
      <div className="p-4 bg-white rounded-t-lg">
        <h2 className="text-xl font-semibold bg-white">Total Sales</h2>
        <p className="text-3xl font-bold text-blue-600 bg-white">{formattedTotalSales}</p>
      </div>

      <div className="w-full h-64 p-4 bg-white rounded-b-lg md:h-96">
        <Line data={chartData} options={options} className='bg-white' />
      </div>
    </div>
  );
};

export default SalesChart;
