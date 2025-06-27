// Define user roles
export enum UserRole {
  ADMIN = "admin",
  GUEST = "guest",
  USER = "user",
}

// Define HTTP request status
export enum RequestStatus {
  ERROR = "error",
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
}

export enum StateStatus {
  ERROR = "error",
  INIT = "init",
  LOADING = "loading",
  SUCCESS = "success",
}

export enum TabCategory {
  DISCOVER = "Discover",
  POPULAR = "Popular",
  TOP_RATED = "Top Rated",
  UPCOMING = "Upcoming",
}
