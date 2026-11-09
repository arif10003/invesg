import type {ContentSource,TrustLevel} from "../types/intelligence";
import type {DuplicateDetector,ParsedDocument,QualityValidator,ValidationResult} from "./types";
export class RuleBasedQualityValidator implements QualityValidator{
  validate(source:ContentSource,document:ParsedDocument):ValidationResult{const errors:string[]=[];const warnings:string[]=[];if(!document.title.trim())errors.push("missing_title");if(!document.canonicalUrl.startsWith("http"))errors.push("invalid_canonical_url");if(document.body.trim().length<120)warnings.push("short_content");if(!document.publishedAt)warnings.push("missing_publication_date");const trust:TrustLevel=source.trust;return{accepted:errors.length===0,trust,verification:trust==="government"||trust==="peer_reviewed"?"review_pending":"unverified",warnings,errors}}
}
export class CompositeDuplicateDetector implements DuplicateDetector{
  constructor(private readonly lookup:{byUrl(url:string):Promise<string|null>;byHash(hash:string):Promise<string|null>;bySimilarTitle(title:string,publishedAt?:string):Promise<string|null>}){}
  async findDuplicate(document:ParsedDocument,hash:string){const url=await this.lookup.byUrl(document.canonicalUrl);if(url)return{duplicate:true,existingId:url,reason:"canonical_url"};const hashed=await this.lookup.byHash(hash);if(hashed)return{duplicate:true,existingId:hashed,reason:"content_hash"};const title=await this.lookup.bySimilarTitle(document.title,document.publishedAt);return title?{duplicate:true,existingId:title,reason:"title_similarity"}:{duplicate:false}}
}
