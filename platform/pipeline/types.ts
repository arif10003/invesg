import type {ContentItem,ContentSource,ContentType,TrustLevel} from "../types/intelligence";
export interface RetrievedDocument{sourceId:string;sourceUrl:string;canonicalUrl?:string;statusCode:number;contentTypeHeader?:string;body:string;retrievedAt:string;etag?:string;lastModified?:string}
export interface ParsedDocument{title:string;subtitle?:string;body:string;authors:string[];publisher?:string;publishedAt?:string;languageCode:string;keywords:string[];imageUrls:string[];attachmentUrls:string[];references:string[];sourceUrl:string;canonicalUrl:string}
export interface Classification{contentType:ContentType;pillars:("environmental"|"social"|"governance")[];themes:string[];sectors:string[];geographies:string[];technologies:string[];organizations:string[];policies:string[]}
export interface ValidationResult{accepted:boolean;trust:TrustLevel;verification:"unverified"|"review_pending"|"verified"|"rejected";warnings:string[];errors:string[]}
export interface PipelineDocument{retrieved:RetrievedDocument;parsed:ParsedDocument;classification:Classification;validation:ValidationResult;hash:string}
export interface RetrievalConnector{kind:ContentSource["connectorType"];supports(source:ContentSource):boolean;retrieve(source:ContentSource,signal:AbortSignal):Promise<RetrievedDocument[]>}
export interface DocumentParser{supports(document:RetrievedDocument):boolean;parse(document:RetrievedDocument):Promise<ParsedDocument>}
export interface DocumentClassifier{classify(document:ParsedDocument):Classification}
export interface DuplicateDetector{findDuplicate(document:ParsedDocument,hash:string):Promise<{duplicate:boolean;existingId?:string;reason?:string}>}
export interface QualityValidator{validate(source:ContentSource,document:ParsedDocument):ValidationResult}
export interface PipelineStorage{storeRaw(document:RetrievedDocument):Promise<string>;storeStructured(document:PipelineDocument):Promise<ContentItem>}
export interface PipelineSearchIndexer{index(document:ContentItem):Promise<void>}
export interface PipelineLogger{info(event:string,metadata?:Record<string,unknown>):Promise<void>;warn(event:string,metadata?:Record<string,unknown>):Promise<void>;error(event:string,metadata?:Record<string,unknown>):Promise<void>}
export interface CrawlSummary{sourceId:string;found:number;stored:number;duplicates:number;failed:number;warnings:number;startedAt:string;completedAt:string;partialFailure:boolean}
