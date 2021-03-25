import injected from '@snapshot-labs/lock/connectors/injected';
import fortmatic from '@snapshot-labs/lock/connectors/fortmatic';
import portis from '@snapshot-labs/lock/connectors/portis';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';
import torus from '@snapshot-labs/lock/connectors/torus';
import connectors from '@/helpers/connectors.json';
import { Account, IAccount } from 'iotex-antenna/lib/account/account';
import sleepPromise from 'sleep-promise';
import Antenna from 'iotex-antenna';
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws';
import { IRpcMethod } from 'iotex-antenna/lib/rpc-method/types';

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

let account: IAccount;
let antenna: Antenna;

export async function createIotexAccount(): Promise<Account> {
  const antenna = new Antenna(IOTEX_NET);
  const account = antenna.iotx.accounts.create();
  return account;
}

export async function importIotexAccount(address: string): Promise<Account> {
  const anntenna = new Antenna(IOTEX_NET);
  account = anntenna.iotx.accounts.addressToAccount(address);
  return account;
}

export async function authWithIopay(): Promise<Account> {
  antenna = new Antenna(IOTEX_NET, {
    signer: new WsSignerPlugin()
  });
  await sleepPromise(3000);
  account = antenna.iotx.accounts[0];
  return account;
}

export function getBlockNumber(): number {
  // return antenna;
  return 10;
}

export function getProvider(): IRpcMethod {
  return antenna.currentProvider();
}

export async function signMessage(message: string): Promise<string> {
  try {
    // @ts-ignore
    const signed = await account.sign(message);
    return signed.toString('hex');
  } catch (e) {
    return '';
  }
}

export default options;
