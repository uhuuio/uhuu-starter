import nl2br from '@/utility/nl2br';
import { useTranslation } from 'react-i18next';
import imgOptim from '@/utility/imgOptim'

export default function (props: any) {
    const { payload } = props;

    const { t, i18n } = useTranslation();
    const listing = payload.listing;

    const agentPhoto = () => {
        return imgOptim(listing.contact.photo_default);
    }

    return <div className="flex items-center mt-6 page-break text-sm">
        {listing.contact.photo_default ?
            <div className="aspect-[310/280] w-[11.5rem] mr-5">
            <img className="w-full h-full object-cover object-left object-top" src={agentPhoto()} />
        </div>
        : <div className="w-40 h-full block mr-5" />}

        <div className="w-full max-w-sm pb-1">                    
            <div>{listing.contact.message ? nl2br(listing.contact.message) : nl2br(t('contact-message'))}</div>            
            <div className="pt-3 mt-5">{listing.contact.pba__listing_agent_firstname__c} {listing.contact.pba__listing_agent_lastname__c}</div>
            <div>{listing.contact.pba__listing_agent_phone__c}</div>
            <div><a href={'mailto:'+ listing.contact.wp_emaildirect__c}>{listing.contact.wp_emaildirect__c}</a></div>
        </div>
    </div>;

}