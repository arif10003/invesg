import type {ContentSource} from "../types/intelligence";
export interface ScheduledJob{sourceId:string;runAt:string;frequency:ContentSource["crawlFrequency"]}
const intervalHours:Record<ContentSource["crawlFrequency"],number>={hourly:1,six_hourly:6,daily:24,weekly:168,monthly:720};
export class CrawlScheduler{nextRun(source:ContentSource,from=new Date()):ScheduledJob{const runAt=new Date(from.getTime()+intervalHours[source.crawlFrequency]*3_600_000);return{sourceId:source.id,runAt:runAt.toISOString(),frequency:source.crawlFrequency}}isDue(source:ContentSource,now=new Date()){if(!source.lastCrawlAt)return true;return new Date(source.lastCrawlAt).getTime()+intervalHours[source.crawlFrequency]*3_600_000<=now.getTime()}}
