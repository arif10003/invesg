import type {MomentumLevel,PublicationStatus} from "./intelligence";
export type PillarSlug="environmental"|"social"|"governance";
export type MaterialityLevel="low"|"moderate"|"high"|"context_dependent";
export type UrgencyLevel="monitor"|"prepare"|"act"|"immediate";
export interface SustainabilityIssue{id:string;slug:string;title:string;summary:string;pillarIds:string[];domainIds:string[];topicIds:string[];countryIds:string[];sectorIds:string[];momentum:MomentumLevel;materiality:MaterialityLevel;urgency:UrgencyLevel;evidenceStrength:string;evidenceCount:number;geographicReach:string;lastReviewedAt:string;status:PublicationStatus;isPlaceholder:boolean}
export interface IssueRelation{sourceIssueId:string;targetIssueId:string;relationType:"driver"|"impact"|"risk"|"dependency"|"trade_off"|"related";rationale?:string}
