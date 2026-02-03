"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  studio: {
    id: string;
    name: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudios: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studiosRes, bookingsRes] = await Promise.all([
          fetch("/api/studios"),
          fetch("/api/bookings"),
        ]);

        const studios = await studiosRes.json();
        const bookings = await bookingsRes.json();

        setStats({
          totalStudios: studios.length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === "PENDING")
            .length,
          approvedBookings: bookings.filter((b: any) => b.status === "APPROVED")
            .length,
        });

        // Set calendar events
        const approvedBookings = bookings.filter(
          (b: Booking) => b.status === "APPROVED",
        );
        const calendarEvents: CalendarEvent[] = approvedBookings.map(
          (booking: Booking) => ({
            id: booking.id,
            title: `${booking.studio.name} - ${booking.customerName}`,
            start: new Date(booking.startTime),
            end: new Date(booking.endTime),
            resource: booking,
          }),
        );
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEvent(event);
    setShowModal(true);
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <h1 className="text-5xl font-medium tracking-tight mb-12">
        Photographer Dashboard
      </h1>

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
          <div className="text-sm text-white/60 mb-1">Total Packages</div>
          <div className="text-3xl font-medium">{stats.totalStudios}</div>
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
          <div className="text-sm text-white/60 mb-1">Total Sessions</div>
          <div className="text-3xl font-medium">{stats.totalBookings}</div>
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
          <div className="text-sm text-white/60 mb-1">Pending Requests</div>
          <div className="text-3xl font-medium text-yellow-400">
            {stats.pendingBookings}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-white/60 mb-1">Confirmed Sessions</div>
          <div className="text-3xl font-medium text-green-400">
            {stats.approvedBookings}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <Link
          href="/admin/studios"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Manage Packages</h3>
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
            Create, edit, and manage photography packages
          </p>
        </Link>

        <Link
          href="/admin/bookings"
          className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Manage Sessions</h3>
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
            View and manage all photography sessions
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
      </div>

      {/* Calendar View */}
      <div className="mb-12">
        <h2 className="text-3xl font-medium tracking-tight mb-4">
          Confirmed Sessions Calendar
        </h2>
        <p className="text-white/60 mb-6">
          View all confirmed photography sessions
        </p>
        <div
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
          style={{ height: "700px" }}
        >
          <style jsx global>{`
            .rbc-calendar {
              font-family: inherit;
              color: white;
            }
            .rbc-header {
              padding: 12px 6px;
              font-weight: 500;
              font-size: 0.875rem;
              color: rgba(255, 255, 255, 0.6);
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .rbc-month-view {
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .rbc-day-bg {
              border-left: 1px solid rgba(255, 255, 255, 0.1);
            }
            .rbc-month-row {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .rbc-date-cell {
              padding: 6px;
              text-align: right;
            }
            .rbc-today {
              background-color: rgba(255, 255, 255, 0.05);
            }
            .rbc-off-range-bg {
              background-color: rgba(255, 255, 255, 0.02);
            }
            .rbc-event {
              background-color: rgba(255, 255, 255, 0.9);
              color: black;
              border-radius: 6px;
              padding: 2px 6px;
              font-size: 0.75rem;
              border: none;
            }
            .rbc-event:hover {
              background-color: white;
            }
            .rbc-event-label {
              display: none;
            }
            .rbc-toolbar {
              padding: 12px;
              margin-bottom: 16px;
              flex-wrap: wrap;
              gap: 12px;
            }
            .rbc-toolbar button {
              color: white;
              border: 1px solid rgba(255, 255, 255, 0.2);
              background-color: rgba(255, 255, 255, 0.05);
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 0.875rem;
              transition: all 0.2s;
            }
            .rbc-toolbar button:hover {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
            }
            .rbc-toolbar button:active,
            .rbc-toolbar button.rbc-active {
              background-color: white;
              color: black;
              border-color: white;
            }
            .rbc-btn-group button + button {
              margin-left: 0;
            }
          `}</style>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
            defaultView="month"
          />
        </div>
      </div>

      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-medium mb-6">Session Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60">
                  Package
                </label>
                <p className="text-lg">{selectedEvent.resource.studio.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60">
                  Customer
                </label>
                <p className="text-lg">{selectedEvent.resource.customerName}</p>
                <p className="text-sm text-white/60">
                  {selectedEvent.resource.customerEmail}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60">
                  Date & Time
                </label>
                <p className="text-lg">
                  {new Date(selectedEvent.resource.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-white/60">
                  to {new Date(selectedEvent.resource.endTime).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60">
                  Total Price
                </label>
                <p className="text-lg">${selectedEvent.resource.totalPrice}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60">
                  Status
                </label>
                <p>
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                    {selectedEvent.resource.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedEvent(null);
                }}
                className="px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
