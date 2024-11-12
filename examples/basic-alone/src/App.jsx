import { useState, useEffect } from 'react';
import { Page } from './template/Page'

// Define sample data for local development
import sampleData from './test/sample_data.json'

var defaultData = import.meta.env.DEV ? sampleData : null;

function App() {

	// path to look for images in the payload
	$uhuu.templateSetup({
	    options: {
	        imageGalleryPath : 'images' 
	    }
	});    

	// Initialize payload state to hold $uhuu payload changes
	const [payload, setPayload] = useState($uhuu.payload() || defaultData);

	// Listen $uhuu SDK events and update payload state to recent one.
	$uhuu.listen('payload', (data) => {				
		setPayload(data);
	});
	
	if(!payload) return <></>;

	return (
		<div>		
			<Page payload={payload} />
		</div>
	);
}

export default App;
