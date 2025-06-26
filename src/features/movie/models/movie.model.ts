import { z } from "zod";

export const movieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  id: z.number().optional(),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
  overview: z.string().optional(),
  popularity: z.number().optional(),
  poster_path: z.string().optional(),
  release_date: z.string().optional(),
  title: z.string().optional(),
  video: z.boolean(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
});

export const MovieVideoSchema = z.object({
  id: z.string().optional(),
  iso_3166_1: z.string().optional(),
  iso_639_1: z.string().optional(),
  key: z.string().optional(),
  official: z.boolean(),
  published_at: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  site: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
});

export const MovieVideoResponseSchema = z.object({
  id: z.string().optional(),
  results: z.array(MovieVideoSchema).optional(),
});

export const movieResponseSchema = z.object({
  page: z.number().optional(),
  results: z.array(movieSchema).optional(),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
});

// TypeScript type based on the schema
export type Movie = z.infer<typeof movieSchema>;
export type MovieResponse = z.infer<typeof movieResponseSchema>;
export type MovieVideo = z.infer<typeof MovieVideoSchema>;
export type MovieVideoResponse = z.infer<typeof MovieVideoResponseSchema>;
