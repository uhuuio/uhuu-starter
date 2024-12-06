import CoverPage from "./pages/CoverPage";
import ImageLayoutPage from "./pages/ImageLayoutPage";
import FloorPage from "./pages/FloorPage";
import FeaturePage from "./pages/FeaturePage";

export function Template({ payload }) {

    return (
        <>
            {/* Page1 : Cover Page */}
            <CoverPage payload={payload} />

            {/* Page2 : Image Layout */}
            <ImageLayoutPage payload={payload} />

            {/* Page3 : Floor Plan */}
            <FloorPage payload={payload} />

            {/* Page4 : Features and Agent Info */}
            <FeaturePage payload={payload} />
        </>
    );
}