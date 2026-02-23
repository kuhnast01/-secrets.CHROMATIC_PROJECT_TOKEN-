export enum ResourceType {
  Energy = 'Energy',
  Alloy = 'Alloy',
  Credits = 'Credits',
  Data = 'Data',
}

export interface Resource {
  type: ResourceType;
  amount: number;
  storageCap: number;
}
