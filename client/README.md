# Client - POS Restoran (Merged Admin & Kasir)

Ini adalah folder client yang sudah menggabungkan aplikasi admin dan kasir menjadi satu project dengan struktur folder yang terorganisir.

## Struktur Folder

```
client/
├── src/
│   ├── shared/           # Komponen & service yang shared antara admin & kasir
│   │   ├── components/
│   │   │   └── common/   # Button, Card, Modal, dll
│   │   ├── context/      # AuthContext, SettingsContext
│   │   ├── pages/        # Login (shared)
│   │   ├── services/     # API, Cloudinary, Supabase
│   │   └── utils/        # Helpers, index
│   ├── admin/            # Aplikasi Admin
│   │   ├── components/
│   │   │   ├── layout/   # AdminLayout, Sidebar
│   │   │   ├── management/ # CategoryTable, MenuItemForm
│   │   │   └── reports/  # SalesChart, TopSellingItems
│   │   ├── context/      # DataContext (admin-specific)
│   │   ├── pages/        # Dashboard, MenuItems, Employees, dll
│   │   └── App.jsx       # Admin App Router
│   ├── kasir/            # Aplikasi Kasir
│   │   ├── components/   # CartSidebar, Receipt, KasirLayout
│   │   ├── context/      # CartContext (kasir-specific)
│   │   ├── pages/        # TableMap, OrderPage, ShiftDashboard, dll
│   │   └── App.jsx       # Kasir App Router
│   ├── App.jsx           # Main Router (switch antara admin/kasir)
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                  # Environment variables
```

## Cara Kerja

1. User login melalui halaman login yang sama (`/shared/pages/Login.jsx`)
2. Sistem mendeteksi `user.role` di AuthContext
3. Jika role = 'kasir' → render `KasirApp` (dengan `CartProvider`)
4. Jika role = 'admin' → render `AdminApp` (dengan `DataProvider`)
5. Setiap app memiliki router sendiri dengan breadcrumb dan UI yang berbeda

## Import Paths

### Dari file di src/admin/pages/
```javascript
// Common components dari shared
import Button from '../../shared/components/common/Button';
import Card from '../../shared/components/common/Card';

// Context shared
import { useAuth } from '../../shared/context/AuthContext';

// Services shared
import { api } from '../../shared/services/api';
import { formatCurrency } from '../../shared/utils/helpers';

// Admin-specific context
import { useData } from '../context/DataContext';

// Admin-specific components
import SalesChart from '../components/reports/SalesChart';
```

### Dari file di src/admin/components/
```javascript
// Tergantung nesting depth:
// Dari components/layout atau components/management
import Button from '../../../shared/components/common/Button';

// Atau dari components/reports
import Card from '../../../shared/components/common/Card';
```

### Dari file di src/kasir/pages/
```javascript
// Common components dari shared
import Button from '../../shared/components/common/Button';

// Context shared
import { useAuth } from '../../shared/context/AuthContext';

// Services shared
import { api } from '../../shared/services/api';

// Kasir-specific context
import { useCart } from '../context/CartContext';

// Kasir-specific components
import CartSidebar from '../components/CartSidebar';
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Lint code
npm run lint
```

## Environment Variables

Buat file `.env` di root folder dengan:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

## Notes

- Komponen yang sama dari kedua aplikasi sudah di-merge ke `src/shared/components/common/`
- Setiap aplikasi masih bisa punya komponen spesifik di folder mereka sendiri
- Context providers di-nest sesuai kebutuhan (Admin punya `DataProvider`, Kasir punya `CartProvider`)
- Routing untuk setiap aplikasi terpisah, tapi login/auth adalah global
