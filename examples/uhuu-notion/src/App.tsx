import { useState, useEffect } from 'react';
import { NotionPage } from './template/NotionPage'
import { EditorShell } from 'uhuu-components';
import dayjs from 'dayjs';

const { InteractiveModeProvider, TemplateDataProvider, PageEditor } = EditorShell;

const isDev = import.meta.env.DEV;

const templateConfig = {
  pages: {
    notion: {
      label: 'Notion',
      component: NotionPage,
      hasFlow: true,
    },
  },
  initial: ['notion'],
};

// Define sample data for local development (payload.notion = Notion API response)
import sampleData from './../test/sample_data.json'

// use sample data for local development.
var defaultData = import.meta.env.DEV ? sampleData : null;

// Template setup with preprocess to initialize header with default values if undefined
$uhuu.templateSetup({
  preprocess: (payload) => {
    if (!payload) return payload;

    // Check if header is undefined (not set)
    if (payload.header === undefined) {
      const today = dayjs().format('MMM D, YYYY');
      return {
        ...payload
      };
    }

    return payload;
  }
});

// Do something after payload update.
function App() {

  // Initialize payload state to hold $uhuu payload changes
  const [payload, setPayload] = useState( $uhuu.payload() || defaultData );

  // Listen $uhuu SDK events and update payload state to recent one.
  useEffect(() => $uhuu.listen('payload', (data) => setPayload(data)), []);

  if(!payload) return <></>;

  return (
    <InteractiveModeProvider defaultInteractive={true} enableDevTools={isDev}>
      <TemplateDataProvider payload={payload} onPayloadChange={setPayload}>
        <PageEditor
          templateConfig={templateConfig}
          pageFormat={{ format: "A4", bleed: 3 }}
          renderOverlay={() => null}
        />
      </TemplateDataProvider>
    </InteractiveModeProvider>
  );
}

export default App
