import { useState, useEffect, useRef } from 'react';
import { Template } from './template/Template'
import {PagedPreview} from "@uhuu/components";

// Setup uhuuu editor behaviours for template
import TemplateSetup from './template/TemplateSetup.js'
TemplateSetup();

// Define sample data for local development
import sampleData from './test/sample_data.json'

// use sample data for local development.
var defaultData = import.meta.env.DEV ? sampleData : null;

// Do something after payload update.
function App() {

  // Access PagedPreview to re-layout on change.
  const previewRef = useRef();

  // Initialize payload state to hold $uhuu payload changes
  const [payload, setPayload] = useState( $uhuu.payload() || defaultData );

  // Listen $uhuu SDK events and update payload state to recent one.
  $uhuu.listen('payload', (data) => {
    setPayload(data);
  });

  useEffect(() => {
    previewRef?.current?.layout(); // check if current ref exists
  }, [payload]);
  
  if(!payload) return <></>;

  return (
    <PagedPreview ref={previewRef}>
        <Template payload={payload} />
    </PagedPreview>
  );
}

export default App
