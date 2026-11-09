# Global Intelligence Pipeline

The V1.0 architecture follows the INVESG philosophy exactly:

`Internet → Source Discovery → Crawler → Structured Intelligence → Opportunity Intelligence → Sustainability Intelligence → Solution Navigator → Talk to Expert`

The pipeline ends at structured, source-attributed public intelligence. Opportunity and Sustainability products reuse that shared content rather than running separate crawlers. The Decision Navigator consumes the same relationships and links users to the relevant INVESG service and lead form.

## Runtime boundary

This repository is currently a Vite browser application, so the modules in `platform/` are server-side contracts and implementations for the future API worker. They must run only in a server environment. They respect public access, timeouts, rate limits, canonical URLs, duplicate detection, source trust, and editorial verification. They do not bypass authentication, scrape social media, or use AI.

## Processing sequence

1. `SourceRegistryRepository` selects approved sources due for retrieval.
2. `CrawlScheduler` creates cron-ready jobs.
3. A source-specific RSS, HTML, or API connector retrieves public content.
4. A parser normalizes metadata and body content.
5. `RuleBasedClassifier` assigns content type, ESG pillars, topics, and sectors.
6. `CompositeDuplicateDetector` checks canonical URL, hash, and title similarity.
7. `RuleBasedQualityValidator` assigns trust, verification state, and warnings.
8. Storage persists raw and structured content in the shared PostgreSQL model.
9. Search indexing updates PostgreSQL full-text search.
10. Public repositories expose verified content to Opportunity and Sustainability Intelligence.
