# Rolodex System — Contacts & Relationships

**Created:** October 5, 2025  
**Status:** Planning Document

---

## Mission

Create a unified contact management system ("Rolodex") that serves as the single source of truth for all people and organizations in the ecosystem—internal team members, external clients, vendors, contractors, potential leads, and any other stakeholder. This system powers relationship-driven features across orders, items, messaging, permissions, and reporting.

---

## Core Philosophy

- **Universal Directory**: Every person and organization the business interacts with lives here
- **Relationship-Centric**: Contacts aren't just names—they have roles, tags, history, and connection strength
- **Context-Aware**: Different contact types (client, vendor, employee) have different attributes but share core structure
- **Integration Hub**: Rolodex feeds data to orders, items, messages, teams, and permissions
- **Privacy-Conscious**: Respect data boundaries (internal vs. external visibility, GDPR compliance)

---

## Terminology

**Why "Rolodex"?**  
The term evokes a classic business tool—a rotating file of contact cards. It's friendly, memorable, and communicates the purpose instantly. Alternative names considered: "Contacts", "Directory", "People", "Network". We chose Rolodex for its character.

**What It Includes:**
- **Internal Contacts**: Employees, contractors, team members
- **External Clients**: Customers, buyers, brands who order from you
- **Vendors/Suppliers**: Material suppliers, service providers, subcontractors
- **Prospects**: Potential clients, leads, inbound inquiries
- **Partners**: Strategic partners, collaborators, consultants
- **Other**: Any person or organization worth tracking

---

## Page Structure

### Location
- **Route:** `/app/rolodex/page.tsx`
- **Navigation:** Sidebar entry "Rolodex" or "Contacts" (icon: 👥 or 📇)
- **Entry Points:**
  - Direct navigation from sidebar
  - Quick search/add from order creation flow
  - Links from orders page (click client/contact name)
  - Team management pages

### Layout Pattern

```
┌───────────────────────────────────────────────────────────────┐
│  Header: Rolodex • Your business relationships                │
│  [Add Contact] [Import CSV] [Search...]  [Filter] [Export]    │
├───────────────────────────────────────────────────────────────┤
│  Tabs: [All] [Clients] [Vendors] [Internal] [Prospects]      │
│        [Partners] [Archived]                                   │
├───────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Dynamic Contacts Table (scrollable, sortable)         │  │
│  │  - Avatar/Logo                                          │  │
│  │  - Name & Organization                                  │  │
│  │  - Type/Role tags                                       │  │
│  │  - Email, Phone                                         │  │
│  │  - Relationship strength                                │  │
│  │  - Active orders/projects                               │  │
│  │  - Last contact date                                    │  │
│  │  - Actions (view, message, edit, archive)              │  │
│  └─────────────────────────────────────────────────────────┘  │
│  Footer: Showing X contacts • Quick stats                     │
└───────────────────────────────────────────────────────────────┘
```

---

## Tab System

### All
- Default view, shows all active contacts
- Quick filters by type, tags, relationship strength

### Clients
- Organizations or individuals who place orders
- Shows: Active orders, total order value, payment status
- Can filter by: Active vs. inactive, region, industry

### Vendors
- Suppliers, subcontractors, service providers
- Shows: Active POs, reliability rating, lead times
- Can filter by: Material type, location, performance tier

### Internal
- Employees, team members, contractors
- Shows: Team assignment, role, permissions, active tasks
- Can filter by: Team, role, department, employment status

### Prospects
- Potential clients, leads not yet converted
- Shows: Lead source, interest level, last touchpoint
- Can filter by: Lead stage, priority, assigned sales rep

### Partners
- Strategic partners, collaborators, consultants
- Shows: Partnership type, shared projects, agreement status

### Archived
- Contacts no longer active
- Keeps historical data for reporting
- Can be restored if needed

---

## Data Model

### Contact Entity (Core Schema)

