import axios from 'axios';

/**
 * Equip a cosmetic by ID.
 * @param {string} cosmeticId - The ID of the cosmetic to equip.
 * @returns {Promise<{ success: boolean; message?: string; }>} Result of the equip operation.
 */
export async function equipCosmetic(cosmeticId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post('/cosmetics/equip', { cosmeticId });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || error.message || 'Failed to equip cosmetic' };
  }
}
