export type StreamId = "technology" | "culture" | "gaming" | "management" | "impact";


export interface Stream {
  id: StreamId;
  index: string;
  name: string;
  line: string;
  description: string;
  accent: string;
  glow: string;
  image: string;
  stats: { label: string; value: string }[];
  /** normalised position inside the convergence field (0..1) */
  node: { x: number; y: number };
}

export interface FestEvent {
  id: string;
  name: string;
  stream: StreamId;
  day: 1 | 2 | 3;
  date: string;
  time: string;
  venue: string;
  blurb: string;
  prize?: string;
  seats: number;
  registered: number;
  image: string;
  featured?: boolean;
  status: "open" | "closing" | "full";
}

export interface ScheduleDay {
  id: string;
  day: string;
  title: string;
  date: string;
  intensity: number;
  statement: string;
  description: string;
  image: string;
  beats: { time: string; label: string }[];
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
  tag: string;
  span: "wide" | "tall" | "std";
}

export interface Sponsor {
  id: string;
  name: string;
  tier: "Title" | "Powered By" | "Associate" | "Partner";
  note: string;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  body: string;
  pinned?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "volunteer" | "event_head";
  college?: string;
  station?: string;
  joined: string;
}

export interface Registration {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  eventName: string;
  createdAt: string;
  status: "confirmed" | "waitlist";
}

export interface CheckInRecord {
  id: string;
  ticketCode: string;
  attendeeName: string;
  college: string;
  eventName: string;
  station: string;
  scannedBy: string;
  scannedAt: string;
  status: "approved" | "duplicate" | "invalid";
  notes?: string;
}
