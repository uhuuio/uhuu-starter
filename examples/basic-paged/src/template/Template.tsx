import { EditorShell } from "uhuu-components";
import CoverPage from "./pages/CoverPage";
import ImageLayoutPage from "./pages/ImageLayoutPage";
import FloorPage from "./pages/FloorPage";
import FeaturePage from "./pages/FeaturePage";

const { InteractiveModeProvider, TemplateDataProvider, PageEditor } = EditorShell;

const isDev = import.meta.env.DEV;

const templateConfig = {
    pages: {
        cover: { label: "Cover", component: CoverPage },
        image_layout: { label: "Images", component: ImageLayoutPage },
        floor_plan: { label: "Floor Plan", component: FloorPage },
        features: { label: "Features", component: FeaturePage, hasFlow: true },
    },
    initial: ["cover", "image_layout", "floor_plan", "features"],
};

export function Template({ payload, onPayloadChange }) {

    return (
        <InteractiveModeProvider defaultInteractive={true} enableDevTools={isDev}>
            <TemplateDataProvider payload={payload} onPayloadChange={onPayloadChange}>
                <PageEditor
                    templateConfig={templateConfig}
                    pageFormat={{ format: "A4" }}
                    renderOverlay={() => null}
                />
            </TemplateDataProvider>
        </InteractiveModeProvider>
    );
}
