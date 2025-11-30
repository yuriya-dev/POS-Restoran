import React, { useState, useEffect } from 'react';
import { 
    Settings as SettingsIcon, Save, RefreshCw, 
    Store, Percent, Receipt, Clock, 
    UploadCloud, Loader2, CheckCircle, User, Calendar 
} from 'lucide-react';
import Card from '../../shared/components/common/Card';
import Button from '../../shared/components/common/Button';
import { formatCurrency } from '../../shared/utils/helpers';
import { useSettings } from '../../shared/context/SettingsContext';
import { uploadToCloudinary } from '../../shared/services/cloudinary';
import { format } from 'date-fns'; 
import { id } from 'date-fns/locale'; 

const Settings = () => {
    const { settings: currentSettings, updateSettings, loading } = useSettings();
    
    const [activeTab, setActiveTab] = useState('general');

    // State Form (Hapus email dari default state)
    const [formData, setFormData] = useState({
        restaurantName: '', address: '', phone: '', logoUrl: '',
        receiptHeader: '', receiptFooter: 'Terima kasih!', wifiInfo: '', socialMedia: '',
        taxRate: 0.1, serviceCharge: 0.05, packagingFee: 0,
        openingHours: '09:00 - 22:00', currency: 'Rp',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Load Data Awal
    useEffect(() => {
        if (currentSettings) {
            // Filter properti yang tidak perlu agar form bersih
            // Kita juga membuang 'receiptInfo' jika masih ada nyangkut dari data lama
            const { editor, receiptInfo, email, ...cleanSettings } = currentSettings;
            setFormData(prev => ({ ...prev, ...cleanSettings }));
        }
    }, [currentSettings]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingLogo(true);
        try {
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, logoUrl: url }));
        } catch (error) {
            alert("Gagal upload logo.");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            // ✅ SANITASI DATA: Pastikan hanya field valid yang dikirim
            // Ini mencegah error "column not found" jika ada sisa data sampah
            const payload = {
                restaurantName: formData.restaurantName,
                address: formData.address,
                phone: formData.phone,
                logoUrl: formData.logoUrl,
                receiptHeader: formData.receiptHeader,
                receiptFooter: formData.receiptFooter,
                wifiInfo: formData.wifiInfo,
                socialMedia: formData.socialMedia,
                taxRate: formData.taxRate,
                serviceCharge: formData.serviceCharge,
                packagingFee: formData.packagingFee,
                openingHours: formData.openingHours,
                currency: formData.currency
            };

            await updateSettings(payload);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Save Error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Perhitungan Preview ---
    const subtotal = 100000;
    const tax = subtotal * (formData.taxRate || 0);
    const service = subtotal * (formData.serviceCharge || 0);
    const packaging = Number(formData.packagingFee || 0);
    const total = subtotal + tax + service + packaging;

    const TabBtn = ({ id, icon: Icon, label }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap
                ${activeTab === id 
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

    if (loading) return (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Loader2 className="animate-spin mr-2 w-5 h-5 text-blue-600 dark:text-blue-400" /> 
            <span>Memuat pengaturan...</span>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                            <SettingsIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        Pengaturan
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-1">Sesuaikan profil restoran dan konfigurasi sistem POS Anda.</p>
                </div>
                
                {/* Action Buttons */}
                <div className="hidden sm:flex space-x-3">
                    <Button 
                        variant="secondary" 
                        onClick={() => currentSettings && setFormData(prev => ({ ...prev, ...currentSettings }))} 
                        icon={<RefreshCw className="w-4 h-4" />}
                        className="shadow-sm"
                    >
                        Reset
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        icon={isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        className="shadow-md"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </div>

            {/* Info Update Terakhir */}
            {currentSettings?.updated_at && (
                <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 shadow-sm transition-colors">
                    <span className="font-semibold mr-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">Status Terkini:</span>
                    <div className="flex items-center mr-6">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                        Diperbarui pada {format(new Date(currentSettings.updated_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                    {currentSettings.editor && (
                        <div className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                            Oleh: <span className="font-semibold ml-1 text-blue-700 dark:text-blue-400">{currentSettings.editor.fullName || currentSettings.editor.username}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: TAB & FORM */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                    
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 scrollbar-hide transition-colors">
                        <TabBtn id="general" icon={Store} label="Profil Restoran" />
                        <TabBtn id="finance" icon={Percent} label="Pajak & Biaya" />
                        <TabBtn id="receipt" icon={Receipt} label="Tampilan Struk" />
                        <TabBtn id="ops" icon={Clock} label="Operasional" />
                    </div>

                    {/* Form Content Area */}
                    <div className="p-8 min-h-[500px] bg-white dark:bg-gray-800 transition-colors">
                        
                        {/* TAB 1: GENERAL */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
                                    {/* Logo Upload */}
                                    <div className="shrink-0">
                                        <label className={labelClass}>Logo Restoran</label>
                                        <div className="relative group w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-gray-50 dark:bg-gray-700 shadow-inner">
                                            {formData.logoUrl ? (
                                                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <UploadCloud className="w-8 h-8 mb-2" />
                                                    <span className="text-xs font-medium">Upload Logo</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                {uploadingLogo ? (
                                                    <Loader2 className="text-white animate-spin w-6 h-6" />
                                                ) : (
                                                    <span className="text-white text-sm font-semibold">Ubah Logo</span>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2\">JPG, PNG max 2MB</p>
                                    </div>
                                    
                                    {/* Basic Info (Tanpa Email) */}
                                    <div className="grow space-y-5 w-full">
                                        <div>
                                            <label className={labelClass}>Nama Restoran *</label>
                                            <input 
                                                name="restaurantName" 
                                                value={formData.restaurantName} 
                                                onChange={handleChange} 
                                                className={inputClass}
                                                placeholder="Contoh: Restoran Padang Sederhana" 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>No. Telepon</label>
                                            <input 
                                                name="phone" 
                                                value={formData.phone} 
                                                onChange={handleChange} 
                                                className={inputClass}
                                                placeholder="+62 812-3456-7890"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Alamat Lengkap</label>
                                    <textarea 
                                        name="address" 
                                        rows="3" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                        placeholder="Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220"
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB 2: FINANCE */}
                        {activeTab === 'finance' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Tax Rate */}
                                    <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-blue-600 p-2 rounded-lg mr-3">
                                                <Percent className="w-5 h-5 text-white" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-800">Pajak Penjualan (Tax)</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="number" 
                                                name="taxRate" 
                                                step="0.01" 
                                                min="0" 
                                                max="1" 
                                                value={formData.taxRate} 
                                                onChange={handleChange} 
                                                className="w-28 px-4 py-2.5 border-2 border-blue-300 rounded-l-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            />
                                            <span className="px-4 py-2.5 bg-blue-200 border-2 border-l-0 border-blue-300 rounded-r-lg text-blue-800 text-sm font-bold">%</span>
                                        </div>
                                        <p className="text-xs text-blue-700 mt-3 font-medium">Nilai desimal. Contoh: 0.1 = 10%</p>
                                    </div>

                                    {/* Service Charge */}
                                    <div className="p-6 bg-linear-to-br from-green-50 to-green-100/50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-green-600 p-2 rounded-lg mr-3">
                                                <Percent className="w-5 h-5 text-white" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-800">Service Charge</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="number" 
                                                name="serviceCharge" 
                                                step="0.01" 
                                                min="0" 
                                                max="1" 
                                                value={formData.serviceCharge} 
                                                onChange={handleChange} 
                                                className="w-28 px-4 py-2.5 border-2 border-green-300 rounded-l-lg text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                            />
                                            <span className="px-4 py-2.5 bg-green-200 border-2 border-l-0 border-green-300 rounded-r-lg text-green-800 text-sm font-bold">%</span>
                                        </div>
                                        <p className="text-xs text-green-700 mt-3 font-medium">Biaya layanan tambahan (opsional)</p>
                                    </div>

                                    {/* Packaging Fee */}
                                    <div className="p-6 bg-linear-to-br from-orange-50 to-orange-100/50 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-orange-600 p-2 rounded-lg mr-3">
                                                <Receipt className="w-5 h-5 text-white" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-800">Biaya Kemasan (Take Away)</label>
                                        </div>
                                        <div className="flex items-center max-w-md">
                                            <span className="px-4 py-2.5 bg-orange-200 border-2 border-r-0 border-orange-300 rounded-l-lg text-orange-800 text-sm font-bold">Rp</span>
                                            <input 
                                                type="number" 
                                                name="packagingFee" 
                                                min="0" 
                                                value={formData.packagingFee} 
                                                onChange={handleChange} 
                                                className="flex-1 px-4 py-2.5 border-2 border-orange-300 rounded-r-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                                                placeholder="5000"
                                            />
                                        </div>
                                        <p className="text-xs text-orange-700 mt-3 font-medium">Biaya flat per transaksi take away</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: RECEIPT */}
                        {activeTab === 'receipt' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="p-6 bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl border-2 border-purple-200">
                                    <label className={labelClass}>Header Struk (Teks Atas)</label>
                                    <input 
                                        name="receiptHeader" 
                                        value={formData.receiptHeader} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                        placeholder="Selamat Datang di Restoran Kami!" 
                                    />
                                </div>
                                
                                <div className="p-6 bg-linear-to-br from-pink-50 to-pink-100/30 rounded-xl border-2 border-pink-200">
                                    <label className={labelClass}>Footer Struk (Teks Bawah)</label>
                                    <textarea 
                                        name="receiptFooter" 
                                        rows="2" 
                                        value={formData.receiptFooter} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                        placeholder="Terima kasih atas kunjungan Anda. Sampai jumpa lagi!" 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-linear-to-br from-cyan-50 to-cyan-100/30 rounded-xl border-2 border-cyan-200">
                                        <label className={labelClass}>Info WiFi</label>
                                        <input 
                                            name="wifiInfo" 
                                            value={formData.wifiInfo} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                            placeholder="WiFi: RestoWiFi / Pass: 12345678" 
                                        />
                                    </div>
                                    <div className="p-6 bg-linear-to-br from-indigo-50 to-indigo-100/30 rounded-xl border-2 border-indigo-200">
                                        <label className={labelClass}>Social Media</label>
                                        <input 
                                            name="socialMedia" 
                                            value={formData.socialMedia} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                            placeholder="@restoranindonesia" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: OPERASIONAL */}
                        {activeTab === 'ops' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-linear-to-br from-amber-50 to-amber-100/30 rounded-xl border-2 border-amber-200">
                                        <label className={labelClass}>Jam Operasional</label>
                                        <input 
                                            name="openingHours" 
                                            value={formData.openingHours} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                            placeholder="09:00 - 22:00" 
                                        />
                                        <p className="text-xs text-amber-700 mt-3 font-medium">Format: HH:MM - HH:MM</p>
                                    </div>
                                    
                                    <div className="p-6 bg-linear-to-br from-teal-50 to-teal-100/30 rounded-xl border-2 border-teal-200">
                                        <label className={labelClass}>Mata Uang</label>
                                        <select 
                                            name="currency" 
                                            value={formData.currency} 
                                            onChange={handleChange} 
                                            className={`${inputClass} bg-white cursor-pointer`}
                                        >
                                            <option value="Rp">Rupiah (Rp)</option>
                                            <option value="$">Dollar ($)</option>
                                            <option value="€">Euro (€)</option>
                                        </select>
                                        <p className="text-xs text-teal-700 mt-3 font-medium">Simbol yang muncul di struk</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* KOLOM KANAN: PREVIEW */}
                <div className="lg:col-span-1 space-y-6">
                    {saveSuccess && (
                        <div className="bg-linear-to-r from-green-100 to-green-50 border-2 border-green-300 text-green-800 px-5 py-4 rounded-xl flex items-center shadow-lg animate-bounce">
                            <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                            <span className="font-semibold">Pengaturan berhasil disimpan!</span>
                        </div>
                    )}

                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                                <Receipt className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                Live Preview Struk
                            </h3>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-6 shadow-2xl border-2 border-gray-300 dark:border-gray-600 w-full mx-auto rounded-lg transition-colors" 
                             style={{ maxWidth: '320px', fontFamily: '"Courier New", Courier, monospace' }}>
                            
                            <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
                                {formData.logoUrl && (
                                    <img src={formData.logoUrl} alt="Logo" className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600" />
                                )}
                                <h4 className="font-bold text-lg uppercase tracking-wide text-gray-900 dark:text-white">{formData.restaurantName || 'NAMA RESTO'}</h4>
                                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mt-2">{formData.address || 'Alamat Restoran'}</p>
                                <p className="text-[11px] text-gray-600 dark:text-gray-400">{formData.phone || 'No. Telepon'}</p>
                            </div>

                            {formData.receiptHeader && (
                                <p className="text-center text-[11px] mb-3 pb-3 border-b border-dashed border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300">{formData.receiptHeader}</p>
                            )}

                            <div className="text-[12px] space-y-1.5 mb-3 text-gray-900 dark:text-gray-100">
                                <div className="flex justify-between"><span>1x Nasi Goreng</span> <span className="font-semibold">100.000</span></div>
                            </div>

                            <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-3"></div>

                            <div className="text-[12px] space-y-1.5 text-gray-900 dark:text-gray-100">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span> <span>{formatCurrency(subtotal)}</span></div>
                                {formData.taxRate > 0 && (
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Pajak ({(formData.taxRate * 100).toFixed(1)}%)</span> <span>{formatCurrency(tax)}</span></div>
                                )}
                                {formData.serviceCharge > 0 && (
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Service ({(formData.serviceCharge * 100).toFixed(1)}%)</span> <span>{formatCurrency(service)}</span></div>
                                )}
                                {formData.packagingFee > 0 && (
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Kemasan</span> <span>{formatCurrency(packaging)}</span></div>
                                )}
                                <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-2"></div>
                                <div className="flex justify-between font-bold text-base pt-1 text-gray-900 dark:text-white"><span>TOTAL</span> <span>{formatCurrency(total)}</span></div>
                            </div>

                            <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-4"></div>

                            <div className="text-center text-[11px] space-y-1.5 text-gray-600 dark:text-gray-400">
                                <p className="italic">{formData.receiptFooter}</p>
                                {formData.wifiInfo && <p className="mt-2 font-semibold text-blue-700 dark:text-blue-400">📶 {formData.wifiInfo}</p>}
                                {formData.socialMedia && <p className="text-pink-700 dark:text-pink-400">📱 {formData.socialMedia}</p>}
                                <p className="mt-4 text-[10px] text-gray-400">Powered by POS System</p>
                            </div>
                        </div>

                        <div className="mt-6 sm:hidden">
                            <Button 
                                variant="primary" 
                                onClick={handleSave} 
                                className="w-full justify-center py-3.5 text-base shadow-lg" 
                                disabled={isSaving}
                                icon={isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;