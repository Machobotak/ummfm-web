import type { ContentStatus, EventStatus, UserRole } from "../types";

// Bentuk baris Postgres apa adanya (snake_case), persis kolom di
// supabase/migrations/0001_init.sql dan 0002_live_messages.sql. Mapper di
// ./mappers.ts yang mengubahnya.
// `time` dikirim supabase-js sebagai "HH:MM:SS"; timestamptz sebagai ISO string.

export interface ProgramRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleRow {
  id: string;
  program_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  host_name: string;
  timezone: string;
  is_active: boolean;
}

export interface NewsRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  thumbnail_url: string;
  cover_image_url: string;
  author_id: string | null;
  author_name: string;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  location: string;
  starts_at: string;
  ends_at: string;
  registration_url: string;
  status: EventStatus;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  display_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface SettingRow {
  id: string;
  key: string;
  value: unknown;
  updated_by: string | null;
  updated_at: string;
}

export interface LiveMessageRow {
  id: string;
  name: string;
  body: string;
  is_hidden: boolean;
  created_at: string;
}