```typescript
type Contact = {
  id: string                     // "CNT-2025-001"
  
  // Basic Identity
  type: ContactType
  name: string                   // Full name or org name
  displayName?: string           // Preferred name (nickname, brand name)
  avatar?: string                // Avatar URL (person) or logo URL (org)
  
  // Organization (if applicable)
  organization?: string          // Company/org name
  title?: string                 // Job title (for individuals in an org)
  
  // Contact Info
  email: string
  phone?: string
  alternateEmail?: string
  alternatePhone?: string
  website?: string
  
  // Address
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  
  // Categorization
  tags: string[]                 // Custom tags (e.g., "VIP", "Net 30", "Denim Expert")
  category: ContactCategory      // Primary category
  subCategories?: string[]       // Additional categories
  
  // Relationship
  relationshipStrength: RelationshipStrength
  relationshipType: RelationType
  assignedTo?: string            // Internal owner (sales rep, account manager)
  
  // Context (varies by type)
  clientInfo?: ClientInfo
  vendorInfo?: VendorInfo
  internalInfo?: InternalInfo
  prospectInfo?: ProspectInfo
  partnerInfo?: PartnerInfo
  
  // Activity & History
  lastContactDate?: string
  lastOrderDate?: string
  notes: Note[]
  attachments: Attachment[]
  activityLog: ActivityEntry[]
  
  // Metadata
  source: string                 // How they were added (manual, import, lead form, etc.)
  createdAt: string
  updatedAt: string
  archivedAt?: string
  createdBy: string
}

type ContactType = 
  | "Individual"      // A single person
  | "Organization"    // A company/org (can have multiple person contacts)

type ContactCategory = 
  | "Client"
  | "Vendor"
  | "Internal"
  | "Prospect"
  | "Partner"
  | "Other"

type RelationshipStrength = 
  | "Strong"          // Regular, trusted relationship
  | "Moderate"        // Occasional interaction
  | "Weak"            // Minimal interaction, new contact
  | "Unknown"         // Not yet established

type RelationType = 
  | "Customer"        // Buys from you
  | "Supplier"        // Sells to you
  | "Employee"        // Works for you
  | "Contractor"      // Works for you (temp/project-based)
  | "Lead"            // Potential customer
  | "Partner"         // Strategic collaboration
  | "Service Provider"// Provides services (legal, accounting, etc.)
  | "Other"
```

### Client-Specific Info

```typescript
type ClientInfo = {
  // Business Context
  industry?: string              // Fashion, Construction, Defense, etc.
  vertical?: string              // Menswear, Residential, Aerospace
  region?: string                // Geographic market
  companySize?: "Small" | "Medium" | "Large" | "Enterprise"
  
  // Ordering Behavior
  totalOrders: number            // Lifetime order count
  totalValue: number             // Lifetime revenue ($)
  averageOrderValue: number      // AOV
  lastOrderDate?: string
  nextExpectedOrder?: string     // Forecasted next order
  
  // Terms & Agreements
  paymentTerms?: string          // Net 30, Net 60, COD, etc.
  creditLimit?: number
  pricingTier?: string           // Standard, Volume, Premium
  contractStart?: string
  contractEnd?: string
  
  // Communication Preferences
  preferredChannel: NotificationChannel[]  // Email, SMS, Phone, In-app
  preferredLanguage?: string
  timezone?: string
  
  // Portal Access
  hasPortalAccess: boolean       // Can they log into client portal?
  portalUserId?: string
  portalLastLogin?: string
  
  // Reporting
  satisfactionScore?: number     // 1-10, NPS-style
  churnRisk?: "Low" | "Medium" | "High"
}
```

### Vendor-Specific Info

```typescript
type VendorInfo = {
  // Supplier Context
  supplierType: string[]         // Materials, Services, Equipment, etc.
  materialsSupplied: string[]    // Denim, Hardware, Zippers, etc.
  certifications: string[]       // ISO, Fair Trade, Organic, etc.
  
  // Performance
  reliabilityRating: number      // 1-5 stars
  qualityRating: number          // 1-5 stars
  averageLeadTime: number        // Days
  onTimeDeliveryRate: number     // Percentage
  
  // Terms
  paymentTerms?: string
  minimumOrder?: number
  volumeDiscount?: boolean
  
  // Orders
  totalPurchaseOrders: number
  totalSpend: number
  lastOrderDate?: string
  
  // Location
  manufacturingLocation?: string
  shippingLocations: string[]
}
```

### Internal Contact Info

