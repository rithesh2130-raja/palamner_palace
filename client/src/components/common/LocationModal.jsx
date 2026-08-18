import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { MapPin } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { useModal } from '../../context/ModalContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const LocationModal = () => {
  const { activeModal, closeModal } = useModal();
  const { location, updateLocation } = useLocationContext();
  const { showToast } = useToast();

  const [pincode, setPincode] = useState(location.pincode);
  const [city, setCity] = useState(location.city);

  const isOpen = activeModal === 'location';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }
    updateLocation(city || 'Palamner', pincode, 'Andhra Pradesh');
    showToast(`Delivery location updated to ${pincode}`, 'success');
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Select Delivery Location">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs">
          <MapPin className="w-5 h-5 shrink-0" />
          <span>Enter your delivery PIN code to check product availability and delivery timelines for Palamner region.</span>
        </div>

        <Input
          label="Pincode"
          type="text"
          maxLength={6}
          placeholder="e.g. 517408"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
        />

        <Input
          label="City / Region"
          type="text"
          placeholder="e.g. Palamner"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="md" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Apply Location
          </Button>
        </div>
      </form>
    </Modal>
  );
};
