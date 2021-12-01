/// <reference lib="webworker" />

addEventListener('message', (ev: MessageEvent<number>) => {
  const oneDayInMilliseconds = 8.64e+7;
  const numberOfIterations = ev.data;
  let total = 0;

  for (let index = 0; index < numberOfIterations; index++) {
    const yesterday = Date.now() - oneDayInMilliseconds;
    const nextDate = ((index + 1) * oneDayInMilliseconds) + yesterday;
    const numberToAdd = (nextDate - yesterday) / oneDayInMilliseconds;
    total += numberToAdd;
  }

  postMessage(total);
});
