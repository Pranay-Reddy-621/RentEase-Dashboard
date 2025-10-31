export const students = [
  { student_id: 1, name: "Riro Irora", email: "riro@example.com" },
  { student_id: 2, name: "Alex Tan", email: "alex@example.com" },
];

export const guards = [
  { guard_id: 1, name: "John", station_id: 1 },
  { guard_id: 2, name: "Alice", station_id: 2 },
];

export const stations = [
  { station_id: 1, name: "Main Gate" },
  { station_id: 2, name: "Library" },
];

export const cycles = [
  { cycle_id: 101, station_id: 1, available: true },
  { cycle_id: 102, station_id: 1, available: false },
  { cycle_id: 103, station_id: 2, available: true },
];

export const sessions = [
  { session_id: 201, student_id: 1, cycle_id: 101, start_time: "2025-10-30T09:00:00", end_time: null },
];

export const payments = [
  { payment_id: 301, session_id: 201, amount: 50, status: "PENDING", created_at: "2025-10-30T09:05:00" },
];

export const penalties = [
  { penalty_id: 401, session_id: 201, amount: 10, status: "PENDING", reason: "Late return" },
];

export const demandStats = [
  { station_id: 1, pickups: 15, returns: 12 },
  { station_id: 2, pickups: 8, returns: 10 },
];
