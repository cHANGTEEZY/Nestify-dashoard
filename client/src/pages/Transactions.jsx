import { useGetTransactionsQuery } from '../state/api';

const Transactions = () => {
  const { data, isLoading, error } = useGetTransactionsQuery();
  console.log(data)

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="px-6 py-10 text-red-500">
      Error loading transactions. Please try again later.
    </div>
  );

  return (
    <div className="px-6 py-10">
      <h2 className="text-[30px] font-bold mb-4">Transactions</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booked By
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="w-1/12  py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guests
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((transaction) => (
              <tr key={transaction.booking_id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.booking_id}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.booked_by}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {transaction.property_name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.booking_status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.booking_status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div className='text-xs text-gray-400'>
                    {new Date(transaction.booking_start_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    to {new Date(transaction.booking_end_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {transaction.total_guests}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {parseFloat(transaction.total_price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;