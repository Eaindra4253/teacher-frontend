export const requestsKeys = {
  all: ["requests"] as const,
  lists: () => [...requestsKeys.all, "list"] as const,
  list: (filters: string) => [...requestsKeys.lists(), { filters }] as const,
  details: () => [...requestsKeys.all, "detail"] as const,
  detail: (id: number) => [...requestsKeys.details(), id] as const,
};

export const storesKeys = {
  all: ["stores"] as const,
  lists: () => [...storesKeys.all, "list"] as const,
  list: (filters: string) => [...storesKeys.lists(), { filters }] as const,
  details: () => [...storesKeys.all, "detail"] as const,
  detail: (id: number) => [...storesKeys.details(), id] as const,
};

export const merchantsKeys = {
  all: ["merchants"] as const,
  lists: () => [...merchantsKeys.all, "list"] as const,
  list: (filters: string) => [...merchantsKeys.lists(), { filters }] as const,
  details: () => [...merchantsKeys.all, "detail"] as const,
  detail: (id: number) => [...merchantsKeys.details(), id] as const,
};

export const historyKeys = {
  all: ["history"] as const,
  lists: () => [...historyKeys.all, "list"] as const,
  list: (filters: string) => [...historyKeys.lists(), { filters }] as const,
  details: () => [...historyKeys.all, "detail"] as const,
  detail: (id: number) => [...historyKeys.details(), id] as const,
};

export const userKeys = {
  all: ["user"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const reportsKeys = {
  all: ["reports"] as const,
  lists: () => [...reportsKeys.all, "list"] as const,
  list: (filters: string) => [...reportsKeys.lists(), { filters }] as const,
  details: () => [...reportsKeys.all, "detail"] as const,
  detail: (id: number) => [...reportsKeys.details(), id] as const,
};

export const requestorKeys = {
  all: ["requestors"] as const,
  lists: () => [...requestorKeys.all, "list"] as const,
  list: (filters: string) => [...requestorKeys.lists(), { filters }] as const,
  details: () => [...requestorKeys.all, "detail"] as const,
  detail: (id: number) => [...requestorKeys.details(), id] as const,
};

export const tabletKeys = {
  all: ["tablets"] as const,
  lists: () => [...tabletKeys.all, "list"] as const,
  list: (filters: string) => [...tabletKeys.lists(), { filters }] as const,
  details: () => [...tabletKeys.all, "detail"] as const,
  detail: (id: number) => [...tabletKeys.details(), id] as const,
};