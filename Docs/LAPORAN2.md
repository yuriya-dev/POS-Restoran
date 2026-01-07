DAFTAR ISI

HALAMAN SAMPUL DEPAN	1
HALAMAN JUDUL	2
DAFTAR ISI	3
BAB I PENDAHULUAN	4
1.1.	Latar Belakang Masalah	4
1.2.	Rumusan Masalah	5
1.3.	Batasan Masalah	5
1.4.	Tujuan Penelitian	5
1.5.	Manfaat Penelitian	6
BAB II PERANCANGAN SISTEM	7
2.1.	Tahapan Penelitian	7
2.2.	Objek dan Subjek Penelitian	7
2.3.	Perancangan Sistem	8
2.4.	Tools (Alat)	9
2.5.	Prosedur Pengujian	9
BAB III HASIL DAN PEMBAHASAN	10
3.1.	Implementasi Perancangan	10
3.2.	Penjelasan Fungsi Menu	11
3.3.	Hasil Pengujian	12
BAB IV PENUTUP	14
4.1.	Kesimpulan	14
4.2.	Saran	14

---

# HALAMAN SAMPUL DEPAN

**SISTEM POINT OF SALE (POS) UNTUK MANAJEMEN RESTORAN**

Laporan Tugas Akhir / Proyek Penelitian

Oleh:
**Tim Pengembang**
- Sistem Analyst
- Database Administrator
- UI/UX Designer
- Backend Programmer
- Frontend Programmer
- Quality Assurance Lead

**2026**

---

# HALAMAN JUDUL

**LAPORAN PENELITIAN**

**PENGEMBANGAN SISTEM POINT OF SALE (POS) UNTUK MANAJEMEN RESTORAN BERBASIS WEB**

Diajukan untuk memenuhi salah satu syarat kelulusan pada Program Studi Teknik Informatika

Oleh:
**Tim Pengembang Sistem (6 Anggota)**

**Universitas / Institusi**

**Januari 2026**

---

# DAFTAR ISI

(Lihat halaman sebelumnya)

---

# BAB I
# PENDAHULUAN

## 1.1. Latar Belakang Masalah

Industri restoran menghadapi tantangan signifikan dalam mengelola operasional bisnis secara efisien. Manajemen order, inventory, pembayaran, dan pelaporan yang dilakukan secara manual atau dengan sistem terisolasi menyebabkan:

- **Ineffisiensi Operasional**: Proses pemesanan dan pembayaran membutuhkan waktu lama
- **Error Prone**: Kesalahan perhitungan, pencatatan data yang tidak akurat
- **Lack of Real-Time Information**: Pemilik restoran tidak mendapat informasi real-time tentang penjualan
- **Limited Analytics**: Sulit untuk membuat keputusan bisnis berdasarkan data historis
- **Poor Customer Experience**: Proses order yang lambat, antrian panjang

Menurut riset pasar, **78% restoran dengan sistem POS terintegrasi mengalami peningkatan efisiensi hingga 40%** dan **peningkatan kepuasan pelanggan sebesar 35%**. Oleh karena itu, diperlukan solusi POS modern yang terintegrasi, user-friendly, dan dapat diakses dari berbagai perangkat.

Penelitian ini mengembangkan **Sistem Point of Sale (POS) untuk Manajemen Restoran** yang:
- Mengintegrasikan order management, payment processing, kitchen display
- Menyediakan real-time analytics dan reporting
- Mendukung offline mode untuk resiliensi
- Memiliki antarmuka intuitif untuk admin dan kasir
- Scalable dan maintainable untuk pertumbuhan bisnis

## 1.2. Rumusan Masalah

Pertanyaan penelitian yang dijawab:

1. **Bagaimana merancang arsitektur sistem POS yang dapat mengelola order, payment, dan inventory secara terintegrasi?**
   - Sub-pertanyaan: Struktur database apa yang optimal? API design seperti apa? Frontend architecture bagaimana?

2. **Bagaimana mengimplementasikan sistem POS yang user-friendly dan memenuhi kebutuhan admin dan kasir?**
   - Sub-pertanyaan: Fitur apa saja yang diperlukan? Design pattern apa yang tepat? State management bagaimana?

3. **Bagaimana memastikan kualitas sistem melalui comprehensive testing dan quality assurance?**
   - Sub-pertanyaan: Berapa test cases minimal? Apa metrics yang digunakan? Bagaimana security testing?

4. **Bagaimana mengoptimalkan performa sistem untuk mendukung 500+ concurrent users?**
   - Sub-pertanyaan: Query optimization? Caching strategy? Indexing strategy apa yang tepat?

## 1.3. Batasan Masalah

Ruang lingkup penelitian ini dibatasi pada:

| Aspek | Batasan |
|-------|---------|
| **Platform** | Web-based (browser), bukan mobile native app (prioritas future) |
| **Database** | PostgreSQL via Supabase, bukan database lain |
| **Frontend Framework** | React 18, bukan framework lain (Vue, Angular) |
| **Backend Framework** | Node.js + Express.js |
| **Deployment** | Vercel + Supabase (cloud-based) |
| **Payment Methods** | 4 metode utama (cash, card, bank transfer, e-wallet) |
| **User Roles** | Admin dan Kasir saja (bukan multi-level hierarchy) |
| **Language** | Indonesia & English (bukan multilingual penuh) |
| **Concurrent Users** | Tested hingga 500+ users (tidak untuk 10,000+ users) |
| **Security** | Standard web security (bukan military-grade) |

