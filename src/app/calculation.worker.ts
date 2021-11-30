/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const oneDayInMilliseconds = 8.64e+7;
  let total = 0;
  for(let index = 0; index < 20000000; index++) {
    const yesterday = Date.now() - oneDayInMilliseconds;
    const nextDate = ((index + 1) * oneDayInMilliseconds) + yesterday;
    const numberToAdd = (nextDate - yesterday) / oneDayInMilliseconds;
    total += numberToAdd;
  }

  postMessage(-total);
});
