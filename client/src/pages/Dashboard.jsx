import SalesChart from '../components/SalesChart';
import RecentProperties from '../components/RecentProperties';
import Reviews from '../components/Reviews';
import { useAllPropertiesQuery, useGetPropertiesQuery, useGetClientsQuery, useGetTransactionsQuery } from '../state/api';

const Dashboard = () => {
  // Fetch data using RTK Query
  const { data: properties, isLoading: isLoadingProperties, error: errorProperties } = useAllPropertiesQuery();
  const { data: pendingProperties, isLoading: isLoadingPendingProperties, error: errorPendingProperties } = useGetPropertiesQuery();
  const { data: clients, isLoading: isLoadingClients, error: errorClients } = useGetClientsQuery();
  const { data: transactions, isLoading: isLoadingTransactions, error: errorTransactions } = useGetTransactionsQuery();

  // Handle loading states
  if (
    isLoadingProperties ||
    isLoadingPendingProperties ||
    isLoadingClients ||
    isLoadingTransactions
  ) {
    return <div>Loading...</div>;
  }


  const totalProperties = properties?.length || 0;
  const totalPendingProperties = pendingProperties?.length || 0;
  const totalClients = clients?.length || 0;
  const totalTransactions = transactions?.length || 0;

  return (
    <>
      <div className='px-6 py-10'>
        <h2 className="text-[30px] font-bold mb-4 ">Dashboard Overview</h2>

        <div className="flex justify-between gap-4 ">

          <div className='flex flex-col gap-4 basis-2/5'>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="w-[220px] h-[140px] bg-teal-500 rounded-xl p-4">
                <h3 className="text-sm text-white bg-transparent">Total Properties</h3>
                <h1 className="bg-transparent text-[4rem] font-bold text-white">{totalProperties}</h1>
              </div>
              <div className="w-[220px] h-[140px] bg-red-500 rounded-xl p-4">
                <h3 className="text-sm text-white bg-transparent">Total Clients</h3>
                <h1 className="bg-transparent text-[4rem] font-bold text-white">{totalClients}</h1>
              </div>
              <div className="w-[220px] h-[140px] bg-blue-500 rounded-xl p-4">
                <h3 className="text-sm text-white bg-transparent">Pending Properties</h3>
                <h1 className="bg-transparent text-[4rem] font-bold text-white">{totalPendingProperties}</h1>
              </div>
              <div className="w-[220px] h-[140px] bg-violet-500 rounded-xl p-4">
                <h3 className="text-sm text-white bg-transparent">Total Transactions</h3>
                <h1 className="bg-transparent text-[4rem] font-bold text-white">{totalTransactions}</h1>
              </div>
            </div>

            <div className='mt-2'>
              <RecentProperties />
            </div>
          </div>

          <div className='flex flex-col gap-4 basis-3/5'>
            <div>
              <SalesChart />
            </div>
            <div className='mt-2'>
              <Reviews />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
