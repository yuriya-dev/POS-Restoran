import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, AlertTriangle, Info, Utensils } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/helpers';

// Asumsi SettingsContext dan useSettings hook tersedia
const initialSettings = {
    nama_restoran: 'POS Restoran',
    alamat: 'Jl. Contoh No. 123, Jakarta',
    telepon: '021-1234567',
    pajak_persen: 10,
    service_persen: 5,
    info_struk: 'Terima kasih atas kunjungan Anda!'
};

const Settings = () => {
    // const { settings, updateSettings } = useSettings(); // Ganti dengan useSettings dari Context
    const [settings, setSettings] = useState(initialSettings);
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi API Save
            // updateSettings(formData); // Call context update
            setSettings(formData); // Update local state for simulation
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Preview Kalkulasi
    const subtotalExample = 100000;
    const pajakNominal = subtotalExample * (formData.pajak_persen / 100);
    const serviceNominal = subtotalExample * (formData.service_persen / 100);
    const totalExample = subtotalExample + pajakNominal + serviceNominal;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><SettingsIcon className="w-6 h-6 mr-2 text-blue-600" /> Pengaturan Restoran</h1>
            <p className="text-gray-500">Konfigurasi info dasar, pajak, dan biaya layanan restoran Anda.</p>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Kolom Kiri: Form Pajak & Info Restoran */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Section: Pajak & Service */}
                    <Card title="Pajak & Biaya Layanan" icon={AlertTriangle} className="p-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="pajak_persen" className="block text-sm font-medium text-gray-700">Pajak Penjualan (%)</label>
                                <input
                                    id="pajak_persen"
                                    type="number"
                                    name="pajak_persen"
                                    value={formData.pajak_persen}
                                    onChange={handleChange}
                                    min="0" max="100"
                                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="service_persen" className="block text-sm font-medium text-gray-700">Biaya Layanan (%)</label>
                                <input
                                    id="service_persen"
                                    type="number"
                                    name="service_persen"
                                    value={formData.service_persen}
                                    onChange={handleChange}
                                    min="0" max="100"
                                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Section: Informasi Dasar Restoran */}
                    <Card title="Informasi Dasar Restoran" icon={Info} className="p-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="nama_restoran" className="block text-sm font-medium text-gray-700">Nama Restoran</label>
                                <input id="nama_restoran" type="text" name="nama_restoran" value={formData.nama_restoran} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="relative">
                                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                                <textarea id="alamat" name="alamat" rows="3" value={formData.alamat} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="relative">
                                <label htmlFor="telepon" className="block text-sm font-medium text-gray-700">Telepon</label>
                                <input id="telepon" type="tel" name="telepon" value={formData.telepon} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </Card>

                    {/* Section: Info Struk */}
                    <Card title="Info Struk (Footer)" icon={Utensils} className="p-6">
                        <div className="relative">
                            <label htmlFor="info_struk" className="block text-sm font-medium text-gray-700">Pesan Terima Kasih/Syarat & Ketentuan</label>
                            <textarea id="info_struk" name="info_struk" rows="3" value={formData.info_struk} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </Card>

                </div>

                {/* Kolom Kanan: Preview Perhitungan & Struk */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Preview Perhitungan" className="bg-blue-50 border-blue-200 border-l-4 shadow-lg p-6">
                        <p className="text-sm text-gray-600 mb-3">Contoh perhitungan dengan Subtotal {formatCurrency(subtotalExample)}:</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium">{formatCurrency(subtotalExample)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Pajak ({formData.pajak_persen}%)</span>
                                <span className="font-medium">{formatCurrency(pajakNominal)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Service ({formData.service_persen}%)</span>
                                <span className="font-medium">{formatCurrency(serviceNominal)}</span>
                            </div>
                            <div className="pt-2 border-t border-blue-200 flex justify-between font-bold text-lg text-blue-700">
                                <span>Total</span>
                                <span>{formatCurrency(totalExample)}</span>
                            </div>
                        </div>
                    </Card>
                    
                    {/* Simulasi Struk */}
                    <Card title="Simulasi Info Struk" className="bg-white border-2 border-dashed border-gray-300 p-6 text-xs font-mono text-center">
                        <p className="font-bold text-sm">{formData.nama_restoran}</p>
                        <p>{formData.alamat}</p>
                        <p>Telp: {formData.telepon}</p>
                        <div className="my-3 border-t border-dashed border-gray-400"></div>
                        <p className="font-bold">Total: {formatCurrency(totalExample)}</p>
                        <div className="my-3 border-t border-dashed border-gray-400"></div>
                        <p>{formData.info_struk}</p>
                        <p className="mt-2 text-gray-500">No. {Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                    </Card>
                </div>
                
                {/* Save Button & Notification */}
                <div className="lg:col-span-3 flex justify-end space-x-3">
                    <Button 
                        variant="secondary" 
                        type="button" 
                        icon={<RefreshCw className="w-5 h-5" />}
                        onClick={() => setFormData(settings)}
                        disabled={isSaving || JSON.stringify(formData) === JSON.stringify(settings)}
                    >
                        Reset
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        icon={<Save className="w-5 h-5" />}
                        disabled={isSaving || JSON.stringify(formData) === JSON.stringify(settings)}
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    {saveSuccess && (
                        <div className="flex items-center text-green-600 font-semibold transition-opacity duration-300 animate-fadeIn">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Berhasil Disimpan!
                        </div>
                    )}
                </div>
            </form>

        </div>
    );
};

export default Settings;