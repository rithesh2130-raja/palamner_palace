import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AIReelStudio from '../../components/studio/AIReelStudio.jsx';
import useAIStudioStore from '../../store/useAIStudioStore.js';
import { mockProducts } from '../../mock/index.js';

export const AIStudioPage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const setSelectedProduct = useAIStudioStore((state) => state.setSelectedProduct);

  useEffect(() => {
    if (productId) {
      const found = mockProducts.find((p) => p.id === productId || p._id === productId);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [productId, setSelectedProduct]);

  return <AIReelStudio />;
};

export default AIStudioPage;
