import FeaturesTable from "./components/FeaturesTable";
import AgentInfo from "./components/AgentInfo";
import { Editable } from "uhuu-components";

export default function ({ payload }) {
  
  return (
         <div className="bg-center px-24 relative">
            <Editable className="text-4xl pt-7 mb-14" dialog={{ path: "feature_page_title" }}>{payload?.feature_page_title}</Editable>            
            <FeaturesTable payload={payload} />
            <AgentInfo payload={payload} />
        </div>
  );
}