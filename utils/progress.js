let startTime;
let current = 0;
let percentage;

const progressBar = (totalInMilliseconds, size, reset = false) => {
  if (reset) {
    startTime = Date.now();
    current = 0;
  }

  if (!startTime) {
    startTime = Date.now();
  }

  current = Date.now() - startTime;

  const totalInSeconds = totalInMilliseconds / 1000;
  percentage = Math.min((current / 1000) / totalInSeconds, 1);
  const progress = Math.round((size * percentage));
  const emptyProgress = size - progress;

  const progressText = '▇'.repeat(progress);
  const emptyProgressText = '—'.repeat(emptyProgress);
  const percentageText = Math.round(percentage * 100) + '%';

  let elapsedTimeText = new Date(current).toISOString().slice(11, -5);
  let totalTimeText = new Date(totalInMilliseconds).toISOString().slice(11, -5);

  if (totalTimeText.startsWith('00:')) {
    elapsedTimeText = elapsedTimeText.slice(3);
    totalTimeText = totalTimeText.slice(3);
  }

  const progressBarString = elapsedTimeText + ' [' + progressText + emptyProgressText + ']' + percentageText + ' ' + totalTimeText; // Creating and returning the bar

  return { progressBarString, isDone: percentage === 1 };
}
module.exports.progressBar = progressBar;
