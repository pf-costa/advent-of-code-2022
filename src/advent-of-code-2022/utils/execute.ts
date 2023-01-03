const execute = (callback: (stop: () => void) => void, interval = 0) => {
  if (interval === 0) {
    let execute = true;
    let stop = () => (execute = false);

    while (execute) {
      callback(stop);
    }

    return;
  }

  const cleanup: NodeJS.Timer = setInterval(
    () => callback(() => clearInterval(cleanup)),
    interval
  );
};

export default execute;
