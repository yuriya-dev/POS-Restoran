import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { data, cards } from '../utils';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const IconComponent = card.icon; 
          
          return (
            <div
              key={card.title}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl text-blue-500">
                    <IconComponent size={24} /> 
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Penjualan Minggu Ini</h3>
        <div className="h-80">
          <BarChart
            width={800}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#0088FE" name="Penjualan (Rp)" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}