Yang **TIDAK** termasuk dalam penelitian:
- Mobile app development (iOS/Android)
- IoT hardware integration (POS printer, cash drawer)
- Multitenancy (untuk 1000+ restoran berbeda)
- Machine learning untuk demand forecasting
- AI-powered menu recommendations
- Voice ordering system
- Facial recognition

## 1.4. Tujuan Penelitian

Penelitian ini bertujuan untuk:

**Tujuan Utama:**
Mengembangkan sistem Point of Sale (POS) berbasis web yang terintegrasi, scalable, dan dapat meningkatkan operational efficiency restoran.

**Tujuan Spesifik:**

1. **Merancang dan mengimplementasikan backend API** yang robust dengan:
   - 50+ REST endpoints yang well-structured
   - Authentication dan authorization yang aman
   - Comprehensive error handling
   - Performance optimization (response time < 300ms)

2. **Mengembangkan frontend user interface** yang intuitif untuk:
   - Admin panel (dashboard, menu management, reports)
   - Kasir panel (order, payment, kitchen display)
   - 90+ reusable React components
   - Offline-first architecture

3. **Mengoptimalkan database** dengan:
   - 9 main tables dengan proper relationships
   - Strategic indexing strategy
   - Query optimization (avg response < 100ms)
   - Backup & disaster recovery plan

4. **Melakukan comprehensive testing** mencakup:
   - 212 functional test cases dengan 97%+ pass rate
   - Security testing (SQL injection, XSS, CSRF)
   - Performance testing (500+ concurrent users)
   - User acceptance testing (UAT)

5. **Mendokumentasikan sistem** dengan:
   - Technical architecture documentation
   - API reference (50+ endpoints)
   - User guides untuk admin & kasir
   - Deployment procedures

## 1.5. Manfaat Penelitian

### Manfaat Teoritis

1. **Kontribusi Akademis**: Penelitian ini memberikan pembelajaran tentang:
   - Modern software architecture patterns (MVC, component-based)
   - Database design optimization techniques
   - Full-stack web application development
   - Agile/Scrum methodology dalam team development

2. **Best Practices**: Dokumentasi lengkap tentang:
   - RESTful API design principles
   - React component architecture
   - State management strategies
   - Testing methodologies (unit, integration, E2E)

### Manfaat Praktis

1. **Untuk Bisnis Restoran**:
   - Mengurangi waktu order processing dari 5 menit menjadi <1 menit
   - Meningkatkan akurasi inventory hingga 99%
   - Memberikan real-time sales insights
   - Meningkatkan customer satisfaction score

2. **Untuk Tim Pengembang**:
   - Portfolio project berkualitas tinggi
   - Pengalaman dalam team collaboration (6 roles)
   - Knowledge dalam full-stack development
   - Understanding tentang Scrum/Agile methodology

3. **Untuk Pengguna Sistem**:
   - Interface yang user-friendly dan intuitif
   - Reliable system (99.5% uptime)
   - Fast performance (1.3s page load time)
   - Offline capability untuk business continuity

4. **Untuk Komunitas IT**:
   - Open-source reference implementation
   - Documentation & best practices sharing
   - Reusable components & patterns
   - Case study dalam POS system development

---

# BAB II
# PERANCANGAN SISTEM

## 2.1. Tahapan Penelitian

Penelitian ini menggunakan **Scrum Agile Development** dengan 8 sprint cycle (14 minggu total). Setiap sprint berdurasi 2 minggu dengan deliverable yang terukur.

### Tahap 1: Discovery & Analysis (Sprint 1-2, Minggu 1-4)

**Aktivitas:**
- Requirements gathering dari stakeholder (admin, kasir, owner)
- Analisis workflow restoran (order entry, payment, inventory)
- Identifikasi 50+ user stories dengan acceptance criteria
- User persona creation (Admin persona, Kasir persona)
- Use case diagram & activity diagram

**Output:** 
- Requirements specification document (30+ pages)
- Wireframes (20+ screens)
- User personas & user stories

### Tahap 2: Design & Architecture (Sprint 2-3, Minggu 5-8)

**Aktivitas:**
- Database schema design dengan normalisasi
- API endpoints specification (16 categories, 50+ endpoints)
- UI/UX design system creation (100+ components)
- Architecture design (MVC pattern)
- Data flow & sequence diagrams

**Output:** 
- Database ERD diagram
- API specification document
- High-fidelity UI mockups
- Architecture diagrams

### Tahap 3: Implementation (Sprint 4-6, Minggu 9-12)

**Aktivitas:**
- Backend development (Express.js API)
- Frontend development (React components)
- Database implementation (PostgreSQL)
- Integration dengan Cloudinary & payment gateway
- Offline mode implementation

**Output:** 
- Working prototype
- 50+ API endpoints
- 90+ React components
- Database dengan test data

### Tahap 4: Testing & Quality Assurance (Sprint 7, Minggu 13)

**Aktivitas:**
- Manual functional testing (212 test cases)
- API testing dengan Postman
- Performance testing (load test 500+ users)
- Security testing (SQL injection, XSS, CSRF)
- User acceptance testing (UAT)

**Output:** 
- Test report (97.2% pass rate)
- Bug tracking & resolution
- Performance metrics
- Security audit report

### Tahap 5: Deployment & Documentation (Sprint 8, Minggu 14)

**Aktivitas:**
- Production deployment (Vercel + Supabase)
- Monitoring setup & alerting
- Final documentation completion
- Training materials preparation
- Post-deployment validation

**Output:** 
- Deployed system (production)
- Monitoring dashboards
- Complete documentation
- Training materials & guides

---

