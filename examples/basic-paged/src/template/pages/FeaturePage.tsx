import FeaturesTable from "./components/FeaturesTable";
import { Editable, Static } from "uhuu-components";

export default function FeaturePage({ payload, pageNum, totalPages }) {
  
  return (
    <Static.FlowPage
      className="bg-white p-[22mm] py-[10mm] text-gray-950"
      flowAreaClassName="mt-[8mm]"
      header={
        <Editable className="text-4xl" dialog={{ path: "feature_page_title" }}>
          {payload?.feature_page_title}
        </Editable>
      }    
    >
      <FeaturesTable payload={payload} />
    </Static.FlowPage>
  );
}
