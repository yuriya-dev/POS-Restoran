import React, { useState } from 'react';

const ManageMenu = () => {
  // State untuk melacak tab/bagian yang sedang aktif (misalnya 'categories' atau 'items')
  const [activeTab, setActiveTab] = useState('categories');

  // --- Komponen Placeholder untuk Kategori ---
  const CategoryManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Manajemen Kategori Menu (CRUD)</h3>
      <p className="text-gray-600">
        Di sini Anda akan menambahkan fungsionalitas untuk:
      </p>
      <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm text-gray-700">
        <li>**C**reate (Tambah Kategori Baru)</li>
        <li>**R**ead (Tampilkan Daftar Kategori)</li>
        <li>**U**pdate (Edit Nama/Deskripsi Kategori)</li>
        <li>**D**elete (Hapus Kategori)</li>
      </ul>
      {/* Nanti diisi dengan formulir tambah/edit dan tabel daftar kategori */}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Tambah Kategori
      </button>
    </div>
  );

  // --- Komponen Placeholder untuk Item Menu ---
  const ItemManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Manajemen Item Menu (CRUD)</h3>
      <p className="text-gray-600">
        Di sini Anda akan menambahkan fungsionalitas untuk:
      </p>
      <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm text-gray-700">
        <li>**C**reate (Tambah Item Menu Baru, termasuk harga dan kategori)</li>
        <li>**R**ead (Tampilkan Daftar Item Menu)</li>
        <li>**U**pdate (Edit Detail Item Menu)</li>
        <li>**D**elete (Hapus Item Menu)</li>
      </ul>
      {/* Nanti diisi dengan formulir tambah/edit dan tabel daftar item menu */}
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
        Tambah Item Menu
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Manajemen Menu</h2>
      
      {/* Tab Selector */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === 'categories' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Kategori
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`ml-4 px-4 py-2 text-lg font-medium ${
            activeTab === 'items' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Item Menu
        </button>
      </div>

      {/* Konten Tab Aktif */}
      <div>
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'items' && <ItemManagement />}
      </div>
    </div>
  );
}

export default ManageMenu;