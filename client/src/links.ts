export const HOME_LINK = () => {
  return "/";
};

export const AUTH_LINK = () => {
  return "/auth";
};

export const GROUPS_LINK = () => {
  return "/groups";
};

export const GROUP_LINK = (groupId: number) => {
  return `/groups/${groupId}`;
};

export const GROUP_EVENTS_LINK = (groupId: number) => {
  return `/groups/${groupId}/events`;
};

export const GROUP_USERS_LINK = (groupId: number) => {
  return `/groups/${groupId}/users`;
};

export const EVENT_LINK = (groupId: number, eventId: number) => {
  return `/groups/${groupId}/events/${eventId}`;
};
