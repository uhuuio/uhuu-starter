import FeaturesTable from "./components/FeaturesTable";
import { Editing, Flow } from "uhuu-components";

export default function FeaturePage({ payload, pageNum, totalPages }) {
  
  return (
    <Flow.Page
      className="bg-white p-[22mm] py-[10mm] text-gray-950"
      flowAreaClassName="mt-[8mm]"
      header={
        <Editing.Editable className="text-4xl" dialog={{ path: "feature_page_title" }}>
          {payload?.feature_page_title}
        </Editing.Editable>
      }    
    >
      <FeaturesTable payload={payload} />
    </Flow.Page>
  );
}
