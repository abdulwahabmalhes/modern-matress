# MODERN MATTRESSES — ENTERPRISE ECOMMERCE PLATFORM
## Product Requirements Document (PRD) — v1.0
### Prepared by: Office of the CTO
### Date: June 2026
### Status: Pre-Development | Approved for Engineering

---

> **This document is the single source of truth for the Modern Mattresses platform.**
> All engineering, design, product, and business decisions must be traceable to this document.
> No development begins without this document being reviewed and signed off by the lead architect.

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Business Analysis](#2-business-analysis)
3. [User Personas](#3-user-personas)
4. [User Journey Maps](#4-user-journey-maps)
5. [Information Architecture](#5-information-architecture)
6. [Database Design](#6-database-design)
7. [ERD Structure](#7-erd-structure)
8. [API Architecture](#8-api-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [Frontend Architecture](#10-frontend-architecture)
11. [CMS Architecture](#11-cms-architecture)
12. [Product Engine](#12-product-engine)
13. [Attribute Engine](#13-attribute-engine)
14. [Variation Engine](#14-variation-engine)
15. [Filter Engine](#15-filter-engine)
16. [Quotation Engine](#16-quotation-engine)
17. [AI Architecture](#17-ai-architecture)
18. [WhatsApp Architecture](#18-whatsapp-architecture)
19. [Dashboard Architecture](#19-dashboard-architecture)
20. [SEO Architecture](#20-seo-architecture)
21. [Security Architecture](#21-security-architecture)
22. [Performance Architecture](#22-performance-architecture)
23. [UI/UX Architecture](#23-uiux-architecture)
24. [Development Phases](#24-development-phases)
25. [MVP Scope](#25-mvp-scope)
26. [Future Expansion Roadmap](#26-future-expansion-roadmap)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview

Modern Mattresses is a premium, enterprise-grade ecommerce platform purpose-built for the sleep and bedroom furniture retail market in the UAE and broader GCC region. The platform is designed from first principles — not adapted from WordPress, WooCommerce, Shopify, or any CMS — to deliver a fully custom, high-performance, multilingual (Arabic/English) digital commerce experience.

The platform is not simply a transactional store. It is a six-function commercial system:

| Function | Description |
|---|---|
| Ecommerce Store | Full product catalog, cart, checkout, payments |
| Product Catalog | Rich, filterable, searchable product repository |
| Quotation System | Request-for-quote workflow for B2B and bulk orders |
| Lead Generation System | Structured lead capture across all touchpoints |
| AI Sales Assistant | Intelligent, trainable chatbot for sales and support |
| WhatsApp Sales Platform | Seamless WhatsApp handoff and inquiry routing |

### 1.2 Strategic Vision

The platform is architected for a two-horizon strategy:

- **Horizon 1 (MVP):** Single-brand premium ecommerce store for Modern Mattresses
- **Horizon 2 (Scale):** Multi-brand, multi-vendor ecommerce ecosystem — a regional sleep and lifestyle marketplace

Every architectural decision in this document must respect this two-horizon constraint. Nothing in Horizon 1 should block Horizon 2.

### 1.3 Technology Mandate

| Layer | Technology |
|---|---|
| Backend Framework | Laravel 12 |
| Language | PHP 8.4 |
| Database | MySQL 8.x |
| Cache / Queue | Redis |
| API Style | RESTful JSON API |
| Frontend Framework | React 18+ with TypeScript |
| CSS Framework | TailwindCSS v4 |
| Component Library | Shadcn UI |
| Infrastructure | VPS (Ubuntu 24 LTS) |
| Edge / DNS | Cloudflare |
| Media Delivery | CDN + Object Storage |

### 1.4 Key Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance Score | 90+ |
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2.5s |
| API Response Time (P95) | < 300ms |
| Quotation Lead Conversion | > 15% |
| Mobile Traffic Support | 70%+ of sessions |
| Languages | Arabic, English |
| Availability SLA | 99.9% |

---

## 2. BUSINESS ANALYSIS

### 2.1 Market Context

The GCC sleep and bedroom furniture market is a premium, high-intent segment. Customers research extensively before purchasing. Average order values (AOV) are significantly higher than general retail — mattresses range from AED 500 to AED 15,000+. This purchasing behavior demands:

- **Trust signals** at every touchpoint
- **Rich product information** (materials, technologies, certifications)
- **Multiple contact channels** (WhatsApp, phone, email, quotation form)
- **Arabic-first UX** for a large segment of the target audience
- **B2B and hospitality quotation workflows** for hotels, real estate developers, and bulk buyers

### 2.2 Competitive Landscape

| Competitor Type | Weakness | Our Advantage |
|---|---|---|
| Generic WooCommerce stores | Slow, poor mobile UX, no Arabic | Custom-built, fast, full RTL |
| Shopify stores | Limited product attributes, no quotation | Full attribute engine, quotation system |
| Regional catalog sites | No ecommerce, no AI | Full commerce + AI assistant |
| International brands | Not localized | Arabic-first, AED pricing, UAE logistics |

### 2.3 Revenue Streams

1. **Direct Product Sales** — Primary revenue via cart checkout
2. **Quotation Conversions** — B2B, hospitality, bulk deals closed offline via quote workflow
3. **WhatsApp Sales** — High-intent leads converted via WhatsApp conversation
4. **Future: Vendor Commissions** — Multi-vendor marketplace fees (Horizon 2)
5. **Future: Featured Listings** — Brand promotion placements (Horizon 2)

### 2.4 Business Constraints

- Platform must comply with UAE consumer protection laws
- Arabic content must be equal in quality to English (not a translation afterthought)
- All customer data must be stored within compliant infrastructure
- Payment processing must support UAE-region gateways (Telr, PayTabs, Stripe UAE)
- WhatsApp Business API integration is a commercial requirement, not optional

### 2.5 Product Catalog Scope

| Category | Examples |
|---|---|
| Mattresses | Memory foam, pocket spring, hybrid, orthopedic |
| Beds & Bed Frames | Upholstered, wooden, storage, platform |
| Bedroom Furniture | Wardrobes, dressers, nightstands, mirrors |
| Sleep Accessories | Mattress protectors, toppers, bed linen |
| Pillows | Memory foam, down, cervical, kids |
| Bedroom Collections | Coordinated sets by style/color/material |

### 2.6 Stakeholder Map

| Stakeholder | Role | Key Needs |
|---|---|---|
| Business Owner | Decision maker | Sales dashboard, lead pipeline, AI performance |
| Sales Team | Quotation management | Lead status, WhatsApp integration, notes |
| Content Team | Catalog and CMS management | Easy product/content editor |
| Customers (B2C) | Shoppers | Fast, trust-building shopping experience |
| Customers (B2B) | Bulk / hospitality buyers | Quotation system, relationship management |
| Future Vendors | Marketplace sellers (H2) | Vendor portal, commission structure |

---

## 3. USER PERSONAS

### Persona 1 — Amira Al Rashidi (Primary B2C Shopper)

| Field | Detail |
|---|---|
| Age | 32 |
| Location | Dubai, UAE |
| Language | Arabic (primary), English (secondary) |
| Device | iPhone, browses Instagram before site |
| Job | Marketing Manager |
| Goal | Furnish new apartment bedroom, wants premium quality |
| Pain Points | Overwhelmed by options, unsure about sizes, afraid to buy wrong firmness |
| Behaviors | Reads reviews, compares products side by side, asks on WhatsApp before buying |
| Decision Driver | Warranty, brand trust, material quality, delivery timeline |

**Platform Implications:**
- Arabic UI is non-negotiable
- Product comparison feature is high-priority
- WhatsApp button must be visible at all times
- Firmness and comfort guides needed on product pages
- Clear warranty and return policy icons on product cards

---

### Persona 2 — James Thornton (Expat B2C Shopper)

| Field | Detail |
|---|---|
| Age | 41 |
| Location | Abu Dhabi, UAE |
| Language | English |
| Device | MacBook Pro, desktop research |
| Job | Finance Director |
| Goal | Buy premium king-size bed and mattress set |
| Pain Points | Doesn't want to visit a showroom, wants to buy online confidently |
| Behaviors | Reads technical specs, checks certifications, compares materials |
| Decision Driver | Product details depth, price transparency, delivery options |

**Platform Implications:**
- Rich technical attribute display on product pages
- Clear price per variation
- Delivery timeline estimator
- No friction checkout

---

### Persona 3 — Mohammed Al Ketbi (B2B Hospitality Buyer)

| Field | Detail |
|---|---|
| Age | 47 |
| Location | Dubai, UAE |
| Language | Arabic |
| Job | Procurement Manager, Hotel Group |
| Goal | Outfit 120 hotel rooms with mattresses and pillows |
| Pain Points | Needs custom pricing, bulk delivery, official quotation document |
| Behaviors | Never uses cart — always requests quotation |
| Decision Driver | Response speed, professional quotation document, account manager relationship |

**Platform Implications:**
- Quotation system is a core revenue driver
- Quotation PDF generation needed
- Admin must be able to assign and manage quotation leads
- WhatsApp handoff must route to sales team immediately

---

### Persona 4 — Sara Khalid (Mobile-First Impulse Researcher)

| Field | Detail |
|---|---|
| Age | 26 |
| Location | Sharjah, UAE |
| Language | Arabic |
| Device | Android mobile, low patience for slow pages |
| Goal | Find a pillow or sleep accessory under AED 200 |
| Pain Points | Slow sites, confusing navigation, hidden prices |
| Behaviors | Filters by price, checks product images, buys quickly if price is right |
| Decision Driver | Price clarity, fast checkout, free delivery threshold |

**Platform Implications:**
- Mobile performance is non-negotiable
- Price filters must be prominent
- Cart and checkout must be frictionless on mobile
- Product images must load fast (WebP, CDN)

---

### Persona 5 — Admin — Fatima Saeed (Store Manager)

| Field | Detail |
|---|---|
| Age | 35 |
| Location | Dubai, UAE |
| Language | Arabic |
| Goal | Manage catalog, update prices, respond to leads |
| Pain Points | Current tools are complex, need dev for simple changes |
| Behaviors | Updates products weekly, monitors quotation pipeline daily |
| Decision Driver | Easy admin UI, no-code homepage builder, fast product editing |

**Platform Implications:**
- Admin dashboard must be intuitive with Arabic support
- Homepage builder must require zero code
- Bulk product import/export needed
- Quotation pipeline view must be a primary dashboard widget

---

## 4. USER JOURNEY MAPS

### 4.1 B2C Purchase Journey — Arabic Shopper (Amira)

```
AWARENESS
│
├── Instagram ad → Product landing page (Arabic)
│   └── Hero image → Quick view → Add to cart
│
CONSIDERATION
│
├── Homepage → Category page (Mattresses)
│   ├── Filters: Firmness = Medium, Size = 180x200, Price range
│   └── Product listing → Product detail page
│       ├── Image gallery
│       ├── Size selector (variation price updates)
│       ├── Firmness guide tooltip
│       ├── Reviews section
│       ├── Compare button
│       └── WhatsApp button (if unsure)
│
DECISION
│
├── Add to Cart
│   ├── Mini cart slide-out
│   └── Proceed to Checkout
│       ├── Guest or Account login
│       ├── Delivery address (UAE Emirates selector)
│       ├── Delivery date estimate
│       ├── Payment (card / COD / BNPL)
│       └── Order confirmation + WhatsApp notification
│
POST-PURCHASE
│
└── Email confirmation → Delivery tracking → Review request
```

---

### 4.2 B2B Quotation Journey — Hospitality Buyer (Mohammed)

```
DISCOVERY
│
└── Google Search "hotel mattress supplier Dubai" → SEO landing page
    └── Homepage → Products → Mattress category
        └── Product page → "Request Quotation" CTA
│
QUOTATION REQUEST
│
└── Quotation form:
    ├── Name, Company, Phone, WhatsApp, Email
    ├── Product + variation selected automatically
    ├── Quantity, delivery city, notes
    └── Form submitted → Admin notified → WhatsApp auto-message sent
│
SALES FOLLOW-UP
│
└── Admin dashboard → Quotation pipeline
    ├── Status: New → Contacted
    ├── Sales rep assigned
    ├── WhatsApp conversation initiated
    └── Custom quote prepared and sent
│
CONVERSION
│
└── Status: Quoted → Approved
    └── PO or payment link issued
```

---

### 4.3 AI Chatbot Journey

```
USER OPENS CHAT WIDGET
│
├── AI greets in detected language (Arabic/English)
│
├── Intent Detection:
│   ├── Product recommendation → Asks comfort preference, size, budget
│   │   └── Returns top 3 matching products with images + links
│   ├── FAQ → Answers from trained knowledge base
│   ├── Delivery inquiry → Returns policy from CMS
│   └── Human handoff → Routes to WhatsApp sales agent
│
└── Lead capture:
    ├── Name + WhatsApp collected
    └── Stored as lead in admin dashboard
```

---

## 5. INFORMATION ARCHITECTURE

### 5.1 Site Map — Public Frontend

```
/
├── / (Homepage)
│   ├── Hero Section
│   ├── Category Grid
│   ├── Featured Products
│   ├── Collections Showcase
│   ├── Best Sellers
│   ├── Brand Logos
│   ├── Customer Reviews
│   ├── FAQ Accordion
│   └── CTA Banner
│
├── /shop (All Products)
│
├── /category/:slug
│   ├── /mattresses
│   ├── /beds
│   ├── /bedroom-furniture
│   ├── /sleep-accessories
│   ├── /pillows
│   └── /collections
│
├── /product/:slug
│
├── /brand/:slug
│
├── /collection/:slug
│
├── /cart
│
├── /checkout
│
├── /quotation
│
├── /account
│   ├── /account/orders
│   ├── /account/quotations
│   └── /account/profile
│
├── /blog
│   └── /blog/:slug
│
├── /page/:slug
│   ├── /about
│   ├── /contact
│   ├── /delivery
│   ├── /returns
│   ├── /warranty
│   └── /privacy-policy
│
└── /search?q=
```

**Arabic Mirror (RTL):**
All routes support `/ar/` prefix or locale detection:
```
/ar/ → Arabic homepage
/ar/category/المراتب
/ar/product/:arabic-slug
```

---

### 5.2 Admin Panel Map

```
/admin
│
├── /admin/dashboard (Overview)
│
├── /admin/products
│   ├── /admin/products/create
│   ├── /admin/products/:id/edit
│   └── /admin/products/import
│
├── /admin/categories
├── /admin/brands
├── /admin/collections
│
├── /admin/attributes
│   ├── /admin/attributes/groups
│   └── /admin/attributes/options
│
├── /admin/variations (global variation management)
│
├── /admin/orders
│   └── /admin/orders/:id
│
├── /admin/quotations
│   └── /admin/quotations/:id
│
├── /admin/customers
│   └── /admin/customers/:id
│
├── /admin/reviews
│
├── /admin/content
│   ├── /admin/content/pages
│   ├── /admin/content/blog
│   ├── /admin/content/faqs
│   └── /admin/content/policies
│
├── /admin/homepage-builder
│
├── /admin/seo
│
├── /admin/ai-settings
│
├── /admin/whatsapp-settings
│
├── /admin/users
│   └── /admin/roles
│
└── /admin/settings
```

---

## 6. DATABASE DESIGN

### 6.1 Design Principles

- All monetary values stored as `DECIMAL(12,2)` — never floats
- All timestamps as `TIMESTAMP` in UTC, displayed in local timezone
- Soft deletes (`deleted_at`) on all primary entities
- UUID primary keys on customer-facing entities for security
- Integer auto-increment PKs for internal relational entities
- All text content has `_en` and `_ar` column pairs for bilingual fields
- Slugs stored separately per locale for SEO

---

### 6.2 Core Tables — Schema Definitions

#### `tenants` *(Multi-vendor foundation — H2 ready)*
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
name_en             VARCHAR(255)
name_ar             VARCHAR(255)
slug                VARCHAR(255) UNIQUE
domain              VARCHAR(255) NULLABLE
logo_url            VARCHAR(500) NULLABLE
status              ENUM('active','suspended','pending')
plan                ENUM('standard','premium','enterprise')
settings            JSON
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `users`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
tenant_id           BIGINT UNSIGNED FK → tenants.id NULLABLE
name                VARCHAR(255)
email               VARCHAR(255) UNIQUE
phone               VARCHAR(50) NULLABLE
whatsapp            VARCHAR(50) NULLABLE
password            VARCHAR(255)
role                ENUM('superadmin','admin','manager','sales','customer')
locale              ENUM('en','ar') DEFAULT 'en'
email_verified_at   TIMESTAMP NULLABLE
last_login_at       TIMESTAMP NULLABLE
status              ENUM('active','inactive','banned')
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `roles` & `permissions` *(Spatie Laravel Permission)*
```
roles
  id, name, guard_name, created_at, updated_at

permissions
  id, name, guard_name, created_at, updated_at

role_has_permissions
  permission_id FK, role_id FK

model_has_roles
  role_id FK, model_type, model_id
```

---

#### `categories`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
parent_id           BIGINT UNSIGNED FK → categories.id NULLABLE
tenant_id           BIGINT UNSIGNED FK → tenants.id NULLABLE
name_en             VARCHAR(255)
name_ar             VARCHAR(255)
slug_en             VARCHAR(255) UNIQUE
slug_ar             VARCHAR(255) UNIQUE
description_en      TEXT NULLABLE
description_ar      TEXT NULLABLE
image_url           VARCHAR(500) NULLABLE
meta_title_en       VARCHAR(255) NULLABLE
meta_title_ar       VARCHAR(255) NULLABLE
meta_description_en VARCHAR(500) NULLABLE
meta_description_ar VARCHAR(500) NULLABLE
sort_order          INT DEFAULT 0
is_active           TINYINT(1) DEFAULT 1
is_featured         TINYINT(1) DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `brands`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
tenant_id           BIGINT UNSIGNED FK NULLABLE
name_en             VARCHAR(255)
name_ar             VARCHAR(255)
slug_en             VARCHAR(255) UNIQUE
slug_ar             VARCHAR(255) UNIQUE
description_en      TEXT NULLABLE
description_ar      TEXT NULLABLE
logo_url            VARCHAR(500) NULLABLE
banner_url          VARCHAR(500) NULLABLE
website_url         VARCHAR(500) NULLABLE
is_active           TINYINT(1) DEFAULT 1
is_featured         TINYINT(1) DEFAULT 0
sort_order          INT DEFAULT 0
meta_title_en       VARCHAR(255) NULLABLE
meta_description_en VARCHAR(500) NULLABLE
meta_title_ar       VARCHAR(255) NULLABLE
meta_description_ar VARCHAR(500) NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `collections`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
tenant_id           BIGINT UNSIGNED FK NULLABLE
name_en             VARCHAR(255)
name_ar             VARCHAR(255)
slug_en             VARCHAR(255) UNIQUE
slug_ar             VARCHAR(255) UNIQUE
description_en      TEXT NULLABLE
description_ar      TEXT NULLABLE
image_url           VARCHAR(500) NULLABLE
banner_url          VARCHAR(500) NULLABLE
is_active           TINYINT(1) DEFAULT 1
is_featured         TINYINT(1) DEFAULT 0
sort_order          INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `products`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
tenant_id           BIGINT UNSIGNED FK NULLABLE
brand_id            BIGINT UNSIGNED FK → brands.id NULLABLE
name_en             VARCHAR(500)
name_ar             VARCHAR(500)
slug_en             VARCHAR(500) UNIQUE
slug_ar             VARCHAR(500) UNIQUE
short_description_en TEXT NULLABLE
short_description_ar TEXT NULLABLE
description_en      LONGTEXT NULLABLE
description_ar      LONGTEXT NULLABLE
base_price          DECIMAL(12,2)
sale_price          DECIMAL(12,2) NULLABLE
cost_price          DECIMAL(12,2) NULLABLE
sku                 VARCHAR(100) UNIQUE NULLABLE
barcode             VARCHAR(100) NULLABLE
type                ENUM('simple','variable') DEFAULT 'simple'
status              ENUM('active','draft','archived') DEFAULT 'draft'
is_featured         TINYINT(1) DEFAULT 0
is_new              TINYINT(1) DEFAULT 0
is_best_seller      TINYINT(1) DEFAULT 0
has_quotation       TINYINT(1) DEFAULT 1
has_cart            TINYINT(1) DEFAULT 1
weight              DECIMAL(8,2) NULLABLE
dimensions          JSON NULLABLE   -- {length, width, height, unit}
warranty_months     INT NULLABLE
sort_order          INT DEFAULT 0
meta_title_en       VARCHAR(255) NULLABLE
meta_title_ar       VARCHAR(255) NULLABLE
meta_description_en VARCHAR(500) NULLABLE
meta_description_ar VARCHAR(500) NULLABLE
schema_data         JSON NULLABLE
views_count         INT DEFAULT 0
sales_count         INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE

INDEX: (status, is_featured, is_best_seller, sort_order)
FULLTEXT: (name_en, name_ar, description_en, description_ar)
```

---

#### `product_categories` *(pivot)*
```
product_id          BIGINT UNSIGNED FK
category_id         BIGINT UNSIGNED FK
is_primary          TINYINT(1) DEFAULT 0
PRIMARY KEY (product_id, category_id)
```

---

#### `product_collections` *(pivot)*
```
product_id          BIGINT UNSIGNED FK
collection_id       BIGINT UNSIGNED FK
PRIMARY KEY (product_id, collection_id)
```

---

#### `product_images`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
product_id          BIGINT UNSIGNED FK
variation_id        BIGINT UNSIGNED FK NULLABLE
url                 VARCHAR(500)
alt_en              VARCHAR(255) NULLABLE
alt_ar              VARCHAR(255) NULLABLE
sort_order          INT DEFAULT 0
is_primary          TINYINT(1) DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `attribute_groups`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
name_en             VARCHAR(255)
name_ar             VARCHAR(255)
slug                VARCHAR(255) UNIQUE
type                ENUM('select','multiselect','color','size','boolean','text')
is_filterable       TINYINT(1) DEFAULT 1
is_comparable       TINYINT(1) DEFAULT 1
is_required         TINYINT(1) DEFAULT 0
sort_order          INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `attribute_options`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
group_id            BIGINT UNSIGNED FK → attribute_groups.id
value_en            VARCHAR(255)
value_ar            VARCHAR(255)
slug                VARCHAR(255)
color_hex           VARCHAR(10) NULLABLE   -- for color swatches
sort_order          INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `product_attributes` *(product ↔ attribute_options)*
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
product_id          BIGINT UNSIGNED FK
group_id            BIGINT UNSIGNED FK
option_id           BIGINT UNSIGNED FK
custom_value_en     VARCHAR(255) NULLABLE  -- for text-type attributes
custom_value_ar     VARCHAR(255) NULLABLE
PRIMARY KEY (product_id, group_id, option_id)
```

---

#### `product_variations`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
product_id          BIGINT UNSIGNED FK
sku                 VARCHAR(100) UNIQUE NULLABLE
price               DECIMAL(12,2)
sale_price          DECIMAL(12,2) NULLABLE
cost_price          DECIMAL(12,2) NULLABLE
stock_quantity      INT DEFAULT 0
stock_status        ENUM('in_stock','out_of_stock','backorder') DEFAULT 'in_stock'
weight              DECIMAL(8,2) NULLABLE
dimensions          JSON NULLABLE
sort_order          INT DEFAULT 0
is_active           TINYINT(1) DEFAULT 1
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `variation_attributes` *(variation ↔ attribute_options)*
```
variation_id        BIGINT UNSIGNED FK
group_id            BIGINT UNSIGNED FK
option_id           BIGINT UNSIGNED FK
PRIMARY KEY (variation_id, group_id)
```

---

#### `customers`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
user_id             BIGINT UNSIGNED FK → users.id NULLABLE
first_name          VARCHAR(255)
last_name           VARCHAR(255)
email               VARCHAR(255) UNIQUE
phone               VARCHAR(50) NULLABLE
whatsapp            VARCHAR(50) NULLABLE
date_of_birth       DATE NULLABLE
gender              ENUM('male','female','other','prefer_not') NULLABLE
locale              ENUM('en','ar') DEFAULT 'en'
notes               TEXT NULLABLE
tags                JSON NULLABLE
total_spent         DECIMAL(12,2) DEFAULT 0
orders_count        INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `addresses`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
customer_id         BIGINT UNSIGNED FK
label               VARCHAR(100) NULLABLE  -- 'Home', 'Office'
first_name          VARCHAR(255)
last_name           VARCHAR(255)
phone               VARCHAR(50)
address_line_1      VARCHAR(500)
address_line_2      VARCHAR(500) NULLABLE
city                VARCHAR(255)
emirate             VARCHAR(255)
country             CHAR(2) DEFAULT 'AE'
is_default          TINYINT(1) DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `orders`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
order_number        VARCHAR(50) UNIQUE   -- MM-2026-00001
customer_id         BIGINT UNSIGNED FK NULLABLE
guest_email         VARCHAR(255) NULLABLE
guest_name          VARCHAR(255) NULLABLE
status              ENUM('pending','processing','confirmed','shipped','delivered','cancelled','refunded')
payment_status      ENUM('pending','paid','failed','refunded','partial')
payment_method      VARCHAR(100)
payment_reference   VARCHAR(255) NULLABLE
subtotal            DECIMAL(12,2)
discount_amount     DECIMAL(12,2) DEFAULT 0
shipping_amount     DECIMAL(12,2) DEFAULT 0
tax_amount          DECIMAL(12,2) DEFAULT 0
total               DECIMAL(12,2)
currency            CHAR(3) DEFAULT 'AED'
locale              ENUM('en','ar') DEFAULT 'en'
shipping_address    JSON
billing_address     JSON NULLABLE
notes               TEXT NULLABLE
admin_notes         TEXT NULLABLE
ip_address          VARCHAR(45) NULLABLE
user_agent          TEXT NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `order_items`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
order_id            BIGINT UNSIGNED FK
product_id          BIGINT UNSIGNED FK
variation_id        BIGINT UNSIGNED FK NULLABLE
product_name_en     VARCHAR(500)
product_name_ar     VARCHAR(500)
variation_label     VARCHAR(500) NULLABLE
sku                 VARCHAR(100) NULLABLE
quantity            INT
unit_price          DECIMAL(12,2)
total_price         DECIMAL(12,2)
image_url           VARCHAR(500) NULLABLE
created_at          TIMESTAMP
```

---

#### `quotations`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
quote_number        VARCHAR(50) UNIQUE   -- QT-2026-00001
customer_id         BIGINT UNSIGNED FK NULLABLE
assigned_to         BIGINT UNSIGNED FK → users.id NULLABLE
first_name          VARCHAR(255)
last_name           VARCHAR(255)
email               VARCHAR(255)
phone               VARCHAR(50)
whatsapp            VARCHAR(50) NULLABLE
company             VARCHAR(255) NULLABLE
country             VARCHAR(100) DEFAULT 'UAE'
city                VARCHAR(255) NULLABLE
emirate             VARCHAR(255) NULLABLE
product_id          BIGINT UNSIGNED FK NULLABLE
variation_id        BIGINT UNSIGNED FK NULLABLE
product_name_en     VARCHAR(500) NULLABLE
variation_label     VARCHAR(500) NULLABLE
quantity            INT DEFAULT 1
notes               TEXT NULLABLE
admin_notes         TEXT NULLABLE
status              ENUM('new','contacted','quoted','approved','rejected') DEFAULT 'new'
source              ENUM('web_form','whatsapp','ai_chat','phone','email','admin') DEFAULT 'web_form'
locale              ENUM('en','ar') DEFAULT 'en'
quoted_amount       DECIMAL(12,2) NULLABLE
quoted_at           TIMESTAMP NULLABLE
responded_at        TIMESTAMP NULLABLE
ip_address          VARCHAR(45) NULLABLE
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `quotation_items`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
quotation_id        BIGINT UNSIGNED FK
product_id          BIGINT UNSIGNED FK NULLABLE
variation_id        BIGINT UNSIGNED FK NULLABLE
product_name_en     VARCHAR(500)
product_name_ar     VARCHAR(500)
variation_label     VARCHAR(500) NULLABLE
quantity            INT
unit_price          DECIMAL(12,2) NULLABLE
notes               TEXT NULLABLE
```

---

#### `reviews`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
product_id          BIGINT UNSIGNED FK
customer_id         BIGINT UNSIGNED FK NULLABLE
order_id            BIGINT UNSIGNED FK NULLABLE
reviewer_name       VARCHAR(255)
reviewer_email      VARCHAR(255) NULLABLE
rating              TINYINT UNSIGNED  -- 1-5
title_en            VARCHAR(255) NULLABLE
title_ar            VARCHAR(255) NULLABLE
body_en             TEXT NULLABLE
body_ar             TEXT NULLABLE
is_verified         TINYINT(1) DEFAULT 0
is_approved         TINYINT(1) DEFAULT 0
is_featured         TINYINT(1) DEFAULT 0
helpful_count       INT DEFAULT 0
locale              ENUM('en','ar') DEFAULT 'en'
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `cms_pages`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
title_en            VARCHAR(500)
title_ar            VARCHAR(500)
slug_en             VARCHAR(500) UNIQUE
slug_ar             VARCHAR(500) UNIQUE
content_en          LONGTEXT NULLABLE
content_ar          LONGTEXT NULLABLE
type                ENUM('page','policy','landing') DEFAULT 'page'
meta_title_en       VARCHAR(255) NULLABLE
meta_description_en VARCHAR(500) NULLABLE
meta_title_ar       VARCHAR(255) NULLABLE
meta_description_ar VARCHAR(500) NULLABLE
is_active           TINYINT(1) DEFAULT 1
sort_order          INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `blog_posts`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
author_id           BIGINT UNSIGNED FK → users.id
title_en            VARCHAR(500)
title_ar            VARCHAR(500)
slug_en             VARCHAR(500) UNIQUE
slug_ar             VARCHAR(500) UNIQUE
excerpt_en          TEXT NULLABLE
excerpt_ar          TEXT NULLABLE
content_en          LONGTEXT NULLABLE
content_ar          LONGTEXT NULLABLE
featured_image_url  VARCHAR(500) NULLABLE
category            VARCHAR(255) NULLABLE
tags                JSON NULLABLE
status              ENUM('draft','published','archived') DEFAULT 'draft'
published_at        TIMESTAMP NULLABLE
meta_title_en       VARCHAR(255) NULLABLE
meta_description_en VARCHAR(500) NULLABLE
meta_title_ar       VARCHAR(255) NULLABLE
meta_description_ar VARCHAR(500) NULLABLE
views_count         INT DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP NULLABLE
```

---

#### `faqs`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
question_en         TEXT
question_ar         TEXT
answer_en           LONGTEXT
answer_ar           LONGTEXT
category            VARCHAR(255) NULLABLE
sort_order          INT DEFAULT 0
is_active           TINYINT(1) DEFAULT 1
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `homepage_sections`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
key                 VARCHAR(100) UNIQUE  -- 'hero','categories','featured_products'
label_en            VARCHAR(255)
label_ar            VARCHAR(255)
is_active           TINYINT(1) DEFAULT 1
sort_order          INT DEFAULT 0
settings            JSON  -- section-specific configuration
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `media`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
disk                VARCHAR(50) DEFAULT 'public'
path                VARCHAR(1000)
url                 VARCHAR(1000)
cdn_url             VARCHAR(1000) NULLABLE
original_name       VARCHAR(500)
mime_type           VARCHAR(100)
size                BIGINT
width               INT NULLABLE
height              INT NULLABLE
alt_en              VARCHAR(500) NULLABLE
alt_ar              VARCHAR(500) NULLABLE
folder              VARCHAR(255) NULLABLE
uploaded_by         BIGINT UNSIGNED FK → users.id NULLABLE
created_at          TIMESTAMP
```

---

#### `ai_conversations`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
uuid                CHAR(36) UNIQUE
session_id          VARCHAR(255)
customer_id         BIGINT UNSIGNED FK NULLABLE
visitor_id          VARCHAR(255) NULLABLE
locale              ENUM('en','ar') DEFAULT 'en'
platform            ENUM('web','whatsapp','api') DEFAULT 'web'
lead_captured       TINYINT(1) DEFAULT 0
lead_name           VARCHAR(255) NULLABLE
lead_phone          VARCHAR(50) NULLABLE
handoff_requested   TINYINT(1) DEFAULT 0
handoff_at          TIMESTAMP NULLABLE
messages            JSON
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `ai_training_documents`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
title               VARCHAR(500)
type                ENUM('faq','product','policy','company','sales_guide')
content_en          LONGTEXT
content_ar          LONGTEXT NULLABLE
is_active           TINYINT(1) DEFAULT 1
vector_id           VARCHAR(255) NULLABLE  -- external vector DB reference
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

#### `whatsapp_messages`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
quotation_id        BIGINT UNSIGNED FK NULLABLE
order_id            BIGINT UNSIGNED FK NULLABLE
customer_id         BIGINT UNSIGNED FK NULLABLE
to_number           VARCHAR(50)
template_id         VARCHAR(255) NULLABLE
body                TEXT
status              ENUM('queued','sent','delivered','read','failed')
provider_message_id VARCHAR(255) NULLABLE
sent_at             TIMESTAMP NULLABLE
delivered_at        TIMESTAMP NULLABLE
created_at          TIMESTAMP
```

---

#### `activity_logs`
```
id                  BIGINT UNSIGNED PK AUTO_INCREMENT
user_id             BIGINT UNSIGNED FK NULLABLE
event               VARCHAR(255)
subject_type        VARCHAR(255) NULLABLE
subject_id          BIGINT UNSIGNED NULLABLE
properties          JSON NULLABLE
ip_address          VARCHAR(45) NULLABLE
user_agent          TEXT NULLABLE
created_at          TIMESTAMP
```

---

## 7. ERD STRUCTURE

### 7.1 Entity Relationship Overview

```
TENANTS (H2)
    │
    ├──< USERS (admin, sales, customer roles)
    │
    ├──< BRANDS
    │
    ├──< CATEGORIES (self-referencing tree)
    │
    ├──< COLLECTIONS
    │
    └──< PRODUCTS
              │
              ├──< PRODUCT_CATEGORIES (pivot)
              ├──< PRODUCT_COLLECTIONS (pivot)
              ├──< PRODUCT_IMAGES
              ├──< PRODUCT_ATTRIBUTES ──> ATTRIBUTE_OPTIONS ──> ATTRIBUTE_GROUPS
              │
              └──< PRODUCT_VARIATIONS
                        │
                        ├──< VARIATION_ATTRIBUTES ──> ATTRIBUTE_OPTIONS
                        └──< PRODUCT_IMAGES (variation-specific)

CUSTOMERS
    │
    ├──< ADDRESSES
    ├──< ORDERS
    │       └──< ORDER_ITEMS ──> PRODUCTS / VARIATIONS
    ├──< QUOTATIONS
    │       └──< QUOTATION_ITEMS
    ├──< REVIEWS ──> PRODUCTS
    └──< AI_CONVERSATIONS

ADMIN
    │
    ├──< CMS_PAGES
    ├──< BLOG_POSTS
    ├──< FAQS
    ├──< HOMEPAGE_SECTIONS
    ├──< MEDIA
    ├──< AI_TRAINING_DOCUMENTS
    ├──< WHATSAPP_MESSAGES
    └──< ACTIVITY_LOGS
```

### 7.2 Key Relationships Summary

| From | To | Type | Notes |
|---|---|---|---|
| products | categories | Many-to-many | Via product_categories |
| products | brands | Many-to-one | Direct FK |
| products | collections | Many-to-many | Via product_collections |
| products | attribute_options | Many-to-many | Via product_attributes |
| product_variations | attribute_options | Many-to-many | Via variation_attributes |
| product_variations | products | Many-to-one | Direct FK |
| categories | categories | Self-referencing | Parent/child tree |
| orders | customers | Many-to-one | FK + guest allowed |
| quotations | products | Many-to-one | Optional (free-text fallback) |
| tenants | products/brands/categories | One-to-many | Multi-tenant scope (H2) |

---

## 8. API ARCHITECTURE

### 8.1 Design Principles

- **RESTful** resource-based routes with JSON responses
- **Versioned**: All routes under `/api/v1/`
- **Stateless**: JWT for customer auth, Sanctum for admin SPA
- **Consistent response envelope**:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": { "current_page": 1, "total": 120, "per_page": 24 }
  },
  "message": null
}
```

- **Error format**:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "fields": { "email": ["The email field is required."] }
  }
}
```

---

### 8.2 Public API Routes

```
GET    /api/v1/products
GET    /api/v1/products/{slug}
GET    /api/v1/products/{slug}/variations
GET    /api/v1/products/{slug}/reviews
POST   /api/v1/products/{slug}/reviews

GET    /api/v1/categories
GET    /api/v1/categories/{slug}
GET    /api/v1/categories/{slug}/products

GET    /api/v1/brands
GET    /api/v1/brands/{slug}
GET    /api/v1/brands/{slug}/products

GET    /api/v1/collections
GET    /api/v1/collections/{slug}
GET    /api/v1/collections/{slug}/products

GET    /api/v1/search?q=&locale=en
GET    /api/v1/filters?category={slug}
GET    /api/v1/compare?ids=1,2,3

GET    /api/v1/homepage
GET    /api/v1/pages/{slug}
GET    /api/v1/blog
GET    /api/v1/blog/{slug}
GET    /api/v1/faqs

POST   /api/v1/quotations
POST   /api/v1/leads

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/account/orders           [auth]
GET    /api/v1/account/orders/{uuid}    [auth]
GET    /api/v1/account/quotations       [auth]
GET    /api/v1/account/profile          [auth]
PUT    /api/v1/account/profile          [auth]
GET    /api/v1/account/addresses        [auth]
POST   /api/v1/account/addresses        [auth]

GET    /api/v1/cart                     [session]
POST   /api/v1/cart/items               [session]
PUT    /api/v1/cart/items/{id}          [session]
DELETE /api/v1/cart/items/{id}          [session]
DELETE /api/v1/cart                     [session]

POST   /api/v1/checkout/initiate
POST   /api/v1/checkout/confirm
GET    /api/v1/checkout/verify/{ref}

POST   /api/v1/ai/chat
GET    /api/v1/ai/session/{uuid}
```

---

### 8.3 Admin API Routes

```
All prefixed: /api/v1/admin/
All protected: [auth:sanctum] + [role:admin|manager]

--- Products ---
GET    /products
POST   /products
GET    /products/{id}
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/images
DELETE /products/{id}/images/{imageId}
POST   /products/import

--- Variations ---
GET    /products/{id}/variations
POST   /products/{id}/variations
PUT    /products/{id}/variations/{varId}
DELETE /products/{id}/variations/{varId}

--- Attributes ---
GET    /attributes/groups
POST   /attributes/groups
PUT    /attributes/groups/{id}
DELETE /attributes/groups/{id}
GET    /attributes/groups/{id}/options
POST   /attributes/groups/{id}/options
PUT    /attributes/options/{id}
DELETE /attributes/options/{id}

--- Categories / Brands / Collections ---
CRUD pattern for each resource

--- Orders ---
GET    /orders
GET    /orders/{uuid}
PUT    /orders/{uuid}/status
POST   /orders/{uuid}/notes

--- Quotations ---
GET    /quotations
GET    /quotations/{uuid}
PUT    /quotations/{uuid}
POST   /quotations/{uuid}/notes
POST   /quotations/{uuid}/assign
POST   /quotations/{uuid}/whatsapp

--- Customers ---
GET    /customers
GET    /customers/{uuid}
PUT    /customers/{uuid}
GET    /customers/{uuid}/orders
GET    /customers/{uuid}/quotations

--- CMS ---
CRUD /pages
CRUD /blog
CRUD /faqs

--- Homepage Builder ---
GET    /homepage/sections
PUT    /homepage/sections/reorder
PUT    /homepage/sections/{key}

--- SEO ---
GET    /seo/redirects
POST   /seo/redirects
POST   /seo/generate-sitemap

--- AI ---
GET    /ai/training-documents
POST   /ai/training-documents
PUT    /ai/training-documents/{id}
DELETE /ai/training-documents/{id}
POST   /ai/sync-vectors
GET    /ai/conversations
GET    /ai/conversations/{uuid}

--- Analytics ---
GET    /analytics/overview
GET    /analytics/products
GET    /analytics/quotations
GET    /analytics/ai

--- System ---
GET    /settings
PUT    /settings
GET    /users
POST   /users
GET    /roles
POST   /roles
PUT    /roles/{id}/permissions
```

---

### 8.4 API Middleware Stack

```
Request Flow:
HTTP Request
    → Cloudflare (DDoS, WAF, rate limit)
    → Nginx (TLS termination, proxy)
    → Laravel Router
        → ThrottleRequests (per IP / per user)
        → SetLocale (Accept-Language or ?locale= param)
        → CORS (configured for frontend domain)
        → Authenticate (JWT or Sanctum)
        → Authorize (Spatie roles/permissions)
        → ValidateRequest (Form Request class)
        → Controller
        → ResponseTransformer (API Resource)
    → JSON Response
```

---

## 9. BACKEND ARCHITECTURE

### 9.1 Directory Structure

```
app/
├── Console/
│   └── Commands/
│       ├── GenerateSitemap.php
│       ├── SyncAIVectors.php
│       └── ProcessWhatsAppQueue.php
│
├── Exceptions/
│   └── Handler.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Api/V1/
│   │   │   ├── Auth/
│   │   │   ├── Public/
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── SearchController.php
│   │   │   │   ├── FilterController.php
│   │   │   │   ├── QuotationController.php
│   │   │   │   ├── CartController.php
│   │   │   │   ├── CheckoutController.php
│   │   │   │   ├── HomepageController.php
│   │   │   │   └── AiChatController.php
│   │   │   └── Admin/
│   │   │       ├── ProductController.php
│   │   │       ├── VariationController.php
│   │   │       ├── AttributeController.php
│   │   │       ├── OrderController.php
│   │   │       ├── QuotationController.php
│   │   │       ├── CustomerController.php
│   │   │       ├── CmsController.php
│   │   │       ├── HomepageBuilderController.php
│   │   │       ├── AnalyticsController.php
│   │   │       ├── AiSettingsController.php
│   │   │       └── WhatsAppController.php
│   │
│   ├── Middleware/
│   │   ├── SetLocale.php
│   │   ├── EnsureAdminRole.php
│   │   └── TrackProductView.php
│   │
│   └── Requests/
│       ├── StoreProductRequest.php
│       ├── StoreQuotationRequest.php
│       └── ...
│
├── Models/
│   ├── Tenant.php
│   ├── User.php
│   ├── Product.php
│   ├── ProductVariation.php
│   ├── AttributeGroup.php
│   ├── AttributeOption.php
│   ├── Category.php
│   ├── Brand.php
│   ├── Collection.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Quotation.php
│   ├── Customer.php
│   ├── Review.php
│   ├── CmsPage.php
│   ├── BlogPost.php
│   ├── Faq.php
│   ├── HomepageSection.php
│   ├── Media.php
│   ├── AiConversation.php
│   └── WhatsappMessage.php
│
├── Services/
│   ├── ProductService.php
│   ├── VariationService.php
│   ├── FilterService.php
│   ├── SearchService.php
│   ├── CartService.php
│   ├── CheckoutService.php
│   ├── QuotationService.php
│   ├── PaymentService.php
│   ├── AiChatService.php
│   ├── WhatsAppService.php
│   ├── MediaService.php
│   ├── SeoService.php
│   └── ImageOptimizationService.php
│
├── Repositories/
│   ├── ProductRepository.php
│   ├── OrderRepository.php
│   ├── QuotationRepository.php
│   └── CustomerRepository.php
│
├── Resources/   (API Resources / Transformers)
│   ├── ProductResource.php
│   ├── ProductDetailResource.php
│   ├── VariationResource.php
│   ├── CategoryResource.php
│   ├── OrderResource.php
│   └── QuotationResource.php
│
├── Events/
│   ├── QuotationCreated.php
│   ├── OrderPlaced.php
│   └── LeadCaptured.php
│
├── Listeners/
│   ├── SendQuotationNotification.php
│   ├── SendOrderConfirmation.php
│   └── NotifyWhatsApp.php
│
└── Jobs/
    ├── SendWhatsAppMessage.php
    ├── ProcessImageOptimization.php
    ├── GenerateSitemap.php
    └── SyncAiVector.php
```

---

### 9.2 Caching Strategy

| Resource | Cache Driver | TTL | Invalidation Trigger |
|---|---|---|---|
| Homepage sections | Redis | 1 hour | HomepageSection update |
| Category tree | Redis | 6 hours | Category create/update/delete |
| Product detail | Redis | 30 min | Product update |
| Product listings | Redis | 15 min | Product update, stock change |
| Filter options | Redis | 1 hour | Attribute option change |
| Blog posts | Redis | 2 hours | BlogPost publish/update |
| FAQ list | Redis | 12 hours | FAQ create/update |
| Sitemap | File cache | 24 hours | Nightly cron |

**Cache Keys Convention:**
```
products:listing:{category}:{page}:{filters_hash}:{locale}
products:detail:{slug}:{locale}
categories:tree:{locale}
filters:{category_slug}:{locale}
homepage:sections:{locale}
```

---

### 9.3 Queue Configuration

| Queue | Worker | Jobs |
|---|---|---|
| `default` | 2 workers | Email notifications, PDF generation |
| `whatsapp` | 1 worker | WhatsApp API calls |
| `media` | 1 worker | Image optimization, CDN upload |
| `ai` | 1 worker | AI vector sync, chat logging |
| `high` | 1 worker | Payment webhooks, critical alerts |

---

### 9.4 Key Laravel Packages

| Package | Purpose |
|---|---|
| `spatie/laravel-permission` | Role-based access control |
| `spatie/laravel-medialibrary` | Media management with conversions |
| `spatie/laravel-translatable` | Multi-locale model attributes |
| `spatie/laravel-sluggable` | Auto slug generation |
| `spatie/laravel-query-builder` | API filter/sort/include |
| `spatie/laravel-activitylog` | Audit trail |
| `spatie/laravel-sitemap` | XML sitemap generation |
| `laravel/sanctum` | Admin SPA authentication |
| `tymon/jwt-auth` | Customer API JWT |
| `barryvdh/laravel-dompdf` | Quotation PDF generation |
| `league/flysystem-aws-s3-v3` | Object storage (S3-compatible) |
| `intervention/image` | Image processing |
| `openai-php/laravel` | OpenAI API integration |

---

## 10. FRONTEND ARCHITECTURE

### 10.1 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          (root layout with locale)
│   │   ├── page.tsx            (homepage)
│   │   ├── shop/
│   │   │   └── page.tsx
│   │   ├── category/
│   │   │   └── [slug]/page.tsx
│   │   ├── product/
│   │   │   └── [slug]/page.tsx
│   │   ├── brand/
│   │   │   └── [slug]/page.tsx
│   │   ├── collection/
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── quotation/page.tsx
│   │   ├── account/
│   │   │   ├── layout.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── search/page.tsx
│   │   └── [page_slug]/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── LocaleSwitcher.tsx
│   │
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariationSelector.tsx
│   │   ├── AttributeDisplay.tsx
│   │   ├── ProductReviews.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── ProductComparison.tsx
│   │   └── QuickView.tsx
│   │
│   ├── shop/
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterPanel.tsx        (mobile bottom sheet)
│   │   ├── ActiveFilters.tsx
│   │   ├── SortDropdown.tsx
│   │   └── Pagination.tsx
│   │
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   │
│   ├── quotation/
│   │   ├── QuotationForm.tsx
│   │   └── QuotationSuccess.tsx
│   │
│   ├── homepage/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CollectionsShowcase.tsx
│   │   ├── BestSellers.tsx
│   │   ├── ReviewsCarousel.tsx
│   │   ├── FaqAccordion.tsx
│   │   └── CtaBanner.tsx
│   │
│   ├── ai/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatBubble.tsx
│   │   └── ChatInput.tsx
│   │
│   ├── ui/                        (Shadcn UI extensions)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Drawer.tsx
│   │   ├── Sheet.tsx
│   │   ├── Dialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── ...
│   │
│   └── shared/
│       ├── WhatsAppButton.tsx
│       ├── PriceDisplay.tsx
│       ├── StarRating.tsx
│       ├── ImageWithFallback.tsx
│       └── LocalizedLink.tsx
│
├── hooks/
│   ├── useCart.ts
│   ├── useFilters.ts
│   ├── useProducts.ts
│   ├── useLocale.ts
│   ├── useAuth.ts
│   └── useWhatsApp.ts
│
├── store/
│   ├── cartStore.ts              (Zustand)
│   ├── filterStore.ts
│   ├── authStore.ts
│   └── uiStore.ts
│
├── lib/
│   ├── api.ts                    (Axios instance)
│   ├── queryClient.ts            (React Query)
│   ├── i18n.ts                   (next-intl config)
│   ├── utils.ts
│   └── seo.ts
│
├── types/
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── quotation.types.ts
│   ├── filter.types.ts
│   ├── api.types.ts
│   └── locale.types.ts
│
└── messages/
    ├── en.json
    └── ar.json
```

---

### 10.2 State Management Strategy

| State Type | Solution | Reason |
|---|---|---|
| Server state (products, categories) | React Query (TanStack Query) | Caching, refetching, deduplication |
| Cart state | Zustand + localStorage | Persistent, lightweight |
| Filter state | Zustand + URL params | Shareable, bookmarkable URLs |
| Auth state | Zustand + secure cookies | Session persistence |
| UI state (modals, drawers) | Zustand | Avoids prop drilling |

---

### 10.3 Internationalization (i18n) Architecture

- **Library:** `next-intl`
- **Routing:** Locale-prefixed routes (`/en/`, `/ar/`)
- **Direction:** `dir="rtl"` applied at `<html>` level for Arabic
- **TailwindCSS RTL:** `tailwindcss-rtl` plugin for logical properties
- **Font Strategy:**
  - English: Inter / Geist Sans
  - Arabic: Cairo or Noto Sans Arabic (Google Fonts with `font-display: swap`)
- **Translation files:** Flat JSON — one key per string, no nested objects beyond component grouping
- **Date/Number formatting:** `Intl.DateTimeFormat` and `Intl.NumberFormat` with locale `ar-AE` / `en-AE`

---

### 10.4 Performance Strategy

- **Framework:** Next.js 15 (App Router) with React Server Components
- **Rendering Modes:**
  - Homepage: ISR (revalidate: 3600)
  - Category/Brand pages: ISR (revalidate: 1800)
  - Product pages: ISR (revalidate: 600) + on-demand revalidation on product update
  - Cart/Checkout/Account: Client-side only (no SSR)
- **Image handling:** `next/image` with WebP conversion, CDN domain configured
- **Bundle splitting:** Route-based automatic code splitting
- **Prefetching:** `<Link prefetch>` for in-viewport navigation links

---

## 11. CMS ARCHITECTURE

### 11.1 Overview

The CMS is a lightweight, headless content management system embedded in the Laravel admin panel. It does **not** use any third-party CMS platform. All content is stored in the MySQL database and served via the API.

### 11.2 Content Types

| Type | Table | Purpose |
|---|---|---|
| Pages | `cms_pages` | Static pages (About, Contact, Delivery, etc.) |
| Blog Posts | `blog_posts` | SEO articles and sleep guides |
| FAQs | `faqs` | Accordion FAQ sections |
| Policies | `cms_pages` (type=policy) | Privacy, Returns, Warranty |
| Homepage Sections | `homepage_sections` | Drag-and-drop homepage builder |

### 11.3 Editor Requirements

- **Rich text editor:** Tiptap (React, extensible, outputs clean HTML)
- **Arabic content:** Full RTL editor mode
- **Image insertion:** Media picker from object storage
- **SEO fields:** Meta title, description, OG image per content item
- **Preview:** Admin can preview content in public locale (AR/EN) before publishing

### 11.4 Homepage Builder

The homepage builder is a section management interface — not a page builder. Admins control:

| Action | Capability |
|---|---|
| Enable/Disable section | Toggle visibility |
| Reorder sections | Drag-and-drop sort |
| Configure section | Section-specific settings (products to feature, heading text, etc.) |

**Sections Registry:**
```
key: hero            → settings: {heading_en, heading_ar, subtext_en, subtext_ar, image_url, cta_text_en, cta_text_ar, cta_url}
key: categories      → settings: {heading_en, heading_ar, max_items, selected_ids}
key: featured        → settings: {heading_en, heading_ar, product_ids}
key: collections     → settings: {heading_en, heading_ar, collection_ids}
key: best_sellers    → settings: {heading_en, heading_ar, limit}
key: brands          → settings: {heading_en, heading_ar, brand_ids}
key: reviews         → settings: {heading_en, heading_ar, limit, show_rating}
key: faq             → settings: {heading_en, heading_ar, faq_ids}
key: cta_banner      → settings: {heading_en, heading_ar, subtext, bg_color, image_url, cta_url}
key: blog            → settings: {heading_en, heading_ar, limit}
```

---

## 12. PRODUCT ENGINE

### 12.1 Product Types

| Type | Description |
|---|---|
| `simple` | Single SKU, no variations — e.g., a pillow with one size |
| `variable` | Multiple variations based on attributes — e.g., mattress with size/firmness options |

### 12.2 Product Lifecycle

```
Draft → Active → Archived
  │
  └─ Scheduled publish (future)
```

### 12.3 Product Display Logic

1. **Price display:** Shows base price. If variation selected, shows variation price. If sale_price set, shows strikethrough + sale price.
2. **Stock display:** Calculated per variation. "In Stock" / "Out of Stock" / "Limited Stock" (< 5).
3. **Image display:** Primary product images shown by default. Variation-specific images replace gallery when variation selected.
4. **Add to Cart vs Quotation:** Both available by default. Admin can disable either per product.

### 12.4 Product Search

- **Driver:** MySQL FULLTEXT index on `name_en, name_ar, description_en, description_ar`
- **Enhancement (Phase 2):** Algolia or Meilisearch for advanced relevance
- **Autocomplete:** Debounced API call returning product names + categories
- **Search result page:** Same filter/sort interface as category page

### 12.5 Product Comparison

- Maximum 4 products compared simultaneously
- Comparison table dynamically built from attribute groups both products share
- Stored in browser localStorage (no auth required)
- Direct "Compare" button on product cards and product pages

---

## 13. ATTRIBUTE ENGINE

### 13.1 Architecture Overview

The attribute engine is a fully dynamic, no-code system that allows admin to define product characteristics without developer intervention.

### 13.2 Attribute Group Types

| Type | UI Control | Example |
|---|---|---|
| `select` | Radio buttons / Dropdown | Firmness: Soft, Medium, Firm |
| `multiselect` | Checkboxes | Technologies: Memory Foam + Cooling Gel |
| `color` | Color swatches | Color: Beige, White, Grey |
| `size` | Size buttons | Size: 90x200, 120x200, 180x200 |
| `boolean` | Yes/No toggle | Washable Cover: Yes |
| `text` | Free text label | Custom dimension label |

### 13.3 Attribute Group Properties

Each group has:
- `is_filterable` → Appears in shop filter sidebar
- `is_comparable` → Appears in product comparison table
- `is_required` → Product must have this attribute assigned
- `sort_order` → Controls display order on product page

### 13.4 Attribute Assignment Flow

**Admin creates a product:**
1. Selects applicable attribute groups for the product category
2. For each group, selects applicable options (or creates new options inline)
3. For variable products, selects which groups define variations
4. System auto-generates variation combinations (or admin manually creates)

### 13.5 Attribute Inheritance

When a category has default attribute groups configured, those groups are pre-selected when creating a product in that category. Admin can add or remove groups freely.

---

## 14. VARIATION ENGINE

### 14.1 Variation Matrix

For a mattress with 2 variation-defining attributes (Size × Firmness), the system builds a matrix:

```
Size \ Firmness   | Soft      | Medium    | Firm
------------------|-----------|-----------|--------
90x200            | SKU-001   | SKU-002   | SKU-003
120x200           | SKU-004   | SKU-005   | SKU-006
180x200           | SKU-007   | SKU-008   | SKU-009
```

Each cell is a `product_variation` record.

### 14.2 Variation Fields Per SKU

| Field | Required | Notes |
|---|---|---|
| SKU | Optional | Auto-generated if empty |
| Price | Required | Overrides base product price |
| Sale Price | Optional | |
| Stock Quantity | Required | Tracked per variation |
| Stock Status | Auto | Calculated from quantity |
| Images | Optional | Variation-specific gallery |
| Weight | Optional | For shipping calculations |
| Dimensions | Optional | JSON: {L, W, H, unit} |

### 14.3 Variation Selection UX

On the product page:
1. Attribute group controls rendered (size buttons, color swatches, etc.)
2. On selection change → API call fetches matching variation or system resolves client-side from pre-loaded variation map
3. Price, stock status, images, SKU update instantly
4. "Add to Cart" / "Request Quotation" reflects selected variation

**Performance Optimization:** All variations pre-loaded as a JSON map on product page load (for products with ≤ 50 variations). For products with > 50 variations, lazy load on attribute change.

---

## 15. FILTER ENGINE

### 15.1 Architecture

The filter engine is entirely driven by the attribute system. No filters are hardcoded.

### 15.2 Filter Generation Process

```
1. Admin marks attribute group as is_filterable = true
2. FilterService queries all active options for that group
   that have at least one active product in current category
3. Returns structured filter definition:
   {
     group_id: 3,
     group_name_en: "Firmness",
     group_name_ar: "صلابة المرتبة",
     type: "select",
     options: [
       { id: 12, value_en: "Soft", value_ar: "ناعم", count: 24 },
       { id: 13, value_en: "Medium", value_ar: "متوسط", count: 41 },
       { id: 14, value_en: "Firm", value_ar: "صلب", count: 18 }
     ]
   }
```

### 15.3 Standard Filter Groups

| Filter | Source | Type |
|---|---|---|
| Price Range | product.base_price | Range slider |
| Category | categories table | Checkbox tree |
| Brand | brands table | Checkbox |
| Collection | collections table | Checkbox |
| Size | Attribute Group "Size" | Button grid |
| Material | Attribute Group "Material" | Checkbox |
| Firmness | Attribute Group "Firmness" | Radio/Checkbox |
| Comfort Level | Attribute Group "Comfort Level" | Checkbox |
| Technology | Attribute Group "Technology" | Checkbox |
| Color | Attribute Group "Color" | Color swatch |
| Warranty | Attribute Group "Warranty" | Checkbox |

### 15.4 URL State

Filters are reflected in URL query parameters for shareability and SEO:

```
/en/category/mattresses?firmness=soft,medium&size=180x200&price_min=500&price_max=3000&brand=dormeo&sort=price_asc&page=2
```

### 15.5 Filter Performance

- Filter counts computed in a single aggregation query per filter group
- Results cached in Redis for 15 minutes per `{category_slug}:{locale}` key
- Cache invalidated on product create/update/delete in that category
- Empty filter options automatically hidden from UI

---

## 16. QUOTATION ENGINE

### 16.1 Quotation Sources

| Source | Trigger |
|---|---|
| `web_form` | Customer fills quotation form on product page |
| `whatsapp` | WhatsApp message parsed and stored as lead |
| `ai_chat` | AI chatbot captures lead and creates quotation |
| `phone` | Admin manually creates quotation for phone inquiry |
| `admin` | Admin creates quote for B2B customer directly |

### 16.2 Quotation Workflow

```
STATE MACHINE:
new → contacted → quoted → approved
              ↓
           rejected
```

| Status | Who Sets | Triggers |
|---|---|---|
| `new` | System (auto) | Email to admin, WhatsApp to sales |
| `contacted` | Sales rep | Internal note required |
| `quoted` | Sales rep | Quote amount entered, PDF generated |
| `approved` | Sales rep | Convert to order option available |
| `rejected` | Sales rep | Reason note saved |

### 16.3 Admin Quotation Pipeline

The quotation pipeline is a Kanban-style board in the admin dashboard:

```
[ NEW ] [ CONTACTED ] [ QUOTED ] [ APPROVED ] [ REJECTED ]
  │
  └── Card shows: Customer name, product, date, WhatsApp button
```

### 16.4 Quotation Form — Fields

**Required:**
- First Name, Last Name
- Phone Number
- Email Address
- Country (default: UAE), City/Emirate

**Pre-filled from product page:**
- Product name + variation

**Optional:**
- Company name
- Quantity
- Notes / Special requirements

**Hidden (system-filled):**
- Source, locale, IP, product_id, variation_id

### 16.5 Quotation PDF Generation

Admin can generate a PDF quotation document containing:
- Company logo and contact details
- Quote number and date
- Customer details
- Line items with prices
- Total
- Valid-until date
- Terms and conditions
- Arabic or English version based on customer locale

---

## 17. AI ARCHITECTURE

### 17.1 Architecture Overview

The AI system is built as a modular, provider-agnostic service layer. The initial integration targets OpenAI GPT-4o. The architecture allows swapping providers or adding local models without frontend changes.

### 17.2 Components

```
┌─────────────────────────────────────────────┐
│              AI Chat Widget (React)          │
│  - Renders message thread                   │
│  - Sends user messages to /api/v1/ai/chat   │
│  - Displays typing indicator                │
│  - Handles WhatsApp handoff action          │
└───────────────────┬─────────────────────────┘
                    │ HTTP
┌───────────────────▼─────────────────────────┐
│          AiChatController (Laravel)          │
│  - Rate limiting (10 msgs/min per session)  │
│  - Session management                       │
│  - Routes to AiChatService                  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│             AiChatService                   │
│                                             │
│  1. Build context:                          │
│     - Conversation history                  │
│     - System prompt (company + locale)      │
│     - Retrieved RAG context                 │
│                                             │
│  2. Intent detection:                       │
│     - product_recommendation                │
│     - faq_answer                            │
│     - lead_capture                          │
│     - delivery_inquiry                      │
│     - human_handoff                         │
│                                             │
│  3. Call OpenAI API                         │
│                                             │
│  4. Process response:                       │
│     - Extract product recommendations       │
│     - Extract captured lead data            │
│     - Determine if handoff required         │
│                                             │
│  5. Store message in ai_conversations       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│          Knowledge Base (RAG Layer)         │
│                                             │
│  Sources:                                   │
│  - ai_training_documents (products, FAQ,    │
│    policies, company info, sales guides)    │
│                                             │
│  Vector Storage: pgvector or Pinecone       │
│  Embedding Model: text-embedding-3-small    │
│                                             │
│  Retrieval: top-5 semantic matches          │
│  per user query                             │
└─────────────────────────────────────────────┘
```

### 17.3 System Prompt Strategy

The system prompt is loaded dynamically from admin settings and includes:

```
- Company identity and tone of voice
- Language instruction (Arabic/English based on detected locale)
- Product catalog summary
- Sales guidance rules (never discount more than X%)
- Escalation rules (when to hand off to human)
- Lead capture script
```

### 17.4 Training Document Types

| Type | Content | Update Frequency |
|---|---|---|
| `product` | Product names, features, prices, specs | On product update |
| `faq` | FAQ questions and answers | On FAQ update |
| `policy` | Delivery, returns, warranty policies | Manual |
| `company` | Brand story, USPs, showroom info | Manual |
| `sales_guide` | Recommended products by persona/need | Manual |

### 17.5 Lead Capture Flow

When AI detects purchase intent:
1. AI asks for name and WhatsApp number naturally in conversation
2. On capture, system creates a `quotation` record (source: `ai_chat`)
3. Admin notified via email + dashboard badge
4. Chat offers: "Connect you with our sales team on WhatsApp?"
5. On yes → WhatsApp deeplink opens with pre-filled message

### 17.6 Arabic Language Handling

- OpenAI GPT-4o has strong Arabic support — no separate model needed
- System prompt instructs AI to respond in Arabic if user writes in Arabic
- Fallback: if locale header is `ar`, force Arabic responses regardless of input language

---

## 18. WHATSAPP ARCHITECTURE

### 18.1 Integration Strategy

| Channel | Purpose |
|---|---|
| WhatsApp Deeplinks | Immediate: clickable `wa.me` links with pre-filled messages |
| WhatsApp Business API | Phase 2: Programmatic messaging, templates, notifications |

### 18.2 Phase 1 — WhatsApp Deeplinks

Every product page and quotation form includes:

```
https://wa.me/{BUSINESS_NUMBER}?text=Hi, I'm interested in {product_name} ({variation})...
```

Deeplink text is pre-filled in the customer's language (Arabic/English).

### 18.3 Phase 2 — WhatsApp Business API

**Provider:** Twilio or 360dialog (Meta Business API partner)

**Automated Messages:**

| Trigger | Template | Recipient |
|---|---|---|
| New quotation submitted | "We received your inquiry for {product}" | Customer |
| New quotation (admin) | "New lead: {customer_name} — {product}" | Sales team |
| Order confirmed | "Your order #{number} is confirmed" | Customer |
| Order shipped | "Your order is on the way — track: {link}" | Customer |
| Lead captured by AI | "New AI lead: {name} — {phone}" | Sales team |

**Message Templates:** All templates submitted to Meta for approval before use.

### 18.4 WhatsApp Settings (Admin)

Admin configures in `/admin/whatsapp-settings`:
- Business phone number
- API credentials
- Template IDs for each trigger
- Default sales agent phone number for routing
- Enable/disable each automated message type

---

## 19. DASHBOARD ARCHITECTURE

### 19.1 Overview Metrics

The admin dashboard landing page displays:

```
┌──────────────────────────────────────────────────────────┐
│  OVERVIEW (Today / This Week / This Month — toggle)      │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Revenue  │ │  Orders  │ │  Quotes  │ │  Leads   │   │
│  │ AED 24k  │ │    18    │ │    7     │ │    23    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  [ Revenue Chart — 30 days line graph ]                  │
│                                                          │
│  [ Quotation Pipeline ]  [ Recent Orders ]               │
│  NEW: 5  CONTACTED: 3    Order #1001 — AED 2,400         │
│  QUOTED: 2 APPROVED: 1   Order #1002 — AED 870           │
│                                                          │
│  [ Top Products ]        [ AI Chat Stats ]               │
│  1. Luxury Mattress 180  Sessions: 42                    │
│  2. Memory Pillow Pro    Leads captured: 8               │
│  3. Bed Frame Oak King   Handoffs: 3                     │
└──────────────────────────────────────────────────────────┘
```

### 19.2 Module Descriptions

#### Products Module
- Product list with search, filter by category/status
- Inline stock level indicator
- Quick actions: edit, toggle active, delete
- Bulk import via CSV template
- Product variant matrix editor
- Image upload with drag-and-drop, automatic CDN upload

#### Attribute Manager
- Create/edit attribute groups (name EN/AR, type, is_filterable, is_comparable)
- Manage options per group (add, edit, reorder, delete)
- Preview how attributes appear on product page

#### Quotation Pipeline
- Kanban board view by status
- Detail view: all customer info, product, notes, activity log
- One-click WhatsApp open to customer
- Generate PDF quote with company branding
- Assign to sales team member

#### Order Manager
- Order list with status filters
- Order detail: items, customer, address, payment, timeline
- Manual status update with note
- Refund recording

#### Customer Manager
- Customer profiles with full order + quotation history
- Total spent, lifetime value
- Tags and notes
- Export to CSV

#### Homepage Builder
- Section list with toggle and drag-to-reorder
- Click section → settings drawer slides in
- Live preview link opens frontend in new tab

#### AI Settings
- Training document CRUD
- System prompt editor (EN + AR)
- Sync vectors button
- Conversation log viewer with lead status

#### Users & Roles
- Admin user management
- Role creation with granular permission assignment
- Last login tracking
- 2FA enforcement per role

---

## 20. SEO ARCHITECTURE

### 20.1 URL Structure

```
English:
/en/                              → Homepage
/en/shop/                         → All products
/en/category/mattresses/          → Category page
/en/product/luxury-king-mattress/ → Product page
/en/brand/dormeo/                 → Brand page
/en/collection/cloud-sleep/       → Collection page
/en/blog/how-to-choose-mattress/  → Blog post

Arabic:
/ar/                              → الصفحة الرئيسية
/ar/category/مراتب/               → فئة المراتب
/ar/product/مرتبة-فاخرة/          → صفحة المنتج
```

### 20.2 Meta Tags — Per Page

| Page Type | Title Pattern | Description Pattern |
|---|---|---|
| Homepage | `{site_name} — Premium Mattresses UAE` | Site-level |
| Category | `{category_name} — Buy Online in UAE` | Category description |
| Product | `{product_name} — {brand} — {site_name}` | Product short_description |
| Brand | `{brand_name} Mattresses & Beds — {site_name}` | Brand description |
| Blog | `{post_title} — {site_name} Blog` | Post excerpt |

All title/description templates configurable via SEO admin settings.

### 20.3 Structured Data Schemas

| Page | Schema Types |
|---|---|
| Homepage | `Organization`, `WebSite`, `SearchAction` |
| Product | `Product`, `Offer`, `AggregateRating`, `Review` |
| Category | `BreadcrumbList`, `ItemList` |
| Brand | `Brand`, `BreadcrumbList` |
| Blog | `Article`, `BreadcrumbList` |
| FAQ | `FAQPage` |
| Contact | `LocalBusiness` |

### 20.4 Canonical Tags

- All paginated pages: `?page=2` → canonical points to page 1 (or self-referential per page)
- Filtered URLs: canonical points to unfiltered category URL
- Arabic / English pages: `hreflang` alternates declared

```html
<link rel="alternate" hreflang="en-AE" href="https://domain.com/en/product/luxury-mattress" />
<link rel="alternate" hreflang="ar-AE" href="https://domain.com/ar/product/مرتبة-فاخرة" />
<link rel="alternate" hreflang="x-default" href="https://domain.com/en/product/luxury-mattress" />
```

### 20.5 Sitemap Architecture

```
/sitemap.xml → Index sitemap
  ├── /sitemap-homepage.xml
  ├── /sitemap-categories.xml
  ├── /sitemap-products.xml
  ├── /sitemap-brands.xml
  ├── /sitemap-collections.xml
  └── /sitemap-blog.xml
```

- Generated nightly via Laravel Artisan command
- Submitted to Google Search Console via ping endpoint
- Arabic and English URLs in same sitemap with `hreflang` annotations

### 20.6 Technical SEO Checklist

- All pages return HTTP 200 (or appropriate 301/404)
- 301 redirect manager in admin for old URLs
- `robots.txt` blocks: `/admin/`, `/api/`, `/checkout/`
- `X-Robots-Tag: noindex` on paginated filters beyond page 3
- Open Graph tags on all public pages
- Twitter Card tags on blog posts and products

---

## 21. SECURITY ARCHITECTURE

### 21.1 Authentication & Authorization

| Layer | Mechanism |
|---|---|
| Admin SPA | Laravel Sanctum (cookie-based session) |
| Customer API | JWT (tymon/jwt-auth), 30-day expiry |
| API keys (future B2B) | Hashed API key in `api_keys` table |
| Password hashing | Bcrypt (Laravel default, cost factor 12) |
| 2FA | TOTP (Google Authenticator) — admin users |
| Role system | Spatie Laravel Permission — `superadmin`, `admin`, `manager`, `sales` |

### 21.2 Authorization Rules

| Resource | Role Access |
|---|---|
| All admin routes | `admin` role minimum |
| Delete products/categories | `superadmin` only |
| User management | `superadmin` only |
| Quotation assignment | `admin`, `manager`, `sales` |
| Financial reports | `admin`, `superadmin` |
| System settings | `superadmin` only |

### 21.3 API Security

| Protection | Implementation |
|---|---|
| Rate limiting | 60 req/min (public), 300 req/min (authenticated), via Redis |
| CORS | Strict origin whitelist — frontend domain only |
| CSRF | Laravel CSRF token on all state-changing requests |
| SQL Injection | Eloquent ORM (parameterized queries only) |
| XSS | All user content sanitized with `HTMLPurifier` before storage |
| Mass assignment | `$fillable` defined on all models — no `$guarded = []` |
| Sensitive data | PII encrypted at rest using `encrypted:` cast on sensitive model fields |

### 21.4 Infrastructure Security

| Layer | Control |
|---|---|
| Cloudflare WAF | OWASP Core Rule Set enabled |
| Cloudflare Bot Fight Mode | Enabled |
| DDoS protection | Cloudflare automatic mitigation |
| TLS | TLS 1.3 only, HSTS header with preload |
| SSH access | Key-based only, password auth disabled, non-standard port |
| Firewall | UFW — only ports 22, 80, 443 open |
| Database | Not exposed to internet — internal network only |
| Redis | Password-protected, bound to localhost |
| Environment secrets | `.env` not in version control, secrets via deployment vault |
| Backups | Daily automated MySQL dumps to object storage (encrypted), 30-day retention |

### 21.5 Data Protection

- Customer passwords: bcrypt hashed, never stored plain
- Payment data: never stored — tokenized by payment gateway
- WhatsApp numbers: treated as PII, access-logged
- Admin activity: full audit log via `activity_logs` table
- GDPR/UAE PDPL compliance: customer data deletion request support in admin

---

## 22. PERFORMANCE ARCHITECTURE

### 22.1 Lighthouse Target Breakdown

| Metric | Target | Strategy |
|---|---|---|
| Performance | 90+ | ISR, image optimization, code splitting |
| Accessibility | 95+ | Semantic HTML, ARIA, color contrast |
| Best Practices | 95+ | HTTPS, no mixed content |
| SEO | 100 | All meta tags, structured data, canonical |

### 22.2 Image Optimization Pipeline

```
Upload flow:
Admin uploads image
    → MediaService receives file
    → intervention/image generates:
       - Original (max 2400px wide)
       - Large (1200px, WebP)
       - Medium (800px, WebP)
       - Thumbnail (400px, WebP)
       - Placeholder (16px blur hash)
    → All variants uploaded to Object Storage
    → CDN served URLs stored in media table
    → Job dispatched: ProcessImageOptimization
```

**Frontend:**
- `next/image` component handles responsive `srcset`
- `blurDataURL` from placeholder for progressive loading
- Lazy loading by default on product cards
- Priority loading on above-the-fold hero images and first 3 product images

### 22.3 API Response Optimization

| Technique | Implementation |
|---|---|
| Eager loading | Defined per Resource class — no N+1 queries |
| Selective fields | API resources return only frontend-needed fields |
| Pagination | All list endpoints default 24 items, max 96 |
| Redis caching | All read-heavy endpoints cached (see §9.2) |
| DB indexes | All FK columns, slug columns, status columns indexed |
| Query analysis | Laravel Debugbar in development, Telescope in staging |

### 22.4 Redis Architecture

```
Redis usage:
├── Cache store (DB 0)
│   └── All API response caches
├── Session store (DB 1)
│   └── Admin SPA sessions
├── Queue store (DB 2)
│   └── All job queues
└── Rate limiter (DB 3)
    └── API throttle counters
```

### 22.5 CDN Configuration

- **Provider:** Cloudflare CDN (free tier sufficient for traffic level)
- **Static assets:** JS, CSS, fonts cached at edge — Cache-Control: `public, max-age=31536000, immutable`
- **Product images:** Served from Object Storage via CDN URL — Cache-Control: `public, max-age=604800`
- **API responses:** Not cached at CDN — all dynamic
- **Purge strategy:** On product update, purge product image CDN cache via Cloudflare API

---

## 23. UI/UX ARCHITECTURE

### 23.1 Design System

| Element | Specification |
|---|---|
| Primary color | Rich navy or warm charcoal (defined in brand guidelines) |
| Accent color | Warm gold or sage green |
| Neutral palette | Warm whites, light grays |
| Typography EN | Inter or Geist — weights 400, 500, 600, 700 |
| Typography AR | Cairo — weights 400, 600, 700 |
| Border radius | 8px (cards), 4px (inputs), 999px (badges) |
| Spacing scale | TailwindCSS default (4px base) |
| Shadow system | Subtle elevation shadows — no harsh drop shadows |
| Motion | Framer Motion — micro-interactions only, respects `prefers-reduced-motion` |

### 23.2 Homepage Layout

**Section sequence (default order, admin reorderable):**

```
┌─────────────────────────────────────────────┐
│  HEADER: Logo | Nav | Language | Cart | CTA  │
├─────────────────────────────────────────────┤
│  HERO: Full-width banner                     │
│  Headline + Subtext + 2 CTAs                │
│  Background: lifestyle photography           │
├─────────────────────────────────────────────┤
│  CATEGORY GRID: 6 categories                 │
│  Icon + Category name (EN/AR)               │
├─────────────────────────────────────────────┤
│  FEATURED PRODUCTS                           │
│  Section heading + horizontal scroll on mob │
│  4 columns desktop, 2 tablet, 1.5 mobile    │
├─────────────────────────────────────────────┤
│  COLLECTIONS SHOWCASE                        │
│  Large editorial image + collection name    │
│  2-column grid                              │
├─────────────────────────────────────────────┤
│  BEST SELLERS                               │
│  Same grid as featured                      │
├─────────────────────────────────────────────┤
│  BRAND LOGOS: Horizontal logo strip         │
├─────────────────────────────────────────────┤
│  TRUST BADGES: Warranty / Delivery / Return │
├─────────────────────────────────────────────┤
│  CUSTOMER REVIEWS                           │
│  Star rating aggregate + review carousel    │
├─────────────────────────────────────────────┤
│  FAQ ACCORDION                              │
├─────────────────────────────────────────────┤
│  CTA BANNER: "Get a custom quote"           │
├─────────────────────────────────────────────┤
│  FOOTER: Full links + contact + social      │
└─────────────────────────────────────────────┘
```

---

### 23.3 Shop / Category Page Layout

```
┌─────────────────────────────────────────────┐
│  BREADCRUMB: Home > Mattresses              │
│  CATEGORY HEADER: Name + description        │
├────────────┬────────────────────────────────┤
│  FILTERS   │  PRODUCT GRID                  │
│  (sidebar) │                                │
│            │  Sort: [Popularity ▼]          │
│  Price     │  24 products found             │
│  ─────     │                                │
│  Brand     │  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  ─────     │  │ P1 │ │ P2 │ │ P3 │ │ P4 │  │
│  Firmness  │  └────┘ └────┘ └────┘ └────┘  │
│  ─────     │  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  Size      │  │ P5 │ │ P6 │ │ P7 │ │ P8 │  │
│  ─────     │  └────┘ └────┘ └────┘ └────┘  │
│  Material  │                                │
│  ─────     │  [Load More] / Pagination      │
│  Color     │                                │
└────────────┴────────────────────────────────┘

Mobile: Filter as bottom sheet drawer
```

---

### 23.4 Product Detail Page Layout

```
┌─────────────────────────────────────────────┐
│  BREADCRUMB                                 │
├───────────────────┬─────────────────────────┤
│  IMAGE GALLERY    │  PRODUCT INFO           │
│                   │                         │
│  Main image       │  Brand name (link)      │
│  [large]          │  Product name H1        │
│                   │  Short description      │
│  Thumbnails row   │  ─────────────────────  │
│                   │  Rating: ★★★★☆ (42)     │
│                   │  ─────────────────────  │
│                   │  VARIATION SELECTORS    │
│                   │  Size: [90] [120] [180] │
│                   │  Firmness: ○S ●M ○F     │
│                   │  ─────────────────────  │
│                   │  PRICE: AED 1,850       │
│                   │  ~~AED 2,200~~ (sale)   │
│                   │  ─────────────────────  │
│                   │  [ Add to Cart ]        │
│                   │  [ Request Quotation ]  │
│                   │  [WhatsApp Inquiry]     │
│                   │  ─────────────────────  │
│                   │  ✓ Free delivery > 500 │
│                   │  ✓ 10-year warranty     │
│                   │  ✓ 30-day returns       │
├───────────────────┴─────────────────────────┤
│  TABS: Description | Specs | Reviews        │
│  [Description tab content]                  │
├─────────────────────────────────────────────┤
│  PRODUCT ATTRIBUTES TABLE                   │
│  Material: Memory Foam + Pocket Spring      │
│  Height: 30cm                               │
│  Certifications: CertiPUR-US                │
├─────────────────────────────────────────────┤
│  CUSTOMER REVIEWS                           │
│  Aggregate + individual review cards        │
│  Write a review form                        │
├─────────────────────────────────────────────┤
│  RELATED PRODUCTS (same category/collection)│
└─────────────────────────────────────────────┘
```

---

### 23.5 Cart Layout

```
┌─────────────────────────────────────┐
│  CART DRAWER (slide-in from right)  │
│  ─────────────────────────────────  │
│  [Product image] Name               │
│  Variation: 180x200 / Medium        │
│  Qty: [−] 1 [+]      AED 1,850      │
│  [Remove]                           │
│  ─────────────────────────────────  │
│  Subtotal: AED 1,850                │
│  Delivery: Free                     │
│  ─────────────────────────────────  │
│  Total: AED 1,850                   │
│  [ Proceed to Checkout ]            │
│  [ Request Quotation Instead ]      │
└─────────────────────────────────────┘
```

---

### 23.6 Checkout Layout

```
Step 1: Contact details
Step 2: Delivery address (Emirate selector)
Step 3: Delivery method
Step 4: Payment method
Step 5: Order summary + Confirm
```

- Single-page or step-by-step — configurable
- Guest checkout supported
- UAE phone number validation
- Emirate dropdown (Abu Dhabi, Dubai, Sharjah, etc.)

---

### 23.7 Quotation Page Layout

```
┌─────────────────────────────────────────────┐
│  REQUEST A QUOTATION                        │
│  For: {product name + variation} (editable) │
│                                             │
│  First Name*  Last Name*                    │
│  Email*        Phone*                       │
│  WhatsApp      Company                      │
│  Country       City/Emirate                 │
│  Quantity                                   │
│  Notes (textarea)                           │
│                                             │
│  [ Submit Request ]                         │
│                                             │
│  "We respond within 2 hours on WhatsApp"   │
└─────────────────────────────────────────────┘
```

---

### 23.8 Header Architecture

```
Desktop:
[Logo]  [Mattresses] [Beds] [Furniture] [Accessories] [Sale]  [AR|EN]  [🔍] [Cart(3)]

Mobile:
[≡ Menu]  [Logo]  [🔍] [Cart(3)]

Mobile Nav (drawer):
- Category links
- Brand directory
- Collections
- Contact / WhatsApp
- Language switch
```

### 23.9 Footer Architecture

```
Column 1: Logo + tagline + social icons
Column 2: Products (category links)
Column 3: Information (about, blog, FAQ, contact)
Column 4: Customer service (delivery, returns, warranty)

Bottom bar:
Payment icons | © 2026 Modern Mattresses | Privacy | Terms
```

---

## 24. DEVELOPMENT PHASES

### Phase 1 — Foundation (Weeks 1–4)

**Backend:**
- Laravel project setup, environment configuration
- Database migrations for all core tables
- Authentication system (Sanctum + JWT)
- Role/permission system setup
- Core models with relationships and scopes
- Base API resource structure
- Media upload service + object storage integration
- Queue and Redis configuration

**Frontend:**
- Next.js project setup with TypeScript, TailwindCSS, Shadcn UI
- i18n setup (next-intl), AR/EN routing
- RTL/LTR layout system
- Base design system (typography, colors, spacing)
- API client setup (Axios + React Query)
- State management setup (Zustand)
- Header, footer, navigation components

**Deliverable:** Empty but fully configured platform scaffold, all ENV variables documented

---

### Phase 2 — Product Engine (Weeks 5–8)

**Backend:**
- Product CRUD API (simple + variable)
- Category/Brand/Collection CRUD API
- Attribute engine — groups + options API
- Variation engine — matrix builder, variation CRUD
- Product attributes linking
- Image management with CDN
- Admin product APIs (full)
- Redis caching for product endpoints

**Frontend:**
- Product card component
- Product grid with pagination
- Product detail page
- Variation selector (attribute-driven)
- Image gallery with zoom
- Category and brand pages
- Product skeleton loading states

**Deliverable:** Fully working product catalog — browse, filter by category, view product details, select variations

---

### Phase 3 — Filter, Search & Commerce (Weeks 9–12)

**Backend:**
- Dynamic filter engine
- Full-text search endpoint
- Cart service (Redis-based session cart)
- Checkout flow (guest + auth)
- Payment gateway integration (Telr/Stripe)
- Order creation and management
- Quotation engine (form submission → admin pipeline)
- Order/Quotation email notifications
- PDF quotation generation

**Frontend:**
- Filter sidebar + mobile bottom sheet
- Active filter chips
- Sort dropdown
- Search page with autocomplete
- Cart drawer
- Checkout flow (multi-step)
- Quotation form
- Order confirmation page
- Account: orders + quotations pages

**Deliverable:** Complete commerce flow — browse → filter → search → cart → checkout → order + quotation workflow

---

### Phase 4 — Admin Panel (Weeks 13–16)

**Backend:**
- Full admin API for all modules
- Analytics aggregation queries
- Homepage builder API
- CMS APIs (pages, blog, FAQ)
- SEO management APIs
- User and role management APIs
- Activity logging

**Frontend (Admin SPA):**
- Admin layout with sidebar navigation
- Dashboard overview page
- Product manager (CRUD, image upload, variation matrix)
- Category/Brand/Collection managers
- Attribute group and option manager
- Order manager with status updates
- Quotation pipeline (Kanban)
- Customer manager
- Homepage builder (drag/drop sections)
- CMS editors (pages, blog, FAQ)
- User and role manager
- System settings

**Deliverable:** Fully operational admin panel — business can manage catalog, orders, leads, content independently

---

### Phase 5 — SEO, Performance, AI (Weeks 17–20)

**Backend:**
- Structured data generation per page type
- Sitemap generation command and endpoint
- SEO field management APIs
- AI chat service (OpenAI integration)
- AI training document manager
- AI conversation storage and lead extraction
- WhatsApp deeplink configuration
- Rate limiting review and tuning
- Caching audit and optimization

**Frontend:**
- Full meta tag implementation (next/head per page type)
- Structured data JSON-LD injection
- hreflang alternate tags
- Open Graph tags
- AI chat widget (floating, collapsible)
- WhatsApp floating button
- Lighthouse audit and optimization pass
- Image loading optimization audit

**Deliverable:** SEO-ready platform with 90+ Lighthouse scores, functional AI chatbot

---

### Phase 6 — QA, Security, Launch (Weeks 21–24)

- Full security audit (OWASP checklist)
- Penetration testing on API endpoints
- Load testing (k6 or Artillery — target 500 concurrent users)
- Cross-browser + cross-device testing
- Arabic content QA (RTL layout review, translation review)
- Accessibility audit (WCAG 2.1 AA compliance)
- Staging environment smoke tests
- Production infrastructure setup (Nginx, PHP-FPM, Supervisor, Redis)
- Cloudflare configuration (WAF, CDN, DNS)
- SSL configuration
- Backup system verification
- Monitoring setup (UptimeRobot + Laravel Telescope + error tracking)
- Soft launch (limited traffic)
- Full launch

---

## 25. MVP SCOPE

### 25.1 MVP Includes (Must-Have for Launch)

| Module | Scope |
|---|---|
| Product catalog | Full — all categories, attributes, variations |
| Category pages | Full with filters |
| Brand pages | Full |
| Collection pages | Full |
| Product detail page | Full |
| Cart | Full |
| Checkout | Guest + account, UAE delivery |
| Payment | 1 gateway minimum (Telr or Stripe) |
| Quotation system | Full — form, admin pipeline, WhatsApp deeplink |
| Admin panel | Full — products, orders, quotations, customers |
| CMS | Pages + FAQ (blog is optional for MVP) |
| Homepage builder | Full |
| Arabic + English | Full bilingual |
| RTL layout | Full |
| SEO | Meta tags, structured data, sitemap |
| AI Chatbot | Basic version — FAQ + product rec + lead capture |
| WhatsApp deeplinks | Full |
| Media management | Full |
| User accounts | Registration, login, orders view |
| Performance | 90+ Lighthouse target |
| Security | Full security architecture as specified |

---

### 25.2 MVP Excludes (Post-Launch Roadmap)

| Feature | Reason Deferred |
|---|---|
| WhatsApp Business API | Requires Meta business verification (4-6 weeks process) |
| Advanced AI RAG | Requires training data collection post-launch |
| Blog/Editorial content | Low revenue impact for MVP |
| Product comparison | Nice-to-have — Phase 2 |
| Wishlist | Nice-to-have — Phase 2 |
| Loyalty program | Phase 2 |
| B2B customer portal | Phase 2 |
| Multi-vendor | Horizon 2 |
| Mobile app | Horizon 2 |
| Abandoned cart recovery | Phase 2 |
| Coupon/discount system | Phase 2 — configurable in DB but UI deferred |

---

## 26. FUTURE EXPANSION ROADMAP

### Horizon 2A — Platform Growth (Months 7–12)

| Feature | Description |
|---|---|
| WhatsApp Business API | Full automated messaging, template broadcasts |
| Advanced AI | RAG with product embeddings, order lookup, warranty claims |
| Product comparison | Full comparison table across attributes |
| Wishlist | Save products, share wishlists |
| Loyalty rewards | Points system per purchase |
| Coupon system | Percentage, fixed, free-shipping, first-order coupons |
| Abandoned cart recovery | Email + WhatsApp reminders |
| Reviews enhancement | Photo reviews, verified purchase badge |
| Live chat escalation | AI → human handoff via live chat widget |
| B2B portal | Custom pricing tiers, bulk order dashboard |
| Multi-currency | USD, SAR, KWD alongside AED |
| Advanced analytics | Funnel analysis, heatmaps integration |
| Blog & content | Full editorial blog for sleep SEO content |

---

### Horizon 2B — Multi-Brand (Months 12–18)

| Feature | Description |
|---|---|
| Tenant system activation | Full multi-brand support under same platform |
| Brand portals | Each brand manages own catalog via scoped admin |
| Cross-brand homepage | Platform-level homepage featuring multiple brands |
| Brand-specific domains | Each brand can have own subdomain |
| Unified search | Search across all brands |
| Brand analytics | Each brand sees only their data |
| Commission tracking | Platform fee per brand |

---

### Horizon 2C — Multi-Vendor Marketplace (Months 18–30)

| Feature | Description |
|---|---|
| Vendor registration | Self-serve vendor onboarding with approval workflow |
| Vendor portal | Full catalog management, order management, payouts |
| Commission engine | Configurable % per category/vendor |
| Payout system | Automated vendor payout reports |
| Product moderation | Admin approval for new vendor products |
| Vendor reviews | Separate vendor rating system |
| Dispute management | Order dispute workflow |
| Vendor analytics | Revenue, conversion, return rate dashboards |

---

### Horizon 3 — Mobile & Ecosystem (Months 24+)

| Feature | Description |
|---|---|
| React Native mobile app | iOS + Android app using same API |
| Push notifications | Order updates, promotions, back-in-stock |
| Augmented reality | Virtual room placement for beds/furniture |
| AI personalization | Personalized product recommendations per session |
| Sleep quiz | Interactive product recommendation tool |
| Subscription service | Pillow/bedding replacement subscriptions |
| API marketplace | Open API for partner integrations |
| Regional expansion | Saudi Arabia, Kuwait, Qatar storefronts |

---

## APPENDIX A — Technology Versions

| Technology | Version |
|---|---|
| PHP | 8.4.x |
| Laravel | 12.x |
| MySQL | 8.0.x |
| Redis | 7.x |
| Node.js | 22 LTS |
| React | 18.x |
| Next.js | 15.x |
| TypeScript | 5.x |
| TailwindCSS | v4.x |
| Shadcn UI | Latest |

---

## APPENDIX B — Infrastructure Specification

| Component | Specification |
|---|---|
| VPS (Primary) | 8 vCPU, 16GB RAM, 200GB NVMe SSD |
| VPS (Staging) | 4 vCPU, 8GB RAM |
| OS | Ubuntu 24.04 LTS |
| Web server | Nginx 1.26 |
| PHP process manager | PHP-FPM |
| SSL | Let's Encrypt via Cloudflare |
| Object storage | Cloudflare R2 or DigitalOcean Spaces (S3-compatible) |
| CDN | Cloudflare |
| Email delivery | Resend or Mailgun |
| Process management | Supervisor (queue workers, scheduler) |
| Monitoring | UptimeRobot + Laravel Pulse |
| Log management | Laravel Telescope (staging/dev), Sentry (production errors) |

---

## APPENDIX C — Naming Conventions

| Element | Convention | Example |
|---|---|---|
| PHP classes | PascalCase | `ProductVariationService` |
| PHP methods | camelCase | `getActiveProducts()` |
| Database tables | snake_case plural | `product_variations` |
| Database columns | snake_case | `base_price`, `slug_ar` |
| API routes | kebab-case | `/api/v1/product-variations` |
| React components | PascalCase | `VariationSelector.tsx` |
| React hooks | camelCase with `use` prefix | `useVariationPrice` |
| Zustand stores | camelCase + `Store` suffix | `cartStore` |
| CSS classes | TailwindCSS utilities only | No custom class names |
| Git branches | `feature/`, `fix/`, `hotfix/` | `feature/variation-engine` |
| Environment vars | SCREAMING_SNAKE_CASE | `REDIS_HOST`, `OPENAI_API_KEY` |

---

## APPENDIX D — Definition of Done (DoD)

A feature is considered **Done** when:

- [ ] API endpoint returns correct data with proper HTTP status codes
- [ ] API endpoint is covered by Feature Test (Laravel)
- [ ] All database queries use indexes (verified via EXPLAIN)
- [ ] No N+1 queries (verified via Laravel Debugbar)
- [ ] Redis caching implemented and tested
- [ ] React component renders in both English (LTR) and Arabic (RTL)
- [ ] Mobile responsive (tested at 375px, 768px, 1280px breakpoints)
- [ ] Lighthouse score does not drop below 90 after implementation
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] Security: no raw SQL, no unescaped user input, no exposed secrets
- [ ] Admin-facing feature has role permission protection
- [ ] Reviewed and approved by lead architect

---

*Document version: 1.0*
*Prepared for: Modern Mattresses Platform Engineering Team*
*Next review date: Before Phase 2 kickoff*
*Owner: CTO / Lead Architect*