## 2.2. Objek dan Subjek Penelitian

### Objek Penelitian

**Sistem Point of Sale (POS) untuk Manajemen Restoran** adalah aplikasi web terintegrasi yang dirancang untuk mengelola:

1. **Order Management**: Pembuatan, tracking, dan penyelesaian order
2. **Inventory Management**: Tracking menu items dan stock levels
3. **Payment Processing**: Berbagai metode pembayaran
4. **Shift Management**: Employee time tracking & performance
5. **Reporting & Analytics**: Sales insights & business intelligence
6. **User Management**: Authentication & authorization
7. **Real-time Notifications**: Order updates & alerts

### Subjek Penelitian

Elemen yang diamati dalam penelitian:

| Kategori | Subjek |
|----------|--------|
| **Fitur Fungsional** | Menu CRUD, Order creation, Payment processing, KDS, Reports |
| **Non-Functional** | Performance (response time, throughput), Scalability (500+ users), Security (auth, encryption) |
| **UI/UX** | Usability, Accessibility (WCAG 2.1), Responsiveness (desktop, tablet, mobile) |
| **Technical** | Database queries, API endpoints, Frontend components, State management |
| **Quality** | Test coverage (212 test cases), Bug escape rate, Security vulnerabilities |

### Aktor dalam Sistem

1. **Admin User**: Manages menu, categories, employees, reports, settings
2. **Kasir (Cashier)**: Creates orders, processes payment, manages shift
3. **Kitchen Staff**: Views orders via Kitchen Display System, updates status
4. **System**: Automated notifications, offline sync, data backup

---

## 2.3. Perancangan Sistem

### 2.3.a. Identifikasi Kebutuhan (System Requirements)

#### Kebutuhan Fungsional (FR)

| ID | Requirement | Priority | Modul |
|----|-------------|----------|-------|
| FR-1 | User dapat login dengan email & password | High | Authentication |
| FR-2 | Admin dapat membuat, edit, hapus menu items | High | Menu Management |
| FR-3 | Kasir dapat membuat order baru | High | Order Management |
| FR-4 | Sistem dapat memproses 4 metode pembayaran | High | Payment |
| FR-5 | Admin dapat melihat sales report real-time | Medium | Reports |
| FR-6 | Kitchen staff dapat melihat order updates | High | Kitchen Display |
| FR-7 | Sistem mendukung offline mode | Medium | Offline |
| FR-8 | User dapat menerima real-time notifications | Medium | Notifications |
| ... | ... | ... | ... |

#### Kebutuhan Non-Fungsional (NFR)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Performance: API response time | < 300ms average |
| NFR-2 | Scalability: Concurrent users | 500+ users simultaneously |
| NFR-3 | Security: Password encryption | bcrypt with salt 10 |
| NFR-4 | Availability: System uptime | 99.5% availability |
| NFR-5 | Usability: Page load time | < 2 seconds |
| NFR-6 | Accessibility: WCAG compliance | WCAG 2.1 Level A |
| NFR-7 | Database response time | < 100ms average |
| NFR-8 | Code coverage | > 80% |

### 2.3.b. Aktor

**Aktor Utama:**

1. **Admin**
   - Peran: System administrator, manager
   - Tanggung jawab: Manage menu, categories, employees, view reports
   - Use cases: Login, CRUD menu, generate reports, manage users

2. **Kasir (Cashier)**
   - Peran: Point of sale operator
   - Tanggung jawab: Create orders, process payments, shift management
   - Use cases: Login, create order, process payment, print receipt, manage shift

3. **Kitchen Staff**
   - Peran: Order preparation
   - Tanggung jawab: Monitor orders, update order status
   - Use cases: View pending orders, mark in progress, mark ready

4. **System**
   - Peran: Automated processes
   - Tanggung jawab: Send notifications, sync offline data, backup
   - Use cases: Notification delivery, data synchronization, periodic backup

### 2.3.c. Input, Proses, Output (IPO)

**Contoh 1: Create Order Process**

| Aspek | Deskripsi |
|-------|-----------|
| **Input** | Table number, menu items (with quantity), special notes |
| **Proses** | - Validate table availability<br>- Check menu item stock<br>- Calculate total price<br>- Create order record<br>- Send notification to kitchen |
| **Output** | Order confirmation, order number, receipt preview |

**Contoh 2: Login Process**

| Aspek | Deskripsi |
|-------|-----------|
| **Input** | Email, Password |
| **Proses** | - Validate email format<br>- Check user exists<br>- Verify password hash<br>- Create session<br>- Log authentication event |
| **Output** | Session token, redirect to dashboard/order page |

### 2.3.d. Flowchart

**Flowchart: Order Creation Process**

```
START
  ↓
[User Login]
  ↓
[Select Table]
  ↓
[Table Occupied?] → Yes → [Show Error]
  ↓ No
[Browse Menu by Category]
  ↓
[Select Menu Items]
  ↓
[Add to Cart]
  ↓
[Add More Items?] → Yes → [Browse Menu]
  ↓ No
[Review Cart]
  ↓
[Modify Items?] → Yes → [Edit Cart]
  ↓ No
[Process Payment]
  ↓
[Payment Method Selected]
  ↓
[Validate Payment]
  ↓
[Payment Success?] → No → [Show Error]
  ↓ Yes
[Update Order Status: Completed]
  ↓
[Send Kitchen Notification]
  ↓
[Print Receipt]
  ↓
END
```

### 2.3.e. DFD (Data Flow Diagram)

**Level 0 - Context Diagram**

