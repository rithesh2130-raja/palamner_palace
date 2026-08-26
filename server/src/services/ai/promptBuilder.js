/**
 * ShopSphere E-Commerce AI Reel Prompt Engine
 * Constructs high-converting commercial video prompts for Wan 2.1 VACE 1.3B & AI video models.
 */

export function buildProductReelPrompt({ productName, brand, category, creatorPrompt }) {
  const brandPrefix = brand ? `${brand} ` : '';
  const itemTitle = productName ? productName.trim() : 'item';
  const categoryContext = category ? ` in ${category}` : '';

  const commercialFoundation = `Create a premium vertical social-commerce product advertisement for ${brandPrefix}${itemTitle}${categoryContext}. Preserve the visual identity and physical characteristics of the provided product reference. Use smooth cinematic camera movement, realistic studio commercial lighting, macro focus on materials, clean framing, and a strong product hero shot at the end. Do not add fake specifications, prices, logos, or labels that were not provided.`;

  if (!creatorPrompt || !creatorPrompt.trim()) {
    return commercialFoundation;
  }

  return `${commercialFoundation} Creator Direction: ${creatorPrompt.trim()}`;
}

export default buildProductReelPrompt;
