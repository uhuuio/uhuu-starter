import React from 'react';
import { ImageBleed, Editable } from 'uhuu-components';

export function Page({payload}) {  
  const { title, message, url } = payload
  return (
    <div className="p-6 mx-6">
      <Editable dialog={{ path: 'title' }}>
        <div className="font-bold text-4xl mt-9">{title}</div>
      </Editable>

      <Editable dialog={{ path: 'message', rows: 5, panelSize: '3xl' }}>
        <div className="text-base mt-9">{message}</div>
      </Editable>

      <ImageBleed 
        src={url} top={100} bottom={10} right={0} left={10}
        dialog={{
          path: 'url',
          type: 'image',
          ratio: 1
        }}
      />
    </div>
  );
}
