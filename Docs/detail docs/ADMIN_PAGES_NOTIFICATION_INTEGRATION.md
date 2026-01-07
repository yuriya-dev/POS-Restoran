# 💼 Admin Pages - Notification Integration Examples

Panduan integrasi notification system ke berbagai admin pages.

---

## 🎯 Quick Integration Template

Untuk setiap admin page, ikuti pattern ini:

```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function AdminPage() {
  const { addNotification } = useNotification();
  
  // Your component logic here
}
```

---

## 📊 Dashboard.jsx

### Pending Orders Alert
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function Dashboard() {
  const { addNotification } = useNotification();
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.getDashboardStats();
      setStats(data);
      
      // Alert jika banyak pending orders
      if (data.pendingOrders > 10) {
        addNotification(
          `⚠️ Ada ${data.pendingOrders} order menunggu!`,
          'urgent',
          0 // Manual dismiss
        );
      }
      
      // Alert jika revenue drop
      if (data.revenueChange < -10) {
        addNotification(
          `📉 Revenue menurun ${Math.abs(data.revenueChange).toFixed(1)}% dari kemarin`,
          'warning'
        );
      }
    };
    
    fetchStats();
  }, []);
  
  return <div>{/* Dashboard content */}</div>;
}
```

---

## 👥 Employees.jsx

### User Management Actions
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function Employees() {
  const { addNotification } = useNotification();
  
  // Add Employee
  const handleAddEmployee = async (formData) => {
    try {
      const response = await api.createEmployee(formData);
      addNotification(
        `✅ Employee "${response.fullName}" berhasil ditambahkan`,
        'success',
        5000,
        {
          label: 'Lihat Profile',
          onClick: () => navigate(`/employees/${response.id}`)
        }
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal tambah employee: ${error.message}`,
        'error'
      );
    }
  };
  
  // Delete Employee
  const handleDeleteEmployee = async (employeeId, name) => {
    try {
      await api.deleteEmployee(employeeId);
      addNotification(
        `🗑️ Employee "${name}" berhasil dihapus`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal hapus employee: ${error.message}`,
        'error'
      );
    }
  };
  
  // Update Employee Role
  const handleUpdateRole = async (employeeId, newRole) => {
    try {
      await api.updateEmployeeRole(employeeId, newRole);
      addNotification(
        `✅ Role diubah menjadi "${newRole}"`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal update role: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Employees content */}</div>;
}
```

---

## 📦 MenuItems.jsx

### Inventory Management
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function MenuItems() {
  const { addNotification } = useNotification();
  
  // Check Stock Levels
  useEffect(() => {
    const checkStocks = async () => {
      const items = await api.getMenuItems();
      
      // Find low stock items
      const lowStockItems = items.filter(item => item.quantity < 10);
      const outOfStock = items.filter(item => item.quantity === 0);
      
      if (outOfStock.length > 0) {
        addNotification(
          `🔴 ${outOfStock.length} items habis! ${outOfStock.map(i => i.name).join(', ')}`,
          'urgent',
          0
        );
      }
      
      if (lowStockItems.length > 0) {
        addNotification(
          `⚠️ ${lowStockItems.length} items stok menipis`,
          'warning'
        );
      }
    };
    
    checkStocks();
    const interval = setInterval(checkStocks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  // Add Menu Item
  const handleAddItem = async (itemData) => {
    try {
      const response = await api.createMenuItem(itemData);
      addNotification(
        `✅ Menu "${response.name}" berhasil ditambahkan`,
        'success',
        5000
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal tambah menu: ${error.message}`,
        'error'
      );
    }
  };
  
  // Update Stock
  const handleStockUpdate = async (itemId, newQuantity) => {
    try {
      await api.updateMenuStock(itemId, newQuantity);
      addNotification(
        `✅ Stok item berhasil diupdate ke ${newQuantity}`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal update stok: ${error.message}`,
        'error'
      );
    }
  };
  
  // Delete Menu Item
  const handleDeleteItem = async (itemId, itemName) => {
    try {
      await api.deleteMenuItem(itemId);
      addNotification(
        `✅ Menu "${itemName}" berhasil dihapus`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal hapus menu: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Menu Items content */}</div>;
}
```

---

## 🏷️ MenuCategories.jsx

### Category Management
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function MenuCategories() {
  const { addNotification } = useNotification();
  
  // Add Category
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await api.createCategory(categoryData);
      addNotification(
        `✅ Kategori "${response.name}" berhasil dibuat`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal buat kategori: ${error.message}`,
        'error'
      );
    }
  };
  
  // Update Category
  const handleUpdateCategory = async (categoryId, newData) => {
    try {
      await api.updateCategory(categoryId, newData);
      addNotification(
        `✅ Kategori berhasil diupdate`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal update kategori: ${error.message}`,
        'error'
      );
    }
  };
  
  // Delete Category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    try {
      await api.deleteCategory(categoryId);
      addNotification(
        `✅ Kategori "${categoryName}" berhasil dihapus`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal hapus kategori: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Categories content */}</div>;
}
```

---

## 🍽️ TableManagement.jsx

### Table Management
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function TableManagement() {
  const { addNotification } = useNotification();
  
  // Add Table
  const handleAddTable = async (tableData) => {
    try {
      const response = await api.createTable(tableData);
      addNotification(
        `✅ Meja ${response.number} berhasil ditambahkan`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal tambah meja: ${error.message}`,
        'error'
      );
    }
  };
  
  // Update Table Status
  const handleUpdateTableStatus = async (tableId, status) => {
    try {
      await api.updateTableStatus(tableId, status);
      const statusLabel = status === 'available' ? 'Tersedia' : 'Sibuk';
      addNotification(
        `✅ Status meja diubah menjadi "${statusLabel}"`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal update status meja: ${error.message}`,
        'error'
      );
    }
  };
  
  // Delete Table
  const handleDeleteTable = async (tableId, tableNumber) => {
    try {
      await api.deleteTable(tableId);
      addNotification(
        `✅ Meja ${tableNumber} berhasil dihapus`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal hapus meja: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Table Management content */}</div>;
}
```

---

## ⚙️ Settings.jsx

### System Settings
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function Settings() {
  const { addNotification } = useNotification();
  
  // Save Settings
  const handleSaveSettings = async (settings) => {
    try {
      await api.updateSettings(settings);
      addNotification(
        `✅ Pengaturan berhasil disimpan`,
        'success'
      );
      // Optionally trigger page reload
      // window.location.reload();
    } catch (error) {
      addNotification(
        `❌ Gagal simpan pengaturan: ${error.message}`,
        'error'
      );
    }
  };
  
  // Reset to Default
  const handleResetSettings = async () => {
    try {
      await api.resetSettings();
      addNotification(
        `🔄 Pengaturan berhasil direset ke default`,
        'success'
      );
      await refreshData();
    } catch (error) {
      addNotification(
        `❌ Gagal reset pengaturan: ${error.message}`,
        'error'
      );
    }
  };
  
  // Database Backup
  const handleBackupDatabase = async () => {
    try {
      const response = await api.backupDatabase();
      addNotification(
        `✅ Database backup selesai`,
        'success',
        5000,
        {
          label: 'Download',
          onClick: () => downloadFile(response.backupUrl)
        }
      );
    } catch (error) {
      addNotification(
        `❌ Gagal backup database: ${error.message}`,
        'error'
      );
    }
  };
  
  // Clear Cache
  const handleClearCache = async () => {
    try {
      await api.clearCache();
      addNotification(
        `🧹 Cache berhasil dihapus`,
        'success'
      );
    } catch (error) {
      addNotification(
        `❌ Gagal clear cache: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Settings content */}</div>;
}
```

---

## 📊 Reports.jsx

### Report Notifications
```jsx
import { useNotification } from '@/shared/context/NotificationContext';

export default function Reports() {
  const { addNotification } = useNotification();
  
  // Generate Report
  const handleGenerateReport = async (filters) => {
    try {
      const response = await api.generateReport(filters);
      addNotification(
        `✅ Laporan berhasil dibuat (${response.totalRecords} records)`,
        'success',
        5000,
        {
          label: 'Download PDF',
          onClick: () => downloadReport(response.reportUrl)
        }
      );
    } catch (error) {
      addNotification(
        `❌ Gagal buat laporan: ${error.message}`,
        'error'
      );
    }
  };
  
  // Export Data
  const handleExportData = async (format) => {
    try {
      const response = await api.exportData(format);
      addNotification(
        `✅ Data berhasil di-export (${format.toUpperCase()})`,
        'success',
        5000,
        {
          label: 'Download',
          onClick: () => downloadFile(response.fileUrl)
        }
      );
    } catch (error) {
      addNotification(
        `❌ Gagal export data: ${error.message}`,
        'error'
      );
    }
  };
  
  return <div>{/* Reports content */}</div>;
}
```

---

## 🔔 Pattern Summary

Setiap admin page mengikuti pattern yang sama:

```jsx
// 1. Import hook
import { useNotification } from '@/shared/context/NotificationContext';

// 2. Use hook di component
const { addNotification } = useNotification();

// 3. Trigger notifikasi saat action
const handleAction = async () => {
  try {
    // Perform action
    addNotification('Success message', 'success');
  } catch (error) {
    addNotification(`Error: ${error.message}`, 'error');
  }
};
```

---

## ✅ Integration Checklist

- [ ] Dashboard - Pending orders & revenue alerts
- [ ] Employees - Add/delete/update notifications
- [ ] MenuItems - Stock alerts & CRUD notifications
- [ ] MenuCategories - Category management notifications
- [ ] TableManagement - Table CRUD notifications
- [ ] Settings - Settings & backup notifications
- [ ] Reports - Report generation & export notifications
- [ ] All pages tested with notification dropdown

---

## 📞 Support

Refer ke dokumentasi utama:
- NOTIFICATION_SYSTEM.md - Technical docs
- NOTIFICATION_EXAMPLES.md - Code examples
- ADMIN_NOTIFICATION_DROPDOWN.md - Dropdown integration
