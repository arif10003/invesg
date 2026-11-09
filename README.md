# invesg - sumber frontend aktif

Handover terbaru: [laporan CTO dan pasangan commit tervalidasi](invesg-unified/docs/cto-handover-2026-11-09.md#13-pelaksanaan-handover-git-yang-dapat-direproduksi--keputusan-terbaru). Push ditahan sampai akses CI private lintas repository disiapkan bersama CTO.

Website publik/member sekarang memakai satu sumber: `src/` di folder induk ini. Lihat [panduan development dan build](SOURCE_FRONTEND_ID.md) untuk menjalankan melalui localhost:8000.

Catatan berikut adalah dokumentasi awal dan dapat memuat asumsi prototipe yang sudah digantikan integrasi Laravel.

---

# invesg Website

This repository currently contains the React/Vite frontend for the invesg
website and a MySQL 8 database design for its future Laravel backend.

The frontend is presently a prototype: most page content is hard-coded in React
components, sustainability intelligence comes from
`src/mockdata/RegionalData.js`, and forms only update local browser state. A
Laravel API is therefore required to provide persistence, validation, search,
content management, and filtering.

## Current frontend

The application exposes six routes:

| Route | Purpose |
|---|---|
| `/` | Homepage, positioning, feature cards, and calls to action |
| `/about` | Philosophy, audiences, capabilities, values, and company information |
| `/contact` | Contact options and inquiry form |
| `/insights` | LinkedIn and Instagram insight posts |
| `/sustainability/:region` | Regional ESG intelligence and filters |
| `/opportunity/:region` | Sector and regional opportunity intelligence |

The site uses:

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React icons

## Database deliverables

The database design is available in:

- [`database/schema.sql`](database/schema.sql) — complete MySQL 8 schema
- [`database/README.md`](database/README.md) — concise route-to-table map and import notes

The schema contains 30 tables, foreign-key relationships, query indexes,
full-text indexes, and initial lookup records.

Import it with:

```sh
mysql -u root -p < database/schema.sql
```

For a Laravel application, converting this SQL into Laravel migrations and
seeders is recommended instead of relying only on direct SQL imports.

## Database design

### General CMS

The CMS tables support editable content for the Home, About, Contact, and other
landing pages.

#### `pages`

Stores page-level information:

- Slug
- Title
- Meta title
- Meta description
- Publishing status
- Publication date

Initial page records are provided for `home`, `about`, `contact`, `insights`,
`sustainability`, and `opportunity`.

#### `page_sections`

Stores major sections such as the homepage hero, feature grid, About philosophy,
Contact introduction, and calls to action.

It includes headings, body content, images, links, display order, active state,
and a JSON `settings` field for presentation configuration.

#### `section_items`

Stores repeatable content inside a section, including feature cards,
capabilities, audience cards, values, and process steps.

Queryable business data should remain in relational columns and tables. JSON
settings should only hold presentation values such as layout variants, colors,
and image positions.

### Sustainability Intelligence

#### `geographies`

Stores a self-referencing geography hierarchy:

```text
Global Overview
Asia Pacific
└── Southeast Asia
    ├── Indonesia
    │   ├── Sumatera
    │   ├── Java
    │   ├── Kalimantan
    │   ├── Sulawesi
    │   ├── Bali & Nusa Tenggara
    │   ├── Maluku
    │   └── Papua
    ├── Malaysia
    ├── Singapore
    ├── Thailand
    ├── Vietnam
    └── Philippines
```

Each geography can include its type, country code, flag, map configuration,
display order, and active state.

#### `industries`

Supports the sustainability industry filter. Initial values include Mining,
Energy, Financial Services, Manufacturing, Agriculture, Transportation, Water,
Construction, and Government.

#### `esg_pillars`

Contains Environmental, Social, and Governance lookup values.

#### `content_types`

Classifies intelligence as:

- News
- Research
- Policies and Regulations
- Reports
- Standards and Frameworks
- Sustainable Finance
- Projects and Initiatives

#### `sources`

Stores the organizations that publish intelligence, including their website,
logo, and trusted-source status.

#### `intelligence_items`

Stores sustainability articles, documents, policies, reports, standards,
finance updates, and project information.

Important fields include:

- Content type
- Source
- Title and slug
- Summary and full body
- Original source URL
- Image URL
- Publication and discovery dates
- Publishing status

Full-text search is enabled on the title, summary, and body.

#### Intelligence pivot tables

The following many-to-many tables make intelligence filterable:

- `intelligence_item_geographies`
- `intelligence_item_industries`
- `intelligence_item_pillars`

One item can therefore apply to several regions, industries, and ESG pillars.

#### `geography_content_metrics`

Stores summary values for each geography and content type:

- Total item count
- New item count
- Trusted source count
- Display window such as `7 Days` or `Recently Updated`
- Last calculation time

#### `geography_snapshots`

Stores dated asset and source totals so the system can report historical change.

#### `topics`

Provides a shared taxonomy for topics such as Climate Change, Energy Transition,
Carbon Markets, Biodiversity, and Water Security.

#### `geography_trending_topics`

Stores topic rankings and scores for each geography and date.

#### `geography_activity_series`

Stores dated activity values for the regional chart and sparkline. The undated
arrays currently found in `RegionalData.js` should eventually be imported as
dated rows here.

### Opportunity Intelligence

#### `sectors`

Stores sectors and optional parent-child subsectors. Initial values include
Mining, Energy, Agriculture & Food, Manufacturing / Industry, Finance & Capital
Markets, Transport & Logistics, Water & Waste, Construction & Real Estate, and
Technology & Digital.

#### `opportunity_themes`

Initial themes include:

- Critical Minerals
- Responsible Mining
- Water Stewardship
- Energy Transition
- Biodiversity
- Circular Economy

#### `opportunities`

Stores the opportunity cards and ranked opportunities currently embedded in
`OpportunityPage.jsx`.

Important fields include:

- Sector
- Primary geography
- Title and slug
- Summary and full content
- Momentum
- Outlook
- Signal count
- Source URL
- Publishing status and date

Momentum values are `emerging`, `rising`, `high`, `stable`, and `declining`.
Outlook values range from `short_term` through `long_term`.

#### Opportunity relationship tables

- `opportunity_theme_links` connects opportunities to multiple themes.
- `opportunity_geographies` connects opportunities to all applicable regions.
- `sector_opportunity_metrics` stores calculated counts by sector and geography.

Numeric values should be stored as numbers. For example, store `1248`, not the
display string `1,248 Opportunities`.

### Insights

#### `insight_channels`

Stores publishing channels. LinkedIn and Instagram are seeded initially, and
other editorial channels can be added later.

#### `insight_posts`

Stores the cards and modal content currently embedded in `InsightsPage.jsx`.
It includes external IDs, title, excerpt, body, media, source URL, publication
date, featured state, and publishing status.

Full-text search is enabled on title, excerpt, and body.

#### `insight_post_topics`

Connects insight posts to the shared topic taxonomy.

### Forms and interactions

#### `contact_inquiries`

Stores:

- Full name
- Organization
- Email
- Message
- Consent status and date
- Source page
- Workflow status
- Assignee
- Internal notes

Workflow states are `new`, `in_progress`, `resolved`, and `spam`.

#### `newsletter_subscribers`

Stores subscriptions and their `pending`, `active`, `unsubscribed`, or `bounced`
state. It also records consent, confirmation, and unsubscription timestamps.
A double opt-in workflow is recommended.

#### `search_queries`

Stores search text, source page, result count, anonymous session token, and
search date. This supports search analytics and content-gap analysis.

#### `saved_items`

Stores anonymous bookmarks using a visitor token. Supported saved types are
`intelligence`, `opportunity`, and `insight`. If authentication is introduced,
a nullable `user_id` should be added.

## Recommended Laravel backend

Use a currently supported Laravel version with PHP 8.3+ and MySQL 8.0+.

Suggested application structure:

```text
app/
├── Console/Commands/
│   ├── RecalculateGeographyMetrics.php
│   ├── RecalculateSectorMetrics.php
│   └── GenerateDailyTrendSnapshots.php
├── Http/
│   ├── Controllers/Api/
│   │   ├── PageController.php
│   │   ├── ContactInquiryController.php
│   │   ├── NewsletterSubscriberController.php
│   │   ├── InsightController.php
│   │   ├── SustainabilityController.php
│   │   ├── OpportunityController.php
│   │   ├── SearchController.php
│   │   └── SavedItemController.php
│   ├── Requests/
│   │   ├── StoreContactInquiryRequest.php
│   │   ├── StoreNewsletterSubscriberRequest.php
│   │   └── StoreSavedItemRequest.php
│   └── Resources/
│       ├── PageResource.php
│       ├── InsightResource.php
│       ├── IntelligenceItemResource.php
│       ├── OpportunityResource.php
│       └── GeographyResource.php
├── Models/
└── Services/
    ├── SustainabilityService.php
    ├── OpportunityService.php
    ├── SearchService.php
    └── MetricsService.php
```

### Models

The primary Eloquent models will be:

```text
Page
PageSection
SectionItem
Geography
Industry
EsgPillar
ContentType
Source
IntelligenceItem
GeographyContentMetric
GeographySnapshot
Topic
Sector
OpportunityTheme
Opportunity
InsightChannel
InsightPost
ContactInquiry
NewsletterSubscriber
SearchQuery
SavedItem
```

`Geography` and `Sector` require self-referencing parent and child
relationships. Intelligence items, opportunities, and posts require
`belongsToMany` relationships through their pivot tables.

### Migrations and seeders

Convert `database/schema.sql` into migrations in foreign-key dependency order.
Create seeders for:

```text
PageSeeder
GeographySeeder
IndustrySeeder
EsgPillarSeeder
ContentTypeSeeder
SectorSeeder
OpportunityThemeSeeder
InsightChannelSeeder
```

Laravel migrations are preferable because they support repeatable deployment,
testing, rollback, and version-controlled schema evolution.

## Recommended API

Version the API under `/api/v1`.

### Page content

```http
GET /api/v1/pages/{slug}
```

Example response:

```json
{
  "data": {
    "slug": "home",
    "title": "Home",
    "meta": {
      "title": "invesg",
      "description": "..."
    },
    "sections": [
      {
        "key": "hero",
        "heading": "ESG as a Lens",
        "body": "...",
        "settings": {},
        "items": []
      }
    ]
  }
}
```

### Contact form

```http
POST /api/v1/contact-inquiries
```

Request:

```json
{
  "full_name": "Example Name",
  "organization": "Example Company",
  "email": "name@example.com",
  "message": "We need support with our sustainability strategy.",
  "consent_given": true
}
```

Laravel validation should require a valid email, a message of no more than 500
characters, and accepted consent.

### Newsletter

```http
POST /api/v1/newsletter-subscribers
```

### Insights

```http
GET /api/v1/insights
GET /api/v1/insights/{slug}
GET /api/v1/insight-channels
```

Supported filters should include channel, topic, featured status, search, and
pagination.

### Sustainability

```http
GET /api/v1/geographies/tree
GET /api/v1/sustainability/{geography}
GET /api/v1/intelligence-items
GET /api/v1/intelligence-items/{slug}
```

Example:

```http
GET /api/v1/intelligence-items?geography=indonesia&industry=mining&pillar=environmental&type=research&range=30d&page=1
```

The sustainability summary should return geography details, asset and source
totals, counts by content type, latest items, trending topics, and activity
series.

### Opportunities

```http
GET /api/v1/sectors
GET /api/v1/opportunity-themes
GET /api/v1/opportunities
GET /api/v1/opportunities/{slug}
```

Example:

```http
GET /api/v1/opportunities?geography=indonesia&sector=mining&theme=critical-minerals&momentum=high
```

### Search and saved content

```http
GET    /api/v1/search?q=energy+transition
GET    /api/v1/saved-items
POST   /api/v1/saved-items
DELETE /api/v1/saved-items/{id}
```

Search should combine intelligence items, opportunities, and insight posts.

## Administration

An administration interface should manage:

- Pages and sections
- Sources
- Intelligence items
- Opportunities
- Insights
- Contact inquiries
- Newsletter subscribers
- Publishing workflows

Filament is a suitable option for building the Laravel administration panel.
Other useful optional packages include:

- Laravel Sanctum for authenticated API access
- `spatie/laravel-permission` for administrator and editor roles
- `spatie/laravel-medialibrary` for uploads
- Laravel Scout with Meilisearch for advanced search
- Redis for caching and queues

## Security

React must never connect directly to MySQL. Database credentials belong only in
Laravel's server-side `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=invesg
DB_USERNAME=invesg_app
DB_PASSWORD=replace-with-a-secure-password
```

Never place database credentials in variables prefixed with `VITE_`; those
variables are exposed to the browser.

The backend should implement:

- Form Request validation
- API rate limiting
- CORS restricted to the frontend origin
- Contact-form spam protection
- CSRF protection for cookie-authenticated administration
- Eloquent or parameterized query-builder statements
- HTML sanitization for CMS content
- Authorization policies
- Queued notification emails
- Newsletter double opt-in
- Logging that excludes credentials and private inquiry content

## Caching and scheduled jobs

Good cache candidates include:

- Page content
- Geography tree
- Industries and ESG pillars
- Sectors and opportunity themes
- Regional summaries
- Trending topics
- Paginated insight lists

Example cache keys:

```text
page:home
geographies:tree
sustainability:indonesia:summary
opportunities:indonesia:mining
insights:linkedin:page:1
```

Laravel Scheduler should run commands that:

- Recalculate geography content metrics
- Recalculate sector opportunity totals
- Create daily geography snapshots
- Update trending-topic rankings

Use queues for email, content imports, and other slow operations.

## React integration

Configure only the public Laravel API address in the frontend:

```env
VITE_API_BASE_URL=https://api.invesg.co/api/v1
```

Example request:

```js
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/sustainability/indonesia`
);

if (!response.ok) {
  throw new Error("Unable to load sustainability intelligence");
}

const result = await response.json();
```

Replace frontend mock data in this order:

1. Contact form
2. Newsletter form
3. Insight posts
4. Opportunity data
5. `RegionalData.js`
6. Home and About CMS content
7. Search and saved items

## Known frontend gaps

The current frontend has several demonstration-only features:

- Contact inquiries are not transmitted or saved.
- Newsletter forms do not submit.
- Search does not query content.
- Bookmarks are temporary local state.
- Sustainability data is mocked.
- Opportunity filters only update local state.
- Insights are compiled into the React bundle.
- Some counts are stored as formatted display strings.
- Some links use `href="#"`.
- Some homepage feature cards point to the wrong routes.
- `/opportunity/:region` does not currently use its route parameter properly.
- Some source files contain broken dash or emoji character encoding.

These should be addressed while the React pages are connected to Laravel.

## Recommended implementation phases

### Phase 1: Laravel foundation

- Create the Laravel project.
- Configure MySQL.
- Translate the schema into migrations.
- Add lookup seeders.
- Configure CORS and API versioning.
- Standardize JSON success and error responses.

### Phase 2: Forms

- Implement contact inquiry submission.
- Implement newsletter subscription.
- Add validation, rate limiting, spam protection, and queued notifications.

### Phase 3: Content APIs

- Build Insights endpoints.
- Build Sustainability endpoints.
- Build Opportunity endpoints.
- Add filters, pagination, API Resources, and caching.

### Phase 4: Administration

- Add authentication.
- Add roles and permissions.
- Build the Filament administration interface.
- Add media uploads and draft/publish workflows.

### Phase 5: Frontend migration

- Replace hard-coded arrays with API requests.
- Add loading, empty, and error states.
- Connect all filters.
- Connect search and bookmarks.

### Phase 6: Automation and quality

- Add metric calculations and daily snapshots.
- Add scheduled imports and queues.
- Add feature, integration, and authorization tests.
- Add monitoring, backups, and deployment automation.

## Build the current frontend

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```
