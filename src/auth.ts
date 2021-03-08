import injected from '@snapshot-labs/lock/connectors/injected';
import fortmatic from '@snapshot-labs/lock/connectors/fortmatic';
import portis from '@snapshot-labs/lock/connectors/portis';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';
import torus from '@snapshot-labs/lock/connectors/torus';
import connectors from '@/helpers/connectors.json';
import Antenna from 'iotex-antenna';
import { Account } from 'iotex-antenna/lib/account/account';

const IOTEX_NET = 'http://api.testnet.iotex.one:80';

const options: any = { connectors: [] };
const lockConnectors = {
  injected,
  fortmatic,
  portis,
  walletconnect,
  walletlink,
  torus
};

Object.entries(connectors).forEach((connector: any) => {
  options.connectors.push({
    key: connector[0],
    connector: lockConnectors[connector[0]],
    options: connector[1].options
  });
});

export async function createIotexAccount(): Promise<Account> {
  const antenna = new Antenna(IOTEX_NET);
  const account = antenna.iotx.accounts.create();
  return account;
}

export async function importIotexAccount(address: string): Promise<Account> {
  const anntenna = new Antenna(IOTEX_NET);
  const account = anntenna.iotx.accounts.addressToAccount(address);
  // const account = anntenna.iotx.accounts.privateKeyToAccount(privateKey);
  return account;
}

export default options;
