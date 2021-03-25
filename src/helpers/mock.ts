export const getScores = async (
  key: string,
  strategies: any[],
  network: string,
  provider: string,
  addresses: any[]
) => [{ '1': 1000, '2': 100 }];

export const getBlockNumber = (provider: string) => {
  return 10;
};

export const getProvider = (network: string) => {
  return 'test.iotex';
};
