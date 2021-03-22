import injected from '@snapshot-labs/lock/connectors/injected';
import fortmatic from '@snapshot-labs/lock/connectors/fortmatic';
import portis from '@snapshot-labs/lock/connectors/portis';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';
import torus from '@snapshot-labs/lock/connectors/torus';
import connectors from '@/helpers/connectors.json';
import { Account } from 'iotex-antenna/lib/account/account';
import sleepPromise from 'sleep-promise';
import Antenna from 'iotex-antenna';
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws';

const IOTEX_NET = process.env.NETWORK_URL || '';

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
  return account;
}

export async function authWithIopay(): Promise<Account> {
  const antenna = new Antenna(IOTEX_NET, {
    signer: new WsSignerPlugin()
  });
  await sleepPromise(3000);

  return antenna.iotx.accounts[0];
}

export async function signMessage(
  account: Account,
  message: string
): Promise<string> {
  // @ts-ignore
  return account.sign(message).toString('hex');
}

export default options;
