export type RawNameCarrier = {
  name?: string;
  subject?: string;
  objective?: string;
  action?: string;
};

export const resolveMandalartItemName = (item: RawNameCarrier | null | undefined): string => {
  if (!item) return '';
  return item.name ?? item.subject ?? item.objective ?? item.action ?? '';
};
