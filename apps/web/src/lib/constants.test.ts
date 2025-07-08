import { TREASURY_CONFIG, SHARED_TREASURY_LIMITS, ERROR_MESSAGES } from './constants';

describe('Constants', () => {
  describe('TREASURY_CONFIG', () => {
    it('should have correct treasury configuration values', () => {
      expect(TREASURY_CONFIG.MAX_AMOUNT).toBe('2500');
      expect(TREASURY_CONFIG.DENOM).toBe('uxion');
      expect(TREASURY_CONFIG.DEFAULT_GAS_MULTIPLIER).toBe(1.5);
      expect(TREASURY_CONFIG.AUTO_GAS).toBe('auto');
    });
  });

  describe('SHARED_TREASURY_LIMITS', () => {
    it('should have correct shared treasury limits', () => {
      expect(SHARED_TREASURY_LIMITS.MAX_CONTRACTS).toBe(15);
      expect(SHARED_TREASURY_LIMITS.FUTURE_SLOTS_COUNT).toBe(5);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have descriptive error messages', () => {
      expect(ERROR_MESSAGES.MISSING_ENV_VARS).toBe('Missing required environment variables');
      expect(ERROR_MESSAGES.CLIENT_NOT_CONNECTED).toBe('Client is not connected');
      expect(ERROR_MESSAGES.TREASURY_CODE_ID_MISSING).toBe('TREASURY_CODE_ID is not defined');
      expect(ERROR_MESSAGES.USER_MAP_CODE_ID_MISSING).toBe('USER_MAP_CODE_ID is not defined');
      expect(ERROR_MESSAGES.RUM_CODE_ID_MISSING).toBe('RUM_CODE_ID is not defined');
      expect(ERROR_MESSAGES.FAUCET_ADDRESS_MISSING).toBe('FAUCET_ADDRESS is not defined');
    });
  });
});