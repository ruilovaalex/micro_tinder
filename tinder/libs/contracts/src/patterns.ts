export const AUTH_PATTERNS = {
  REGISTER: { cmd: 'auth.register' },
  LOGIN: { cmd: 'auth.login' },
  REFRESH: { cmd: 'auth.refresh' },
  ME: { cmd: 'auth.me' },
  LOGOUT: { cmd: 'auth.logout' },
  VALIDATE_USER: { cmd: 'auth.validate-user' },
} as const;

export const USERS_PATTERNS = {
  FIND_ALL: { cmd: 'users.find-all' },
  FIND_ONE: { cmd: 'users.find-one' },
  CREATE_FROM_AUTH: { cmd: 'users.create-from-auth' },
} as const;

export const PROFILES_PATTERNS = {
  FIND_MINE: { cmd: 'profiles.find-mine' },
  FIND_BY_USER_ID: { cmd: 'profiles.find-by-user-id' },
  CREATE_OR_REPLACE: { cmd: 'profiles.create-or-replace' },
  UPDATE: { cmd: 'profiles.update' },
} as const;

export const INTERACTIONS_PATTERNS = {
  CREATE: { cmd: 'interactions.create' },
  FIND_MINE: { cmd: 'interactions.find-mine' },
} as const;

export const MATCHES_PATTERNS = {
  FIND_MINE: { cmd: 'matches.find-mine' },
  TRY_CREATE: { cmd: 'matches.try-create' },
} as const;

export const MESSAGES_PATTERNS = {
  GET_BY_MATCH: { cmd: 'messages.get-by-match' },
  SEND: { cmd: 'messages.send' },
} as const;

export const SUBSCRIPTIONS_PATTERNS = {
  FIND_MINE: { cmd: 'subscriptions.find-mine' },
  UPDATE_MINE: { cmd: 'subscriptions.update-mine' },
  ENSURE_FOR_USER: { cmd: 'subscriptions.ensure-for-user' },
} as const;
