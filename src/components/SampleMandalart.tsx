import MandalartGrid from '@/components/MandalartGrid';
import { sampleMandalartForGrid } from '@/constants/sampleMandalart';

export function SampleMandalart() {
  return (
    <MandalartGrid
      data={sampleMandalartForGrid}
      readOnly={true}
      updateItemName={() => {}}
      updateItemStatus={() => {}}
      visualMode="preview"
      shape="circle"
    />
  );
}