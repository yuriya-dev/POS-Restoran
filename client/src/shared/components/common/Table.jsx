import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

/**
 * Komponen Tabel Generik.
 * * @param {Array<{header: string, accessor: string, render?: (value: any, item: object, index: number) => React.ReactNode}>} columns - Definisi kolom.
 * @param {Array<object>} data - Data yang akan ditampilkan.
 * @param {string} emptyMessage - Pesan yang ditampilkan jika data kosong.
 */
const Table = ({ columns, data, emptyMessage = 'Tidak ada data ditemukan.', className = '' }) => {

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
                <AlertTriangle className="w-8 h-8 mb-3 text-yellow-500 dark:text-yellow-400" />
                <p className="text-sm font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto shadow-md rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 ${className}`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                
                {/* Header Tabel */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body Tabel */}
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-200">
                    {data.map((item, rowIndex) => (
                        <tr key={item.id || rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                            {columns.map((column, colIndex) => {
                                const cellValue = item[column.accessor];
                                
                                const content = column.render 
                                    ? column.render(cellValue, item, rowIndex)
                                    : cellValue;

                                return (
                                    <td 
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
                                    >
                                        {content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;