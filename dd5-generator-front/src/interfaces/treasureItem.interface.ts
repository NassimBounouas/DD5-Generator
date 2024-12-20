export enum ETreasureType {
  COIN = 'COIN',
  INDIVIDUAL_TREASURE = 'INDIVIDUAL_TREASURE',
  RARE_OBJECT = 'RARE_OBJECT',
  MAGIC_OBJECT = 'MAGIC_OBJECT',
}

export enum ECoinType {
  PC = 'PC',
  PA = 'PA',
  PE = 'PE',
  PO = 'PO',
  PP = 'PP',
}

export interface ITreasureItemMetadata {
  coinType?: ECoinType;
}

export interface ITreasureItem {
  name: string;
  type: ETreasureType;
  price?: string;
  metaData?: ITreasureItemMetadata;
}
