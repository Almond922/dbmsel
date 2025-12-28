'use client';

export default function Table({ columns = [], data = [], onEdit, onDelete }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {safeData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            safeData.map((row, idx) => {
              let expiryClass = '';
              try {
                if (row.expiry_time) {
                  const diff = new Date(row.expiry_time) - Date.now();
                  const sixHours = 6 * 60 * 60 * 1000;
                  if (diff <= 0) expiryClass = 'bg-red-50';
                  else if (diff <= sixHours) expiryClass = 'bg-yellow-50';
                }
              } catch (e) {
                // ignore
              }

              return (
                <tr key={idx} className={`hover:bg-gray-50 ${expiryClass}`}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onEdit?.(row)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(row)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

