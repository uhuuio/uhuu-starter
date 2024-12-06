import imgOptim from '@/utility/imgOptim'
import { Editable } from "uhuu-components";
export default function ({ payload }) {
    
    return <>
    <div className="page-break-after relative">
        <div className="flex flex-col w-full px-24">
        {payload.floor_image_1 &&
            <div className="page-break-inside-avoid">
                <Editable className="max-w-2xl text-4xl pb-4 pt-4 mt-2 truncate" dialog={{ path: 'floor_image_1', subPath: 'title' }}>
                    { payload.floor_image_1?.title }
                </Editable>
                <Editable className="aspect-[16/10]" dialog={{ path: 'floor_image_1', imagePath: 'url', ratio: 16/10}}>
                    <img className="w-full h-full object-contain" src={ imgOptim(payload.floor_image_1?.url) } />
                </Editable>
            </div> }

        {payload.floor_image_2 &&
            <div className="page-break-inside-avoid">
                <Editable className="max-w-2xl text-4xl pb-4 pt-4 mt-2 truncate" dialog={{ path: 'floor_image_2', subPath: 'title' }}>
                    { payload.floor_image_2?.title }
                </Editable>
                <Editable className="aspect-[16/10]" dialog={{ path: 'floor_image_2', imagePath: 'url', ratio: 16/10}}>
                    <img className="w-full h-full object-contain" src={ imgOptim(payload.floor_image_2?.url) } />
                </Editable>
            </div> }

        </div>
    </div>
    </>
}