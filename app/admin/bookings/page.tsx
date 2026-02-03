"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  notes: string | null;
  cancelReason: string | null;
  studio: {
    id: string;
    name: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  async function updateBookingStatus(
    bookingId: string,
    status: string,
    reason?: string,
  ) {
    if (status === "CANCELLED") {
      setIsSubmittingCancel(true);
    } else {
      setLoadingBookingId(bookingId);
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, cancelReason: reason }),
      });

      if (res.ok) {
        fetchBookings();
        setShowModal(false);
        setSelectedBooking(null);
        setCancelReason("");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setLoadingBookingId(null);
      setIsSubmittingCancel(false);
    }
  }

  function openCancelModal(booking: Booking) {
    setSelectedBooking(booking);
    setShowModal(true);
  }

  const filteredBookings =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <h1 className="text-5xl font-medium tracking-tight mb-12">
        Manage Sessions
      </h1>

      <div className="mb-8 flex gap-3">
        {["ALL", "PENDING", "APPROVED", "CANCELLED", "COMPLETED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ),
        )}
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-white/40"
                >
                  No sessions found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">
                      {booking.customerName}
                    </div>
                    <div className="text-sm text-white/40">
                      {booking.customerEmail}
                    </div>
                    {booking.customerPhone && (
                      <div className="text-xs text-white/40">
                        {booking.customerPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {booking.studio.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {new Date(booking.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(booking.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(booking.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "APPROVED"
                          ? "bg-green-500/20 text-green-400"
                          : booking.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : booking.status === "CANCELLED"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {booking.status === "PENDING" && (
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "APPROVED")
                          }
                          disabled={loadingBookingId === booking.id}
                          className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loadingBookingId === booking.id ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Approving...
                            </>
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={loadingBookingId === booking.id}
                          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-medium mb-4">Cancel Session</h3>
            <p className="text-white/60 mb-6">
              Cancel session for {selectedBooking.customerName}?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20 resize-none"
                placeholder="Enter reason for cancellation..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
                  setCancelReason("");
                }}
                className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() =>
                  updateBookingStatus(
                    selectedBooking.id,
                    "CANCELLED",
                    cancelReason,
                  )
                }
                disabled={isSubmittingCancel}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingCancel ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
