import FeaturesTable from "./components/FeaturesTable";
import { Editable, Static } from "uhuu-components";

export default function FeaturePage({ payload, pageNum, totalPages }) {
  
  return (
    <Static.FlowPage
      className="bg-white px-[14mm] pt-[8mm] pb-[6mm] text-gray-950"
      flowAreaClassName="mt-[8mm]"
      header={
        <Editable className="text-4xl" dialog={{ path: "feature_page_title" }}>
          {payload?.feature_page_title}
        </Editable>
      }
      footer={
        <footer className="mt-6 flex justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-500">
          <span>Uhuu.io</span>
          <span>{pageNum} / {totalPages}</span>
        </footer>
      }
    >
      <FeaturesTable payload={payload} />
    </Static.FlowPage>
  );
}
