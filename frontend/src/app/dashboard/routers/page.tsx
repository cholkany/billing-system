'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function RoutersPage() {
  const [routers, setRouters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadRouters();
  }, []);

  const loadRouters = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/routers');
      setRouters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (id: string) => {
    try {
      const result = await apiClient(`/routers/${id}/test`, { method: 'POST' });
      alert(result.success ? `Connected! Identity: ${result.identity}` : `Failed: ${result.error}`);
      loadRouters();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  const deleteRouter = async (id: string) => {
    if (!confirm('Delete this router?')) return;
    try {
      await apiClient(`/routers/${id}`, { method: 'DELETE' });
      loadRouters();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Routers</h1>
          <p className="text-sm text-zinc-400">Manage your connected MikroTik devices</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Router
        </button>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>
                  </td>
                </tr>
              ) : routers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No routers found. Add your first MikroTik router to begin.
                  </td>
                </tr>
              ) : routers.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-zinc-200 font-medium">{r.name}</td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{r.ipAddress}:{r.apiPort}</td>
                  <td className="px-6 py-4 text-zinc-400">{r.location || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${r.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {r.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => testConnection(r.id)}
                      className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
                    >
                      Test
                    </button>
                    <button 
                      onClick={() => deleteRouter(r.id)}
                      className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Modal Placeholder - For brevity I will omit full implementation unless needed, 
          the real app would use the shadcn Dialog component. */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md max-h-screen overflow-y-auto">
             <h2 className="text-xl font-bold text-white mb-4">Add Router</h2>
             <p className="text-zinc-500 text-sm mb-6">In a full application, the shadcn UI form with validation would be here to collect IP Address, Username, and Password.</p>
             <div className="flex justify-end">
               <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700">Close</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
