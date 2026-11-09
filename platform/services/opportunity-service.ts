import type {ApiResult,Opportunity,PageRequest,PageResult} from "../types/intelligence";
import type {CachePort,OpportunityRepository} from "../repositories/contracts";
export class OpportunityService{
  constructor(private readonly repository:OpportunityRepository,private readonly cache:CachePort){}
  async getBySlug(slug:string):Promise<ApiResult<Opportunity>|null>{const key=`opportunity:${slug}`;const cached=await this.cache.get<Opportunity>(key);if(cached)return this.wrap(cached);const value=await this.repository.findBySlug(slug);if(!value||value.status!=="published")return null;await this.cache.set(key,value,300);return this.wrap(value)}
  async search(request:PageRequest):Promise<ApiResult<PageResult<Opportunity>>>{const result=await this.repository.search(request);return this.wrap(result)}
  private wrap<T>(data:T):ApiResult<T>{return{data,meta:{generatedAt:new Date().toISOString(),cacheControl:"public, max-age=60, stale-while-revalidate=300"}}}
}