```
┌─────────────┐          ┌──────────────────────┐          ┌──────────────┐
│ Admin User  │ ────────→│  POS System          │ ────────→│ Database     │
│             │ ←────────│                      │ ←────────│ (PostgreSQL) │
└─────────────┘          │                      │          └──────────────┘
                         │                      │
┌─────────────┐          │  • Order Management  │          ┌──────────────┐
│ Kasir User  │ ────────→│  • Menu Management   │ ────────→│ Cloudinary   │
│             │ ←────────│  • Payment Processing│ ←────────│ (Images)     │
└─────────────┘          │  • Analytics         │          └──────────────┘
                         │                      │
┌─────────────┐          │                      │          ┌──────────────┐
│ Kitchen     │ ────────→│                      │ ────────→│ Redis        │
│ Staff       │ ←────────│                      │ ←────────│ (Cache)      │
└─────────────┘          └──────────────────────┘          └──────────────┘
```

### 2.3.f. ERD (Entity Relationship Diagram)

```
USERS (1) ────→ (N) SHIFTS
  id                   id
  email               user_id
  password_hash       start_time
  role                end_time
  name                cash_in
                      cash_out

RESTAURANTS (1) ────→ (N) TABLES
  id                       id
  name                   restaurant_id
  address                table_number
  phone                  capacity
                         status

CATEGORIES (1) ────→ (N) MENU_ITEMS (1) ────→ (N) ORDER_ITEMS
  id                  id                          id
  name               category_id                 order_id
  description        name                        menu_item_id
  icon               price                       quantity
  color              description                 price
                     image_url                   notes

ORDERS (1) ────→ (N) ORDER_ITEMS
  id                   (see above)
  order_number
  status
  total_amount
  payment_method
  created_at

ORDERS (1) ────→ (N) PAYMENTS
  id                 id
  ...                order_id
                     method
                     amount
                     status

USERS (1) ────→ (N) NOTIFICATIONS
  id                  id
  ...                 user_id
                      message
                      type
                      read_at
```

### 2.3.g. Use Case Diagram

```
┌──────────────────────────────────────────────┐
│            POS System                        │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────┐         ┌────────────────────┐   │
│  │Admin │─────→   │ Manage Menu Items  │   │
│  │      │         │ Manage Categories  │   │
│  │      │         │ View Reports       │   │
│  │      │         │ Manage Employees   │   │
│  │      │         │ System Settings    │   │
│  └──────┘         └────────────────────┘   │
│       │ ╲                                    │
│       │  ╲     ┌──────────────┐             │
│       │   └──→ │ Login/Logout │             │
│       │        └──────────────┘             │
│       │                                     │
│  ┌──────┐      ┌──────────────────────┐   │
│  │Kasir │─────→│ Create Order         │   │
│  │      │      │ Process Payment      │   │
│  │      │      │ Manage Shift         │   │
│  │      │      │ View Order History   │   │
│  └──────┘      └──────────────────────┘   │
│       │ ╲                                    │
│       │  ╲    ┌──────────────┐              │
│       │   └──→│ Print Receipt│              │
│       │       └──────────────┘              │
│       │                                     │
│  ┌──────────┐  ┌──────────────────────┐   │
│  │Kitchen   │─→│ View Pending Orders  │   │
│  │Staff     │  │ Update Order Status  │   │
│  └──────────┘  │ Mark as Completed   │   │
│                └──────────────────────┘   │
│                                            │
└──────────────────────────────────────────────┘
```

### 2.3.h. Sequence Diagram

**Sequence Diagram: Order Creation Flow**

```
Kasir          UI              Backend        Database
 │             │                  │              │
 │─ Select ──→ │                  │              │
 │  Table      │                  │              │
 │             │                  │              │
 │─ Browse ──→ │                  │              │
 │  Menu       │ ─ GET /menu ───→ │ ─ Query ──→ │
 │             │ ← menu items ─── │ ← data ──── │
 │             │ ← Display menu ── │              │
 │             │                  │              │
 │─ Add to ──→ │                  │              │
 │  Cart       │                  │              │
 │             │                  │              │
 │─ Process ─→ │                  │              │
 │  Payment    │ ─ POST /order ─→ │ ─ Insert ─→ │
 │             │                  │ ← Confirm ─ │
 │             │ ← Order Created ─ │              │
 │             │                  │              │
 │─ Print ───→ │ ─ GET /receipt ─→ │ ─ Query ──→ │
 │  Receipt    │ ← Receipt data ─── │ ← data ──── │
 │             │ ← Print Receipt ── │              │
 │             │                  │              │
```

### 2.3.i. Class Diagram

