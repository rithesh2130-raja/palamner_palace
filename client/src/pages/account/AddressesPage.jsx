import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Home, Building2, AlertCircle } from 'lucide-react';
import { addressService } from '../../services/addressService.js';

export const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await addressService.getAddresses();
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      setError(err.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingAddress(null);
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('Palamaner');
    setState('Andhra Pradesh');
    setPostalCode('517408');
    setCountry('India');
    setLandmark('');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFullName(addr.fullName || '');
    setPhone(addr.phone || '');
    setAddressLine1(addr.addressLine1 || '');
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPostalCode(addr.postalCode || '');
    setCountry(addr.country || 'India');
    setLandmark(addr.landmark || '');
    setIsDefault(Boolean(addr.isDefault));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setError('Please fill in all required address fields.');
      return;
    }

    setFormLoading(true);
    setError('');
    setSuccessMsg('');

    const payload = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    };

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id || editingAddress.id, payload);
        setSuccessMsg('Address updated successfully.');
      } else {
        await addressService.createAddress(payload);
        setSuccessMsg('Address added successfully.');
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err) {
      setError(err.message || 'Failed to save address.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setError('');
    try {
      await addressService.setDefaultAddress(id);
      setSuccessMsg('Default address updated.');
      fetchAddresses();
    } catch (err) {
      setError(err.message || 'Failed to set default address.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setError('');
    try {
      await addressService.deleteAddress(id);
      setSuccessMsg('Address removed.');
      fetchAddresses();
    } catch (err) {
      setError(err.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span>Saved Delivery Addresses</span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Manage your delivery locations for fast checkout
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-accent text-gray-950 font-bold rounded-xl text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW ADDRESS</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-surface-secondary/40">
          <MapPin className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-base font-bold text-text-primary">No addresses saved yet</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
            Add a delivery address to speed up your future checkout process on ShopSphere.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-accent text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const addrId = addr._id || addr.id;
            return (
              <div
                key={addrId}
                className={`relative rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  addr.isDefault
                    ? 'bg-surface border-accent shadow-md ring-1 ring-accent/30'
                    : 'bg-surface border-border hover:border-text-tertiary'
                }`}
              >
                <div>
                  {/* Default Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-secondary text-[11px] font-bold text-text-secondary">
                      <Home className="w-3.5 h-3.5 text-accent" />
                      <span>Address</span>
                    </span>
                    {addr.isDefault && (
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-extrabold text-[10px] uppercase tracking-wider">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm text-text-primary">{addr.fullName}</h3>
                  <p className="text-xs font-semibold text-text-secondary mt-0.5">📞 {addr.phone}</p>
                  <div className="mt-3 text-xs text-text-secondary leading-relaxed space-y-0.5">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.landmark && <p className="text-text-tertiary italic">Landmark: {addr.landmark}</p>}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-bold gap-2">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addrId)}
                      className="text-accent hover:underline"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Primary Address
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                      title="Edit address"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addrId)}
                      className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-text-primary mb-4 pb-2 border-b border-border">
              {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rithesh Raja"
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary uppercase mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House/Flat No., Street, Area"
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-secondary uppercase mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, Suite, Unit, Sector (Optional)"
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Palamaner"
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Andhra Pradesh"
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="517408"
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary uppercase mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Bus Stand / Palace Gate"
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddr"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-accent border-border rounded focus:ring-accent accent-accent cursor-pointer"
                />
                <label htmlFor="defaultAddr" className="text-xs font-semibold text-text-primary cursor-pointer">
                  Make this my default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold text-text-secondary hover:bg-surface-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-accent text-gray-950 font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {formLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
