'use client';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function DataTable({ columns, data, loading, onEdit, onDelete, onView }) {
  if (loading) {
    return (
      <div className="w-full h-64 bg-card/20 animate-pulse rounded-3xl flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pText">
          Fetching Data...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-primary"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-primary text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data?.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-white/5 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-xs font-medium text-pText">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-20 text-center text-pText font-bold uppercase text-[10px] tracking-widest"
                >
                  No records found in the vault.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
