'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/vouchers');
      setVouchers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (code: string) => {
    // Standard beautiful voucher card printed via simple browser print interface
    // In a full implementation, you'd open a new window and print the ticket design.
    alert(`Printing Voucher Code: ${code}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Vouchers</h1>
          <p className="text-sm text-zinc-400">Generate and print hotspot access codes</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/25 transform active:scale-[0.98]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
           <div className="col-span-full flex justify-center py-12">
             <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
           </div>
        ) : vouchers.length === 0 ? (
          <div className="col-span-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-zinc-400 font-medium text-lg">No Vouchers Found</p>
            <p className="text-zinc-500 text-sm mt-1">Generate a new batch to get started.</p>
          </div>
        ) : (
          vouchers.map((v) => (
            <div key={v.id} className="group relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2.5 py-1 bg-zinc-800 rounded-md text-xs font-medium text-zinc-300 border border-zinc-700">
                    {v.batch}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    v.status === 'unused' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    v.status === 'used' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {v.status}
                  </span>
                </div>
                
                <div className="text-center py-4 px-2 bg-zinc-950/50 rounded-xl border border-zinc-800/80 mb-4 select-all">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Access Code</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-widest leading-none">{v.code}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-zinc-400 text-xs">Price</p>
                    <p className="text-emerald-400 font-bold">${(v.price / 100).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handlePrint(v.code)}
                    disabled={v.status !== 'unused'}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
