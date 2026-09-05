const ET = "America/New_York";

function etParts(at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;

  const weekday = get("weekday");
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));

  if (!weekday || !year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("Could not format ET date");
  }

  return { weekday, iso: `${year}-${month}-${day}`, hour, minute };
}

/** Calendar day in New York, YYYY-MM-DD. */
export function formatEtDate(at: Date): string {
  return etParts(at).iso;
}

export function isWeekdayEt(at: Date): boolean {
  const wd = etParts(at).weekday;
  return wd !== "Sat" && wd !== "Sun";
}

/** Regular session close is 16:00 ET. */
export function isAfterCloseEt(at: Date): boolean {
  const { hour, minute } = etParts(at);
  return hour > 16 || (hour === 16 && minute >= 0);
}