```typescript
type InternalInfo = {
  // Employment
  employeeId?: string
  department?: string
  role: string                   // Production Manager, QC Inspector, etc.
  team?: string                  // Team assignment (links to teams system)
  
  // Status
  employmentStatus: "Full-time" | "Part-time" | "Contractor" | "Intern" | "Inactive"
  startDate: string
  endDate?: string
  
  // Permissions
  systemRole: SystemRole         // Admin, Manager, Operator, Viewer
  permissions: Permission[]
  
  // Skills & Certifications
  skills: string[]               // Sewing, CAD, QC, etc.
  certifications: string[]       // Safety, Quality, Equipment
  
  // Performance
  tasksCompleted: number
  activeAssignments: number
  performanceRating?: number     // Manager assessment
}

type SystemRole = 
  | "Admin"          // Full system access
  | "Manager"        // Team/department management
  | "Operator"       // Production floor access
  | "Viewer"         // Read-only access
  | "Client"         // External client portal access

type Permission = {
  resource: string               // "orders", "items", "reports", etc.
  actions: ("create" | "read" | "update" | "delete")[]
}
```

### Prospect-Specific Info

```typescript
type ProspectInfo = {
  // Lead Tracking
  leadSource: string             // Website, Referral, Trade Show, Cold Outreach, etc.
  leadStage: LeadStage
  priority: "Low" | "Medium" | "High" | "Urgent"
  
  // Interest
  interestedIn: string[]         // Product types, services
  estimatedOrderValue?: number
  expectedCloseDate?: string
  
  // Qualification
  budgetConfirmed: boolean
  authorityConfirmed: boolean    // Is this the decision maker?
  needConfirmed: boolean
  timelineConfirmed: boolean
  
  // Sales
  assignedSalesRep?: string
  lastTouchDate?: string
  nextFollowUpDate?: string
  
  // Conversion
  convertedToClient: boolean
  convertedAt?: string
  lostReason?: string            // If lead didn't convert
}

type LeadStage = 
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiating"
  | "Won"
  | "Lost"
```

### Partner-Specific Info

```typescript
type PartnerInfo = {
  partnershipType: string        // Strategic, Referral, Technology, Distribution, etc.
  partnershipStart: string
  partnershipEnd?: string
  
  agreementType?: string         // NDA, MOU, Contract, etc.
  agreementUrl?: string          // Link to contract document
  
  sharedProjects: string[]       // Project IDs
  referralsGiven: number
  referralsReceived: number
  
  contactPerson?: string         // Main point of contact at partner org
}
```

---

## Key Interactions

### Adding a Contact

**Manual Entry:**
- Click "Add Contact" button
- Modal/drawer opens with form:
  - Type: Individual or Organization
  - Category: Client, Vendor, Internal, etc.
  - Basic info: Name, email, phone
  - Extended fields based on category
- Save → Contact appears in appropriate tab

**Quick Add (From Order Flow):**
- User types client name in order creation
- If not found, "Create New Client" button appears
- Mini-form captures essentials (name, email, type)
- Saves contact, continues with order creation
- User can fill in details later

**Import CSV:**
- Upload CSV file with contact list
- Map columns to fields (name, email, phone, etc.)
- Review & confirm import
- Bulk create contacts

### Viewing a Contact

**Contact Detail Page:**  
Route: `/app/rolodex/[contactId]/page.tsx`

```
┌────────────────────────────────────────────────┐
│ Avatar/Logo  Name                              │
│             Organization • Role • Tags         │
│ [Edit] [Message] [Archive] [Export]           │
├────────────────────────────────────────────────┤
│ Tabs:                                          │
│ - Overview: Summary, contact info, notes       │
│ - Orders: All orders involving this contact    │
│ - Activity: Timeline of interactions           │
│ - Files: Attachments, contracts, specs         │
│ - Messages: Communication history              │
│ - Analytics: (For clients) order trends        │
└────────────────────────────────────────────────┘
```

**Overview Tab:**
- Contact info card (editable inline)
- Relationship strength indicator
- Tags (add/remove)
- Quick notes section
- Related contacts (if part of an org)

**Orders Tab:**
- Table of all orders this contact is involved in
- Same table structure as main orders page
- Filter by status, date, etc.

**Activity Tab:**
- Timeline of all interactions:
  - Orders placed
  - Messages sent/received
  - Meetings/calls logged
  - Files uploaded
  - Notes added
- Shows who did what and when

### Editing a Contact

- Click "Edit" button on contact detail page or table row
- Modal/drawer with form (pre-populated)
- Update fields
- Save → Changes logged in activity history

### Archiving a Contact

