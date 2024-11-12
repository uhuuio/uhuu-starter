import FeaturesTable from "./components/FeaturesTable";
import AgentInfo from "./components/AgentInfo";

export default function ({ payload }) {
  
  return (
         <div className="bg-center px-24 relative">
            <div className="text-4xl pt-7 mb-14" data-uhuu={ JSON.stringify({path: "feature_page_title"})}>{payload?.feature_page_title}</div>            
            <FeaturesTable payload={payload} />
            <AgentInfo payload={payload} />
        </div>
  );
}