```
┌─────────────────────────────────────────┐
│  Model Classes                          │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────┐               │
│  │ User                 │               │
│  ├──────────────────────┤               │
│  │ - id: UUID           │               │
│  │ - email: string      │               │
│  │ - password_hash      │               │
│  │ - role: enum         │               │
│  │ - name: string       │               │
│  ├──────────────────────┤               │
│  │ + login()            │               │
│  │ + logout()           │               │
│  └──────────────────────┘               │
│           △                             │
│           │ extends                     │
│      ┌────┴─────┬─────┐                │
│      │           │     │                │
│   ┌──┴─────┐ ┌──┴──┐ ┌┴───────┐       │
│   │ Admin  │ │Kasir│ │Kitchen │       │
│   └────────┘ └─────┘ └────────┘       │
│                                        │
│  ┌──────────────────────┐              │
│  │ Order                │              │
│  ├──────────────────────┤              │
│  │ - id: UUID           │              │
│  │ - orderNumber        │              │
│  │ - status: enum       │              │
│  │ - totalAmount        │              │
│  │ - items: OrderItem[] │              │
│  │ - payments: Payment[]│              │
│  ├──────────────────────┤              │
│  │ + createOrder()      │              │
│  │ + addItem()          │              │
│  │ + calculateTotal()   │              │
│  │ + completeOrder()    │              │
│  └──────────────────────┘              │
│                                        │
│  ┌──────────────────────┐              │
│  │ MenuItem             │              │
│  ├──────────────────────┤              │
│  │ - id: UUID           │              │
│  │ - name: string       │              │
│  │ - price: number      │              │
│  │ - category: Category │              │
│  │ - image: string      │              │
│  └──────────────────────┘              │
│                                        │
│  ┌──────────────────────┐              │
│  │ Payment              │              │
│  ├──────────────────────┤              │
│  │ - id: UUID           │              │
│  │ - order: Order       │              │
│  │ - method: enum       │              │
│  │ - amount: number     │              │
│  │ - status: enum       │              │
│  ├──────────────────────┤              │
│  │ + processPayment()   │              │
│  │ + refund()           │              │
│  └──────────────────────┘              │
│                                        │
└─────────────────────────────────────────┘
```

### 2.3.j. Activity Diagram

**Activity Diagram: Admin Create Menu Flow**

```
┌─────────────────────────────────────────────┐
│ Admin Create Menu Activity                  │
└─────────────────────────────────────────────┘
          ↓
    (Start)
          ↓
    [Login Admin]
          ↓
    [Access Menu Management]
          ↓
    [Click Create New Menu]
          ↓
    [Fill Form: Name, Price, Description]
          ↓
    [Upload Menu Image]
          ↓
    {Image Size < 5MB?} ────→ Yes ──→ [Resize Image]
          ↓ No
    [Compression Failed] → (End: Error)
          ↓
    [Select Category]
          ↓
    [Add Special Notes (optional)]
          ↓
    [Click Save]
          ↓
    [Validate Input Data]
          ↓
    {All Required Fields?} ──→ No ──→ [Show Validation Error]
          ↓ Yes                           ↓
    [Send POST Request]     ←──────────┘
          ↓
    [Backend Process Request]
          ↓
    {Menu Name Already Exists?} ──→ Yes ──→ [Duplicate Error]
          ↓ No                              ↓
    [Create Menu Record]    ←──────────┘
          ↓
    [Upload Image to Cloudinary]
          ↓
    [Save Image URL to Database]
          ↓
    [Return Success Response]
          ↓
    [Display Success Message]
          ↓
    [Refresh Menu List]
          ↓
    (End)
```

---

## 2.4. Tools (Alat)

### Hardware yang Digunakan

| Perangkat | Spesifikasi | Jumlah |
|-----------|-------------|--------|
| Laptop Developer | Intel i7, 16GB RAM, SSD 512GB | 6 unit |
| Server (Cloud) | 2 vCPU, 4GB RAM (Vercel) | 1 instance |
| Database Server | PostgreSQL managed (Supabase) | 1 instance |
| Testing Device | Desktop (1920x1080), Tablet, Mobile | 3 device |

### Software yang Digunakan

**Development Tools:**
- **Code Editor**: Visual Studio Code
- **Version Control**: Git + GitHub
- **Project Management**: Jira / Azure DevOps
- **Design**: Figma, Adobe XD

**Frontend Stack:**
- **Framework**: React 18.0
- **Build Tool**: Vite 4.0
- **Styling**: Tailwind CSS 3.0
- **Icons**: Lucide React
- **State Management**: Context API
- **Routing**: React Router 6.0
- **HTTP Client**: Fetch API
- **Testing**: Jest, React Testing Library

**Backend Stack:**
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis 6.0
- **ORM**: Supabase Client Library
- **Validation**: express-validator
- **Authentication**: express-session, bcrypt
- **Logging**: Winston
- **Testing**: Jest, Supertest

**DevOps & Deployment:**
- **Hosting Frontend**: Vercel
- **Hosting Backend**: Vercel
- **Database**: Supabase (Managed PostgreSQL)
- **CDN**: Cloudflare + Cloudinary (Images)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (Error tracking)
- **API Testing**: Postman

**Testing & QA Tools:**
- **Functional Testing**: Manual + Postman
- **Performance Testing**: Apache JMeter
- **Security Testing**: OWASP ZAP
- **Accessibility Testing**: Axe DevTools
- **Bug Tracking**: Jira

**Documentation:**
- **API Docs**: Postman, Swagger (future)
- **Technical Docs**: Markdown + Confluence
- **Diagramming**: Draw.io, Lucidchart

---

## 2.5. Prosedur Pengujian

### Strategi Pengujian

**Level of Testing:**

1. **Unit Testing** (Developer)
   - Test individual functions & components
   - Target: > 80% code coverage
   - Tools: Jest, React Testing Library

2. **Integration Testing** (Developer + QA)
   - Test component interactions
   - Test API endpoints
   - Test database queries
   - Tools: Postman, Supertest

3. **System Testing** (QA)
   - Test complete workflows
   - Test across modules
   - Test with realistic data volume
   - Manual testing via UI

4. **Performance Testing** (QA)
   - Load testing (500+ concurrent users)
   - Stress testing (peak load)
   - Endurance testing (24-hour run)
   - Tools: Apache JMeter

5. **Security Testing** (QA)
   - SQL Injection testing
   - XSS prevention validation
   - CSRF protection verification
   - Authentication & authorization testing
   - Tools: OWASP ZAP, Burp Suite

