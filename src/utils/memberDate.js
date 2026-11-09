export function memberDate(value) {
 if (!value) return null;
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) return null;
 return new Intl.DateTimeFormat('en-GB', {day:'numeric', month:'short', year:'numeric',timeZone:'Asia/Jakarta'}).format(date);
}
