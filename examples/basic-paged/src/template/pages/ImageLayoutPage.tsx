import imgOptim from '@/utility/imgOptim'
import { Editing } from 'uhuu-components';

export default function ({ payload }) {
  const {listing} = payload ?? {};
  return (
  <div className="h-full w-full px-24 relative">

      <Editing.Editable className="aspect-[473/330] -ml-5" dialog={{ path: 'layout_image_1', imagePath: 'url', ratio: 473/330}}>
        <img className="w-full h-full object-cover" src={ imgOptim(payload?.layout_image_1?.url) } />
      </Editing.Editable>

      <div className="grid grid-cols-2 gap-4 pt-5">

          <Editing.Editable className="aspect-[285/206] -ml-24 mr-3" dialog={{ path: 'layout_image_2', imagePath: 'url', ratio: 285/206}}>
            <img className="w-full h-full object-cover" src={ imgOptim(payload?.layout_image_2?.url) } />
          </Editing.Editable>

          <Editing.Editable className="aspect-[230/160] -ml-2" dialog={{ path: 'layout_image_3', imagePath: 'url', ratio: 230/160}}>
            <img className="w-full h-full object-cover" src={ imgOptim(payload?.layout_image_3?.url) } />
          </Editing.Editable>

          <Editing.Editable className="aspect-[230/192] -ml-5 mr-3" dialog={{ path: 'layout_image_4', imagePath: 'url', ratio: 230/192}}>
            <img className="w-full h-full object-cover" src={ imgOptim(payload?.layout_image_4?.url) } />
          </Editing.Editable>

          <Editing.Editable className="aspect-[230/241] -mt-16 -ml-2" dialog={{ path: 'layout_image_5', imagePath: 'url', ratio: 230/241}}>
            <img className="w-full h-full object-cover" src={ imgOptim(payload?.layout_image_5?.url) } />
          </Editing.Editable>

      </div>
    </div>
  );
}
