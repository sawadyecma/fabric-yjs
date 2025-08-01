export const clientOrigin = Symbol("self");

export const isSameOrigin = (origin: unknown) => {
  return origin === clientOrigin;
};
