"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAccessories: 0,
    totalRentals: 0,
    totalRepairServices: 0,
    totalRepairRequests: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [accessoriesRes, rentalsRes, repairServicesRes, repairRequestsRes] =
        await Promise.all([
          fetch("/api/accessories"),
          fetch("/api/accessory-rentals"),
          fetch("/api/repair-services"),
          fetch("/api/repair-requests"),
        ]);

      const accessories = await accessoriesRes.json();
      const rentals = await rentalsRes.json();
      const repairServices = await repairServicesRes.json();
      const repairRequests = await repairRequestsRes.json();

      setStats({
        totalAccessories: accessories.length,
        totalRentals: rentals.length,
        totalRepairServices: repairServices.length,
        totalRepairRequests: repairRequests.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <h1 className="text-5xl font-medium tracking-tight mb-12">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Total Rentals</div>
          <div className="text-3xl font-medium">{stats.totalRentals}</div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Total Accessories</div>
          <div className="text-3xl font-medium">{stats.totalAccessories}</div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Total Rentals</div>
          <div className="text-3xl font-medium">{stats.totalRentals}</div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Repair Services</div>
          <div className="text-3xl font-medium">
            {stats.totalRepairServices}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Repair Requests</div>
          <div className="text-3xl font-medium text-yellow-400">
            {stats.totalRepairRequests}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Link
          href="/admin/photography-page"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Photography Page</h3>
            <svg
              className="h-5 w-5 text-white/40 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">
            Edit photography & videography page content
          </p>
        </Link>

        <Link
          href="/admin/accessories"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Accessories</h3>
            <svg
              className="h-5 w-5 text-white/40 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">
            Manage camera and accessory rentals
          </p>
        </Link>

        <Link
          href="/admin/repair-services"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Repair Services</h3>
            <svg
              className="h-5 w-5 text-white/40 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">
            Manage repair service offerings
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Settings</h3>
            <svg
              className="h-5 w-5 text-white/40 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">
            Configure site settings and appearance
          </p>
        </Link>
      </div>
    </div>
  );
}
