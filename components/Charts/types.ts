export type DataPoint = { label?: string; x: number; y: number };

export type AuctionData = {
  color: {
    name: string;
    value: string;
  };
  domain: string;
  points: DataPoint[];
};
