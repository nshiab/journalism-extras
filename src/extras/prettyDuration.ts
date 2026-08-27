/** Formats the duration between two timestamps as a human-readable string. */
export default function prettyDuration(
  start: Date | number,
  options: {
    log?: boolean;
    end?: Date | number;
    prefix?: string;
    suffix?: string;
  } = {},
): string {
  if (start instanceof Date) {
    start = start.getTime();
  }

  let end;
  if (options.end instanceof Date) {
    end = options.end.getTime();
  } else if (typeof options.end === "number") {
    end = options.end;
  } else {
    end = Date.now();
  }

  const differenceInMs = end - start;
  let prettyDuration = "";

  if (differenceInMs < 1000) {
    prettyDuration = `${differenceInMs} ms`;
  } else if (differenceInMs < 60_000) {
    const sec = Math.floor(differenceInMs / 1000);
    const ms = differenceInMs % 1000;
    prettyDuration = `${sec} sec, ${ms} ms`;
  } else if (differenceInMs < 3_600_000) {
    const min = Math.floor(differenceInMs / 60_000);
    const remainingMs = differenceInMs % 60_000;
    const sec = Math.floor(remainingMs / 1000);
    const ms = remainingMs % 1000;
    prettyDuration = `${min} min, ${sec} sec, ${ms} ms`;
  } else if (differenceInMs < 86_400_000) {
    const hours = Math.floor(differenceInMs / 3_600_000);
    const remainingMsAfterHours = differenceInMs % 3_600_000;
    const min = Math.floor(remainingMsAfterHours / 60_000);
    const remainingMsAfterMinutes = remainingMsAfterHours % 60_000;
    const sec = Math.floor(remainingMsAfterMinutes / 1000);
    const ms = remainingMsAfterMinutes % 1000;
    prettyDuration = `${hours} h, ${min} min, ${sec} sec, ${ms} ms`;
  } else if (differenceInMs < 2_592_000_000) {
    const days = Math.floor(differenceInMs / 86_400_000);
    const remainingMsAfterDays = differenceInMs % 86_400_000;
    const hours = Math.floor(remainingMsAfterDays / 3_600_000);
    const remainingMsAfterHours = remainingMsAfterDays % 3_600_000;
    const min = Math.floor(remainingMsAfterHours / 60_000);
    const remainingMsAfterMin = remainingMsAfterHours % 60_000;
    const sec = Math.floor(remainingMsAfterMin / 1000);
    const ms = remainingMsAfterMin % 1000;
    prettyDuration = `${days} ${
      days <= 1 ? "day" : "days"
    }, ${hours} h, ${min} min, ${sec} sec, ${ms} ms`;
  } else if (differenceInMs < 31_536_000_000) {
    const months = Math.floor(differenceInMs / 2_592_000_000);
    const remainingMsAfterMonths = differenceInMs % 2_592_000_000;
    const days = Math.floor(remainingMsAfterMonths / 86_400_000);
    const remainingMsAfterDays = differenceInMs % 86_400_000;
    const hours = Math.floor(remainingMsAfterDays / 3_600_000);
    const remainingMsAfterHours = remainingMsAfterDays % 3_600_000;
    const min = Math.floor(remainingMsAfterHours / 60_000);
    const remainingMsAfterMin = remainingMsAfterHours % 60_000;
    const sec = Math.floor(remainingMsAfterMin / 1000);
    const ms = remainingMsAfterMin % 1000;
    prettyDuration = `${months} ${months <= 1 ? "month" : "months"}, ${days} ${
      days <= 1 ? "day" : "days"
    }, ${hours} h, ${min} min, ${sec} sec, ${ms} ms`;
  } else {
    const years = Math.floor(differenceInMs / 31_536_000_000);
    const remainingMsAfterYears = differenceInMs % 31_536_000_000;
    const months = Math.floor(remainingMsAfterYears / 2_592_000_000);
    const remainingMsAfterMonths = differenceInMs % 2_592_000_000;
    const days = Math.floor(remainingMsAfterMonths / 86_400_000);
    const remainingMsAfterDays = differenceInMs % 86_400_000;
    const hours = Math.floor(remainingMsAfterDays / 3_600_000);
    const remainingMsAfterHours = remainingMsAfterDays % 3_600_000;
    const min = Math.floor(remainingMsAfterHours / 60_000);
    const remainingMsAfterMin = remainingMsAfterHours % 60_000;
    const sec = Math.floor(remainingMsAfterMin / 1000);
    const ms = remainingMsAfterMin % 1000;
    prettyDuration = `${years} ${years <= 1 ? "year" : "years"}, ${months} ${
      months <= 1 ? "month" : "months"
    }, ${days} ${
      days <= 1 ? "day" : "days"
    }, ${hours} h, ${min} min, ${sec} sec, ${ms} ms`;
  }

  if (typeof options.prefix === "string") {
    prettyDuration = `${options.prefix}${prettyDuration}`;
  }
  if (typeof options.suffix === "string") {
    prettyDuration = `${prettyDuration}${options.suffix}`;
  }

  if (options.log === true) {
    console.log(prettyDuration);
  }

  return prettyDuration;
}
