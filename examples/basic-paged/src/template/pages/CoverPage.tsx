import imgOptim from '@/utility/imgOptim'
import dayjs from "dayjs";
import localeDe from "dayjs/locale/de"; // With a custom alias for the locale object
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc)
dayjs.extend(timezone)
import { useTranslation } from 'react-i18next';

export default function ({ payload }) {
  console.log(payload);
  const { listing } = payload ?? {};
  const { t, i18n } = useTranslation();

  return (
      <div className="bg-center page-break-after px-11 relative">

            <div id="reference_nr" className="hidden">Referenz-Nr. {listing.detail.wp_propertyreferencenumber__c} - {dayjs().tz("Europe/Zurich").locale(localeDe).format("MMMM YYYY, H:m")} </div>

            <div className="flex mb-6">
                <img src="https://platform.uhuu.io/common/brand/logos/uhuu_owl.svg" className="h-16" />
            </div>

            <div className="aspect-[530/562]" data-uhuu={ JSON.stringify({ path: 'cover_image', imagePath: 'url', ratio: 530/562}) }>
                <img className="w-full h-full object-cover" src={ imgOptim(payload?.cover_image?.url) } />
            </div>

            <div className="pt-9">
                <h1 className="max-w-2xl text-4xl-cover pt-2" data-uhuu={ JSON.stringify({path: 'listing.marketing.' + t('wp_headlineinternetgerman__c') })}>{listing.marketing[t("wp_headlineinternetgerman__c")]}</h1>
                <div className="flex justify-center items-center mt-5 -ml-4 max-w-xl text-md">
                    <div>
                        <div data-uhuu={ JSON.stringify({path: 'listing.detail.pba__address_pb__c'})}>{listing.detail.pba__address_pb__c}</div>
                        <div>{listing.detail.pba__postalcode_pb__c} {listing.detail.pba__city_pb__c}</div>
                        <div className="hidden" data-uhuu={ JSON.stringify({paths: [{path: 'listing.detail.pba__postalcode_pb__c'}, {path: 'listing.detail.pba__city_pb__c'}] } )}>{listing.detail.pba__postalcode_pb__c} {listing.detail.pba__city_pb__c}</div>
                    </div>
                </div>
            </div>
        </div>
  );
}