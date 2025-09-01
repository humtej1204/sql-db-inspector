export class AppDate extends Date {
  constructor(date?: string | number | Date | undefined) {
    if (date) super(date);
    else super();
  }

  toMYSQLDatetime() {
    return this.toISOString().slice(0, 19).replace("T", " ");
  }

  toMYSLQDate() {
    return this.toISOString().slice(0, 10);
  }

  addTime(time: string) {
    if (!time) return this;
    if (time.includes("s")) return this.addSeconds(Number(time.split("s")[0]));
    if (time.includes("m")) return this.addMinutes(Number(time.split("m")[0]));
    if (time.includes("h")) return this.addHours(Number(time.split("h")[0]));
    if (time.includes("d")) return this.addDays(Number(time.split("d")[0]));
    if (time.includes("M")) return this.addMonths(Number(time.split("M")[0]));
    if (time.includes("y")) return this.addYears(Number(time.split("y")[0]));
    return this;
  }

  addYears(year: number) {
    this.setFullYear(this.getFullYear() + year);
    return this;
  }

  addMonths(months: number) {
    this.setMonth(this.getMonth() + months);
    return this;
  }

  addDays(days: number) {
    this.setDate(this.getDate() + days);
    return this;
  }

  addHours(hours: number) {
    this.setHours(this.getHours() + hours);
    return this;
  }

  addMinutes(minutes: number) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
  }

  addSeconds(seconds: number) {
    this.setSeconds(this.getSeconds() + seconds);
    return this;
  }

  isAfter(date: string | undefined | null) {
    if (!date) return true;
    return this.getTime() > new Date(date).getTime();
  }

  diff(endDate: string | undefined | null): number {
    if (!endDate) return 0;
    const end = new Date(endDate);
    return end.getTime() - this.getTime();
  }
}