- Click "Archive" action
- Confirmation modal (explain impact: won't appear in search, dropdowns)
- Archived contacts move to "Archived" tab
- Can be restored if needed
- Historical data (orders, messages) remains intact

### Linking Contacts to Orders

**During Order Creation:**
- "Client" field searches Rolodex
- "Contacts" field multi-selects stakeholders from Rolodex
- "Owner" field selects internal contact
- All selections create relationships

**From Orders Page:**
- Click client name → Opens Rolodex entry
- Click contact chip → Opens Rolodex entry

**From Rolodex:**
- View contact → See all related orders
- Click order → Navigate to order detail page

---

## Table Structure (Main Rolodex Page)

### Core Columns

**Avatar/Logo**  
- Profile picture for individuals
- Company logo for organizations
- Placeholder icon if none

**Name**  
- Primary name (bold)
- Organization (secondary, if applicable)
- Click to open detail page

**Type & Category**  
- Badge: Client, Vendor, Internal, etc.
- Additional tags (VIP, Net 30, etc.)

**Contact Info**  
- Email (click to compose message)
- Phone (click to call, if supported)

**Relationship**  
- Strength indicator (Strong, Moderate, Weak)
- Visual (stars, dots, color-coded)

**Activity**  
- Last contact date
- Active orders/projects count
- Quick snapshot of engagement

**Actions**  
- 👁️ View: Open detail page
- ✉️ Message: Send notification
- ✏️ Edit: Update contact info
- 🗄️ Archive: Move to archived

### Extended Columns (Horizontal Scroll)

- **Client-Specific**: Total orders, total value, payment terms
- **Vendor-Specific**: Reliability rating, materials supplied
- **Internal-Specific**: Department, role, team
- **Custom Fields**: User-defined attributes

---

## Search & Filters

### Search
- Fuzzy search across: Name, email, phone, organization, tags
- Real-time results as you type
- Highlight matching text

### Quick Filters
- **Category**: Client, Vendor, Internal, Prospect, Partner
- **Relationship Strength**: Strong, Moderate, Weak
- **Tags**: Multi-select custom tags
- **Status**: Active, Archived

### Advanced Filters (Modal)
- Date ranges (created, last contact, last order)
- Order value ranges (for clients)
- Lead stage (for prospects)
- Department/team (for internal)
- Custom attribute queries

---

## Integration with Other Systems

### Orders System
- Orders reference contacts for:
  - Client (primary customer)
  - Owner (internal)
  - Stakeholders (notification recipients)
- Rolodex feeds dropdowns in order creation
- Clicking contact in orders page opens Rolodex detail

### Items System
- Items can reference internal contacts for:
  - Assigned owner
  - QC inspector
  - Team lead

### Teams System
- Internal contacts link to team entities
- Team pages show team members (from Rolodex)

### Messages/Notifications
- Messaging system uses Rolodex for recipient selection
- Tracks message history per contact

### Permissions & Access Control
- Internal contacts have system roles & permissions
- Client contacts can have portal access

### Reporting & Analytics
- Client analytics: order trends, revenue by client
- Vendor analytics: performance ratings, lead times
- Sales analytics: prospect conversion rates

---

## Relationship Mapping (Future Enhancement)

**Organizational Hierarchies:**
- Link individual contacts to organizations
- Example: Jane Doe (Buyer) works at Acme Corp (Client)
- View org page → See all related individuals

**Contact Networks:**
- Map referrals (who referred whom)
- Visualize connections (graph view)
- Identify key connectors

---

## Privacy & Compliance

### Data Protection
- GDPR compliance: Right to access, right to be forgotten
- "Export My Data" feature for contacts
- "Delete Contact" permanently removes PII (with audit log)

### Visibility Rules
- External contacts can't see other contacts (unless shared project)
- Internal contacts see based on role permissions
- Admin can set visibility scope per contact

### Consent Tracking
- Track consent for communications (email, SMS)
- Opt-in/opt-out management
- Unsubscribe links in automated messages

---

## Import/Export

### Import Formats
- CSV (with column mapping)
- vCard (standard contact format)
- Integrations: Google Contacts, Outlook, HubSpot, Salesforce

### Export Formats
- CSV (full contact list or filtered)
- vCard (for import into other systems)
- PDF (formatted contact directory)

### Bulk Operations
- Bulk tag assignment
- Bulk archive
- Bulk message (send to all selected contacts)

---

## UI Implementation Notes

### Component Reusability

**New Components:**
- `RolodexTable`: Main contact table
- `ContactCard`: Summary card for detail page
- `ContactForm`: Add/edit modal
- `ContactAvatar`: Avatar with fallback initials
- `RelationshipStrengthIndicator`: Visual widget
- `ActivityTimeline`: Shows contact history
- `ContactPicker`: Searchable multi-select for forms

### Visual Design

**Avatar Styles:**
- Circular for individuals
- Rounded square for organizations
- Fallback to initials (colored by name hash)

**Relationship Strength:**
- Strong: 🟢 or ★★★
- Moderate: 🟡 or ★★☆
- Weak: 🟠 or ★☆☆
- Unknown: ⚪ or ☆☆☆

**Category Badges:**
- Client: `bg-blue-100 text-blue-800`
- Vendor: `bg-purple-100 text-purple-800`
- Internal: `bg-green-100 text-green-800`
- Prospect: `bg-yellow-100 text-yellow-800`
- Partner: `bg-pink-100 text-pink-800`

---

## Mobile Experience

**Responsive Layout:**
- Desktop: Full table view
- Tablet: Card grid (2 columns)
- Mobile: Stacked cards (1 column)

**Mobile Actions:**
- Swipe card to reveal actions (message, call, view)
- Tap-to-call phone numbers
- Tap-to-email addresses
- Pull-to-refresh

---

## Analytics & Insights

### Rolodex Dashboard (Future)
- Total contacts by category
- Relationship strength distribution
- Activity trends (new contacts/month, last contact age)
- Client lifetime value (CLV)
- Vendor performance scores
- Internal team composition

---

## Future Enhancements

**Phase 2 Features:**
- Contact merge (de-duplicate)
- Auto-enrichment (pull company data from APIs like Clearbit)
- Smart suggestions (recommend next action based on activity)
- Email sync (import email threads as activity)
- Calendar integration (log meetings automatically)
- Social media links (LinkedIn, Twitter)

**AI/Automation:**
- Predict churn risk for clients
- Suggest follow-up timing for prospects
- Auto-tag contacts based on behavior
- Sentiment analysis of message history

---

## Implementation Checklist

### Backend/Data
- [ ] Define Contact entity schema
- [ ] Create contacts table/collection
- [ ] Implement CRUD functions (create, read, update, delete)
- [ ] Add search/filter queries
- [ ] Set up relationships with Orders, Teams, Messages

### Frontend Components
- [ ] Create `/app/rolodex/page.tsx` main page
- [ ] Build `RolodexTable` component
- [ ] Build `ContactForm` (add/edit modal)
- [ ] Build contact detail page (`/app/rolodex/[contactId]/page.tsx`)
- [ ] Build `ContactCard`, `ContactAvatar`, `ActivityTimeline`
- [ ] Implement search & filter UI

### Integration
- [ ] Update sidebar to show "Rolodex" link
- [ ] Link from Orders page (client/contact names → Rolodex)
- [ ] Add contact picker to order creation flow
- [ ] Connect with Teams system
- [ ] Connect with Messages system

### UX Polish
- [ ] Add loading states
- [ ] Add empty states ("No contacts yet")
- [ ] Add success toasts (contact added, updated, etc.)
- [ ] Add confirmation modals (archive, delete)
- [ ] Test responsive behavior
- [ ] Test accessibility

### Privacy & Compliance
- [ ] Implement consent tracking
- [ ] Add "Export My Data" feature
- [ ] Add "Delete Contact" with PII removal
- [ ] Set up visibility rules
- [ ] GDPR compliance review

### Testing
- [ ] Unit tests for contact CRUD
- [ ] Integration tests with Orders, Teams
- [ ] E2E tests for contact lifecycle
- [ ] Performance tests with large datasets

---

## Open Questions

1. **Organization vs. Individual**: Should organizations be first-class entities with sub-contacts, or just a field on individual contacts?
2. **Duplicate Detection**: How do we detect and merge duplicate contacts?
3. **Historical Data**: If a contact is deleted, what happens to their orders/activity?
4. **External API Integrations**: Which CRM/contact systems should we integrate with first (Salesforce, HubSpot, Google Contacts)?
5. **Social Features**: Should contacts be able to "connect" with each other (like LinkedIn)?

---

## Success Metrics

**How we'll know this is working:**
- Reduction in duplicate contact entries
- Faster contact lookup time (measure search speed)
- Increased order creation speed (fewer "add new client" steps)
- Higher message engagement (when using Rolodex contacts)
- User satisfaction with contact management features

---

*Document created October 5, 2025. This planning doc should be validated with stakeholders before implementation begins.*
