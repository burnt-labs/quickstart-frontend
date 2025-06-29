export enum CONTRACT_TYPES {
  USER_MAP = "user-map",
  RUM = "rum",
}

export type ContractType = (typeof CONTRACT_TYPES)[keyof typeof CONTRACT_TYPES];

export const DEFAULT_CONTRACT_TYPE: ContractType = CONTRACT_TYPES.USER_MAP;