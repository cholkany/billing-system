'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface Stats {
  totalRouters: number;
  onlineRouters: number;
  activeHotspotUsers: number;
  totalUsers: number;
  totalVouchers: number;
  usedVouchers: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiClient('/stats');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Online Routers', value: `${stats?.onlineRouters || 0} / ${stats?.totalRouters || 0}`, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { title: 'Active Connects', value: stats?.activeHotspotUsers || 0, icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { title: 'Total Vouchers', value: stats?.totalVouchers || 0, icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/20' },
    { title: 'Used Vouchers', value: stats?.usedVouchers || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-sm text-zinc-400">Monitor your MikroTik networks in real-time</p>
        </div>
        <button 
          onClick={loadStats} 
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-zinc-700 max-w-max"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div 
            key={i} 
            className="group relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 overflow-hidden hover:bg-zinc-800/50 transition-colors"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} ${stat.shadow} shadow-lg text-white`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white">Network Activity</h2>
            <div className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">Last 24 Hours</div>
          </div>
          {/* Simulated Chart for Aesthetics */}
          <div className="h-64 flex items-end gap-2 mt-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent rounded-lg pointer-events-none" />
            {[40, 60, 30, 80, 50, 90, 45, 75, 55, 100, 65, 85].map((val, i) => (
              <div key={i} className="flex-1 shrink-0 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-t-lg relative group transition-colors h-full flex items-end">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" 
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl">
                    {val} Mbps
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">User user{i}_hs connected</p>
                  <p className="text-xs text-zinc-500">{i * 2} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
