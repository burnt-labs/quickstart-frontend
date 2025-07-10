import { vi } from 'vitest';
import { executeBatchTransaction } from './transaction';
import { ERROR_MESSAGES } from './constants';

describe('executeBatchTransaction', () => {
  it('should throw error if client is not connected', async () => {
    await expect(
      executeBatchTransaction({
        client: null as any,
        messages: [],
        senderAddress: 'xion1test',
      })
    ).rejects.toThrow(ERROR_MESSAGES.CLIENT_NOT_CONNECTED);
  });

  it('should call signAndBroadcast with correct parameters', async () => {
    const mockClient = {
      signAndBroadcast: vi.fn().mockResolvedValue({ transactionHash: 'tx123' }),
    };
    
    const messages = [{ typeUrl: '/test', value: {} }];
    const senderAddress = 'xion1test';
    
    await executeBatchTransaction({
      client: mockClient as any,
      messages,
      senderAddress,
    });
    
    expect(mockClient.signAndBroadcast).toHaveBeenCalledWith(
      senderAddress,
      messages,
      'auto'
    );
  });
});