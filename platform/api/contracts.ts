import type {ApiResult,ContentItem,Opportunity,PageRequest,PageResult} from "../types/intelligence";
export interface PublicApiContract{
  listOpportunities(request:PageRequest):Promise<ApiResult<PageResult<Opportunity>>>;
  getOpportunity(slug:string):Promise<ApiResult<Opportunity>|null>;
  listOpportunityContent(slug:string,request:PageRequest):Promise<ApiResult<PageResult<ContentItem>>>;
  search(request:PageRequest):Promise<ApiResult<PageResult<ContentItem|Opportunity>>>;
}
export const opportunityApiRoutes=["GET /api/opportunities","GET /api/opportunities/:slug","GET /api/opportunities/:slug/news","GET /api/opportunities/:slug/research","GET /api/opportunities/:slug/reports","GET /api/opportunities/:slug/policies","GET /api/opportunities/:slug/organizations","GET /api/opportunities/:slug/countries","GET /api/opportunities/:slug/market-metrics","GET /api/opportunities/:slug/investment-signals","GET /api/search","POST /api/leads"] as const;
