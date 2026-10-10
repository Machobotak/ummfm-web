import { STATION_TZ } from "../format";
import type {
  LiveMessage,
  MediaAsset,
  NewsArticle,
  Playlist,
  Profile,
  Program,
  ProgramSchedule,
  RadioEvent,
} from "../types";
import type {
  LiveMessageRow,
  EventRow,
  MediaRow,
  NewsRow,
  PlaylistRow,
  ProfileRow,
  ProgramRow,
  ScheduleRow,
} from "./rows";

/** Kolom `time` Postgres ("06:00:00") → jam dinding "06:00". */
function wallClock(time: string): string {
  return time.slice(0, 5);
}

export function mapProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    hostName: row.host_name,
    isActive: row.is_active,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSchedule(row: ScheduleRow): ProgramSchedule {
  return {
    id: row.id,
    programId: row.program_id,
    dayOfWeek: row.day_of_week,
    startTime: wallClock(row.start_time),
    endTime: wallClock(row.end_time),
    // UI hanya menampilkan WIB (design.md §8.7); kolom timezone disimpan untuk
    // kebutuhan lain di luar MVP.
    timezone: STATION_TZ,
    isActive: row.is_active,
  };
}

export function mapPlaylist(row: PlaylistRow): Playlist {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    externalUrl: row.external_url,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function mapNews(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    thumbnailUrl: row.thumbnail_url,
    coverImageUrl: row.cover_image_url,
    authorName: row.author_name,
    status: row.status,
    // Draft belum punya published_at; tampilkan tanggal dibuat.
    publishedAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapEvent(row: EventRow): RadioEvent {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    posterUrl: row.poster_url,
    location: row.location,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    registrationUrl: row.registration_url === "" ? undefined : row.registration_url,
    status: row.status,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function mapMedia(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    altText: row.alt_text,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function mapLiveMessage(row: LiveMessageRow): LiveMessage {
  return {
    id: row.id,
    name: row.name,
    body: row.body,
    isHidden: row.is_hidden,
    createdAt: row.created_at,
  };
}
