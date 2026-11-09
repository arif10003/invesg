import type {ContentItem,ContentSource,Opportunity,PageRequest,PageResult} from "../types/intelligence";
export interface OpportunityRepository{findBySlug(slug:string):Promise<Opportunity|null>;search(request:PageRequest):Promise<PageResult<Opportunity>>;save(value:Opportunity):Promise<Opportunity>}
export interface ContentRepository{findByCanonicalUrl(url:string):Promise<ContentItem|null>;findByHash(hash:string,publishedAt?:string):Promise<ContentItem|null>;search(request:PageRequest):Promise<PageResult<ContentItem>>;save(value:ContentItem):Promise<ContentItem>}
export interface SourceRegistryRepository{findRunnable(now:string):Promise<ContentSource[]>;findById(id:string):Promise<ContentSource|null>;save(value:ContentSource):Promise<ContentSource>}
export interface SearchIndexRepository{indexContent(content:ContentItem):Promise<void>;indexOpportunity(opportunity:Opportunity):Promise<void>}
export interface CachePort{get<T>(key:string):Promise<T|null>;set<T>(key:string,value:T,ttlSeconds:number):Promise<void>;delete(key:string):Promise<void>}
