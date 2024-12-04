import React from 'react';
import { ImageBleed } from 'uhuu-components';

export function Page({ payload }) {
  const { title, message, url} = payload ?? {};

  return (    
      <div className="p-6 mx-6">
        <div className="font-bold text-4xl mt-9" data-uhuu onClick={() => $uhuu.editDialog({path:'title'}) }>{title}</div>        
        <div className="text-base mt-9" data-uhuu onClick={() => $uhuu.editDialog({path:'message', rows: 5, panelSize: '3xl'}) }>{message}</div>        
        <ImageBleed src={url} top={100} bottom={5} right={0} left={10} editDialog={{path: 'url', type:'image', ratio: 1}} />    
      </div>
  );
}