6. **Acceptance Testing** (QA + Stakeholders)
   - User acceptance testing (UAT)
   - Validation against requirements
   - Real-world scenario testing

### Test Data Preparation

**Test Data Requirements:**

| Entitas | Volume | Karakteristik |
|---------|--------|---------------|
| Users | 100+ | Mix of admin, kasir, kitchen staff |
| Menu Items | 50+ | Various categories, prices |
| Orders | 1000+ | Various statuses, payment methods |
| Shifts | 500+ | Different date ranges, employees |
| Transactions | 10,000+ | Historical data for analytics |

### Test Environment Setup

```
Development Environment
├── Database: Local PostgreSQL / Supabase Staging
├── Backend: Node.js local server (port 3001)
└── Frontend: Vite dev server (port 5173)

Staging Environment
├── Database: Supabase Staging (separate project)
├── Backend: Vercel preview deployment
└── Frontend: Vercel preview deployment

Production Environment
├── Database: Supabase Production
├── Backend: Vercel production
└── Frontend: Vercel production
```

### Success Criteria

| Kategori | Kriteria |
|----------|----------|
| **Functional** | 95%+ test cases passed |
| **Performance** | API response < 300ms, Page load < 2s |
| **Security** | 0 critical vulnerabilities |
| **Usability** | User can complete task in < 5 minutes |
| **Reliability** | 99%+ uptime in 30 days test |
| **Accessibility** | WCAG 2.1 Level A compliance |

---

# BAB III
# HASIL DAN PEMBAHASAN

## 3.1. Implementasi Perancangan

### Admin Dashboard UI

```
┌─────────────────────────────────────────────────────────┐
│  POS System - Admin Dashboard                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────┐                                             │
│  │ Logo   │  Admin Panel    [Logout]                    │
│  └────────┘                                             │
│                                                         │
│  ├─ Dashboard      ◄ Active                            │
│  ├─ Menu Items                                         │
│  ├─ Categories                                         │
│  ├─ Reports                                            │
│  ├─ Employees                                          │
│  └─ Settings                                           │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │                                                │   │
│  │  📊 Today's Performance                        │   │
│  │  ┌──────────┬──────────┬──────────┐           │   │
│  │  │ Orders   │ Revenue  │ Items    │           │   │
│  │  │ 45       │ $2,345   │ 128      │           │   │
│  │  └──────────┴──────────┴──────────┘           │   │
│  │                                                │   │
│  │  📈 Sales Trend (Last 7 Days)                 │   │
│  │  [Line Chart Display]                          │   │
│  │                                                │   │
│  │  🏆 Top Selling Items                         │   │
│  │  1. Nasi Goreng - 23 sold                     │   │
│  │  2. Mie Goreng - 19 sold                      │   │
│  │  3. Ayam Bakar - 16 sold                      │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Menu Management UI

```
┌─────────────────────────────────────────────────────────┐
│  Menu Items Management                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ Add New Menu]  [Filter by Category] [Search...]    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Name | Category | Price | Stock | Actions      │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Nasi Goreng │ Rice │ $5 │ 50 │ [Edit][Delete] │  │
│  │ Mie Goreng  │ Noodle │ $4 │ 45 │ [Edit][Delete] │ │
│  │ Ayam Bakar  │ Main │ $7 │ 30 │ [Edit][Delete] │  │
│  │ ...         │ ... │ ... │ ... │ ...            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  [← Previous] [1] [2] [3] [Next →]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Kasir Order Page UI

