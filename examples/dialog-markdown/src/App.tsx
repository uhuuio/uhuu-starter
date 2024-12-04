import { useState, useEffect } from 'react';
import { MarkdownPage } from './template/MarkdownPage'
import { Dynamic } from 'uhuu-components';
const { Pagination } = Dynamic;
import printCssRaw from './print.css?raw';

// Define sample data for local development
import sampleData from './test/sample_data.json'

// use sample data for local development.
var defaultData = import.meta.env.DEV ? sampleData : null;

// Do something after payload update.
function App() {

  // Initialize payload state to hold $uhuu payload changes
  const [payload, setPayload] = useState( $uhuu.payload() || defaultData );

  // Listen $uhuu SDK events and update payload state to recent one.
  $uhuu.listen('payload', (data) => setPayload(data));
  
  if(!payload) return <></>;

  return (
    <Pagination setup={{ format: "A4", printCssRaw }}>
        <MarkdownPage payload={payload} />
    </Pagination>
  );
}

export default App
