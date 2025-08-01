export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const heavyProcess = () => {
  const start = performance.now();
  for (let i = 0; i < 5000000000; i++) {
    // do nothing
  }
  const end = performance.now();
  console.log(`heavyProcess took ${end - start}ms`);
};
