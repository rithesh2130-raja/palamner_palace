import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, CheckCircle2, Home, AlertCircle } from 'lucide-react';
import { addressService } from '../../services/addressService.js';

export const AddressSelector = ({ selectedAddressId, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Address Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Palamaner');
  const [state, setState] = useState('Andhra Pradesh');
  const [postalCode, setPostalCode] = useState('517408');
  const [country, setCountry] = useState('India');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await addressService.getAddresses();
      if (res && res.success && res.data?.addresses) {
        const addrs = res.data.addresses;
        setAddresses(addrs);

        // Auto select default or first address if none selected yet
        if (addrs.length > 0 && !selectedAddressId) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          onSelectAddress(defaultAddr._id || defaultAddr.id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load delivery addresses.');
    } finally {
      setLoading(false);
    }
  }, [onSelectAddress, selectedAddressId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setError('Please fill in all required address fields.');
      return;
    }

    setFormLoading(true);
    setError('');

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
      isDefault: isDefault || addresses.length === 0,
    };

    try {
      const res = await addressService.createAddress(payload);
      const newAddr = res.data;
      setIsModalOpen(false);
      await fetchAddresses();
      if (newAddr && (newAddr._id || newAddr.id)) {
        onSelectAddress(newAddr._id || newAddr.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to save new address.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <span>1. Select Shipping Address</span>
        </h3>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-accent/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD NEW ADDRESS</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-accent" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-6 border border-dashed border-border rounded-2xl text-center bg-surface-secondary/40">
          <p className="text-xs text-text-secondary font-semibold">No saved addresses found.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-4 py-2 bg-accent text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const addrId = addr._id || addr.id;
            const isSelected = selectedAddressId === addrId;

            return (
              <div
                key={addrId}
                onClick={() => onSelectAddress(addrId)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface border-accent shadow-md ring-2 ring-accent/40'
                    : 'bg-surface border-border hover:border-text-tertiary'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={isSelected}
                        onChange={() => onSelectAddress(addrId)}
                        className="w-4 h-4 text-accent accent-accent"
                      />
                      <span className="font-extrabold text-xs text-text-primary">{addr.fullName}</span>
                    </div>

                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-black text-[9px] uppercase tracking-wider">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-semibold text-text-secondary pl-6">📞 {addr.phone}</p>
                  <div className="mt-2 text-xs text-text-secondary pl-6 space-y-0.5 leading-relaxed">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.landmark && <p className="text-text-tertiary italic">Landmark: {addr.landmark}</p>}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-xs font-bold text-accent">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected for delivery</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-text-primary mb-4 pb-2 border-b border-border">
              Add New Shipping Address
            </h3>

            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-bold text-text-secondary uppercase mb-1">Phone *</label>
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
                  placeholder="Apartment, Suite (Optional)"
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
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Country *</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full p-2.5 bg-surface-secondary/50 border border-border rounded-xl text-sm text-text-tertiary cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-secondary uppercase mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Bus Stand"
                  className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chkDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-accent accent-accent rounded"
                />
                <label htmlFor="chkDefault" className="text-xs font-semibold text-text-primary">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-accent text-gray-950 font-bold rounded-xl hover:opacity-90"
                >
                  {formLoading ? 'Saving...' : 'Save & Select'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
