import { z } from "zod";

export const CountrySchema = z.object({
  english_name: z.string().optional(),
  iso_3166_1: z.string().optional(),
  name: z.string().optional(),
});

export const LanguageSchema = z.object({
  english_name: z.string().optional(),
  iso_639_1: z.string().optional(),
  native_name: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.number().optional(),
  logo_path: z.string().optional(),
  name: z.string().optional(),
  origin_country: z.string().optional(),
});

export const CollectionSchema = z.object({
  backdrop_path: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  poster_path: z.string().optional(),
});

export const MovieGenreSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const MovieGenreResponseSchema = z.object({
  genres: z.array(MovieGenreSchema).optional(),
});

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().optional(),
  first_air_date: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  origin_country: z.array(z.string()).optional(),
  original_language: z.string().optional(),
  original_name: z.string().optional(),
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

export const MovieResponseSchema = z.object({
  page: z.number().optional(),
  results: z.array(MovieSchema).optional(),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
});

export const MovieDetailSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().optional(),
  belongs_to_collection: CollectionSchema.optional(),
  budget: z.number().optional(),
  genres: z.array(MovieGenreSchema).optional(),
  homepage: z.string().optional(),
  id: z.number().optional(),
  imdb_id: z.string().optional(),
  origin_country: z.array(z.string()).optional(),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
  overview: z.string().optional(),
  popularity: z.number().optional(),
  poster_path: z.string().optional(),
  production_companies: z.array(CompanySchema).optional(),
  production_countries: z.array(CountrySchema).optional(),
  release_date: z.string().optional(),
  revenue: z.number().optional(),
  runtime: z.number().optional(),
  spoken_languages: z.array(LanguageSchema).optional(),
  status: z.string().optional(),
  tagline: z.string().optional(),
  title: z.string().optional(),
  video: z.boolean(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
});

// TypeScript type based on the schema
export type Movie = z.infer<typeof MovieSchema>;
export type MovieResponse = z.infer<typeof MovieResponseSchema>;
export type MovieVideo = z.infer<typeof MovieVideoSchema>;
export type MovieGenreResponse = z.infer<typeof MovieGenreResponseSchema>;
export type MovieGenre = z.infer<typeof MovieGenreSchema>;
export type MovieVideoResponse = z.infer<typeof MovieVideoResponseSchema>;
export type Country = z.infer<typeof CountrySchema>;
export type Collection = z.infer<typeof CollectionSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