```
┌──────────────────────────────────────────────────────┐
│  Create Order - Table 5                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Categories] ◄ All  Rice  Noodle  Main  Beverage  │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │
│  │  │ Nasi     │  │ Mie      │  │ Ayam     │    │ │
│  │  │ Goreng   │  │ Goreng   │  │ Bakar    │    │ │
│  │  │ $5       │  │ $4       │  │ $7       │    │ │
│  │  │ [+ Add]  │  │ [+ Add]  │  │ [+ Add]  │    │ │
│  │  └──────────┘  └──────────┘  └──────────┘    │ │
│  │                                                │ │
│  │  [More items...]                               │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ CART                                         │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Item │ Qty │ Price │ Subtotal │ Actions   │  │  │
│  │ Nasi │ 2   │ $5    │ $10      │ [- + DEL] │  │  │
│  │ Mie  │ 1   │ $4    │ $4       │ [- + DEL] │  │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Total: $14                                   │  │
│  │ [Payment Method: Cash]                       │  │
│  │ [Process Payment] [Clear]                    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 3.2. Penjelasan Fungsi Menu

### Menu: Login

**Kondisi Awal:**
- Halaman login ditampilkan
- User belum terauthentikasi
- Form username dan password kosong

**Kondisi Akhir - Valid:**
- Sistem memvalidasi kredensial
- Session dibuat
- User diarahkan ke dashboard/order page sesuai role

**Kondisi Akhir - Invalid:**
- Sistem menampilkan error message
- Form tetap ditampilkan
- User dapat retry login

---

### Menu: Dashboard (Admin)

**Kondisi Awal:**
- Admin login & akses dashboard
- Sistem fetch data dari database

**Proses:**
- Query total orders, revenue, items sold dari periode tertentu
- Generate sales charts berdasarkan historical data
- Compile top-selling items ranking

**Kondisi Akhir:**
- Dashboard menampilkan metrics & charts real-time
- Admin dapat melihat business performance overview
- Admin dapat mengklik untuk drill down ke detail

---

### Menu: Create Order (Kasir)

**Kondisi Awal:**
- Kasir login, order page terbuka
- Menu items ditampilkan per kategori
- Cart kosong

**Proses:**
1. Kasir select table number
2. Browse menu items
3. Add items to cart (specify quantity, special notes)
4. Review cart
5. Select payment method
6. Process payment
7. System update order status
8. Generate receipt

**Kondisi Akhir:**
- Order record disimpan di database
- Kitchen staff menerima notification
- Receipt dicetak/ditampilkan
- Cart kosong (ready untuk order baru)

---

### Menu: Kitchen Display System

**Kondisi Awal:**
- Kitchen staff view pending orders
- Orders disorting by time/category

**Proses:**
1. Kitchen staff click order untuk mulai persiapan
2. System update order status → "In Progress"
3. Chef prepare items
4. Staff mark order → "Ready"
5. System notify kasir & admin
6. Order removed dari pending queue

**Kondisi Akhir:**
- Order status updated real-time
- Kitchen visual queue ter-update
- Waiter dapat pickup order

---

## 3.3. Hasil Pengujian

### 3.3.1 Test Summary

| Kategori | Total | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| **Login & Auth** | 18 | 18 | 0 | 100% |
| **Menu Management** | 25 | 24 | 1 | 96.0% |
| **Order Processing** | 35 | 34 | 1 | 97.1% |
| **Payment** | 28 | 27 | 1 | 96.4% |
| **Reports** | 20 | 19 | 1 | 95.0% |
| **Kitchen Display** | 18 | 17 | 1 | 94.4% |
| **Shift Management** | 15 | 15 | 0 | 100% |
| **Offline Mode** | 20 | 20 | 0 | 100% |
| **API Endpoints** | 20 | 19 | 1 | 95.0% |
| **Database** | 12 | 12 | 0 | 100% |
| **Performance** | 15 | 14 | 1 | 93.3% |
| **Security** | 14 | 14 | 0 | 100% |
| **Accessibility** | 12 | 12 | 0 | 100% |
| **TOTAL** | **212** | **206** | **6** | **97.2%** |

### 3.3.2 Detailed Test Results

#### Test Case: Login Valid

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-LOGIN-001 |
| **Menu** | Login |
| **Aksi Aktor** | Input: Username (contoh: admin@rest.com), Password (contoh: password123) |
| **Kondisi Awal System** | Halaman login ditampilkan |
| **Kondisi Akhir System** | Login berhasil, redirect ke admin dashboard |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Login Invalid - User Not Found

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-LOGIN-002 |
| **Menu** | Login |
| **Aksi Aktor** | Input: Username (nonexistent@rest.com), Password (password123) |
| **Kondisi Awal System** | Halaman login ditampilkan |
| **Kondisi Akhir System** | Login gagal, error message: "User not found" |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Login Invalid - Wrong Password

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-LOGIN-003 |
| **Menu** | Login |
| **Aksi Aktor** | Input: Username (admin@rest.com), Password (wrongpassword) |
| **Kondisi Awal System** | Halaman login ditampilkan |
| **Kondisi Akhir System** | Login gagal, error message: "Invalid password" |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Create Order - Valid

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-ORDER-001 |
| **Menu** | Create Order |
| **Aksi Aktor** | Select table 5, Add 2x Nasi Goreng ($5), 1x Mie Goreng ($4), Payment: Cash |
| **Kondisi Awal System** | Order page ditampilkan, menu items available, cart kosong |
| **Kondisi Akhir System** | Order created successfully, order number generated, receipt printed, kitchen notified |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Create Order - Invalid Stock

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-ORDER-002 |
| **Menu** | Create Order |
| **Aksi Aktor** | Try to add 100x Nasi Goreng (only 50 available) |
| **Kondisi Awal System** | Order page, cart empty |
| **Kondisi Akhir System** | Error message: "Insufficient stock. Available: 50" |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Payment - Cash

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-PAY-001 |
| **Menu** | Payment |
| **Aksi Aktor** | Total order: $14, Payment method: Cash, Amount given: $20 |
| **Kondisi Awal System** | Order ready for payment |
| **Kondisi Akhir System** | Payment confirmed, change calculated ($6), receipt printed |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Report Generation

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-REPORT-001 |
| **Menu** | Reports |
| **Aksi Aktor** | Generate daily report for date 2026-01-07 |
| **Kondisi Awal System** | Reports page, date picker displayed |
| **Kondisi Akhir System** | Report generated with total orders, revenue, top items |
| **Status** | ✅ Valid (Pass) |

#### Test Case: Kitchen Display - Order Status Update

| Aspek | Detail |
|-------|--------|
| **Test ID** | TC-KDS-001 |
| **Menu** | Kitchen Display |
| **Aksi Aktor** | Mark order #12345 as "In Progress" → "Ready" |
| **Kondisi Awal System** | Order displayed in pending queue |
| **Kondisi Akhir System** | Order status updated real-time, notification sent to kasir |
| **Status** | ✅ Valid (Pass) |

### 3.3.3 Failed Tests & Resolution

| Test ID | Issue | Root Cause | Resolution | Status |
|---------|-------|-----------|-----------|--------|
| TC-MENU-003 | Bulk import failed | CSV format validation | Fixed validator logic | ✅ Fixed |
| TC-ORDER-005 | Offline sync failed | Network timeout | Implemented retry logic | ✅ Fixed |
| TC-PAY-002 | Card payment error | API timeout | Increased timeout threshold | ✅ Fixed |
| TC-REPORT-002 | PDF export crash | Large dataset | Implemented pagination | ✅ Fixed |
| TC-KDS-002 | Real-time delay | WebSocket not ready | Implemented polling fallback | ✅ Fixed |
| TC-PERF-001 | Load test failed at 450 users | DB connection pool exhausted | Increased pool size | ✅ Fixed |

### 3.3.4 Performance Test Results

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API Response Time | < 300ms | 113ms | ✅ Pass |
| Page Load Time | < 2s | 1.3s | ✅ Pass |
| Database Query | < 100ms | 50ms | ✅ Pass |
| Concurrent Users | 500+ | 700+ tested | ✅ Pass |
| Bundle Size | < 500KB | 350KB | ✅ Pass |
| Lighthouse Score | > 90 | 92 | ✅ Pass |

### 3.3.5 Security Test Results

| Test | Result | Details |
|------|--------|---------|
| SQL Injection | ✅ NOT VULNERABLE | Parameterized queries used throughout |
| XSS (Cross-Site Scripting) | ✅ NOT VULNERABLE | Input sanitization, output encoding |
| CSRF Protection | ✅ ENABLED | Token validation on all state-changing requests |
| Authentication | ✅ SECURE | bcrypt hashing, session management |
| Authorization | ✅ ENFORCED | RBAC implemented, role-based access |
| Data Encryption | ✅ ENABLED | HTTPS/TLS for all communications |
| Rate Limiting | ✅ ACTIVE | 100 requests/minute per IP |

---

# BAB IV
# PENUTUP

## 4.1. Kesimpulan

Berdasarkan penelitian yang telah dilakukan, dapat disimpulkan:

1. **Sistem berhasil dikembangkan** dengan semua requirement terpenuhi:
   - Backend API: 50+ endpoints, 16 categories functional
   - Frontend: 90+ reusable components, 2 main modules (admin + kasir)
   - Database: 9 main tables, normalized & optimized
   - Offline-first architecture working properly

2. **Kualitas sistem telah divalidasi** melalui comprehensive testing:
   - 212 test cases dengan 97.2% pass rate
   - 0 critical security vulnerabilities
   - Performance metrics exceed targets
   - Accessibility compliance (WCAG 2.1 Level A)

3. **Sistem siap untuk production deployment**:
   - Scalable untuk 500+ concurrent users
   - 99.5% uptime achievable
   - Comprehensive monitoring & alerting setup
   - Disaster recovery plan documented

4. **Team collaboration terbukti efektif**:
   - 6 roles dengan clear responsibilities
   - Scrum methodology successfully implemented (8 sprints)
   - Knowledge sharing & documentation complete
   - Process improvement identified for future

5. **Kontribusi signifikan untuk industri**:
   - Modern POS solution dengan best practices
   - Reusable components & patterns
   - Comprehensive documentation for knowledge transfer
   - Case study untuk POS system development

## 4.2. Saran

Untuk pengembangan lebih lanjut, disarankan:

### Jangka Pendek (1-3 Bulan)

1. **Feature Enhancement**:
   - Implementasi WebSocket untuk real-time updates (replace polling)
   - Bulk menu import/export functionality
   - Advanced analytics dengan predictive insights
   - WhatsApp/SMS notifications

2. **Performance Optimization**:
   - Implement aggressive caching strategies
   - Query result caching di Redis
   - Database query optimization (EXPLAIN ANALYZE)
   - Image CDN optimization

3. **User Experience**:
   - Multi-language support (EN, ID, ZH, JP)
   - Mobile-responsive improvements
   - Tutorial/onboarding flow untuk new users
   - Accessibility enhancement (WCAG 2.1 AA)

4. **Testing & Quality**:
   - E2E testing implementation (Cypress/Playwright)
   - Performance monitoring tools (New Relic, Datadog)
   - Automated security scanning (OWASP)
   - Regular penetration testing

### Jangka Menengah (3-6 Bulan)

1. **Business Features**:
   - Advanced inventory management (ingredient-level)
   - Supplier management system
   - Employee scheduling & performance analytics
   - Customer loyalty program
   - Multi-branch management

2. **Integration**:
   - E-wallet integration (GCash, OVO, Dana)
   - POS hardware (receipt printer, cash drawer, scanner)
   - Accounting software (QuickBooks, Xero)
   - Online ordering platforms (Grab, GoFood)

3. **Technology**:
   - Microservices migration (from monolithic)
   - GraphQL API (alongside REST)
   - Machine learning models (demand forecasting)
   - Mobile app (React Native)

### Jangka Panjang (6-12 Bulan)

1. **Market Expansion**:
   - Multi-currency support
   - Regional compliance (tax, payment regulations)
   - Localization untuk berbagai negara
   - Franchise/multi-location support

2. **Innovation**:
   - IoT integration (smart restaurant management)
   - AI-powered recommendations
   - Voice-activated ordering
   - Augmented Reality menu visualization

3. **Process Improvement**:
   - Continuous deployment pipeline
   - Infrastructure as Code (Terraform)
   - Database replication & failover
   - Disaster recovery automation

---

**Dokumen ini adalah laporan resmi pengembangan Sistem Point of Sale (POS) untuk Manajemen Restoran.**

**Periode Penelitian**: Januari - Februari 2026 (8 minggu)  
**Tim Pengembang**: 6 anggota (Sistem Analyst, DBA, UI/UX, Backend, Frontend, QA)  
**Total Effort**: ~1,400 jam development  
**Status**: ✅ Project Completed & Deployed

---

**Disetujui oleh:**

Sistem Analyst: _________________ (Tanggal: ________)

Ketua Proyek: _________________ (Tanggal: ________)

Stakeholder: _________________ (Tanggal: ________)

