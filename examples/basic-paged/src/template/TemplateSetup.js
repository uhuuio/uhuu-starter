export default function() {
    // Initialize an Empty Setup Object:
    let setup = {};

    // Define 'preprocess' Configuration for various payload bindings.
    setup.preprocess = (payload) => {        
        // select default values 
        let overwrite = {
            cover_image : payload.cover_image ?? imgWithTagAtIndex(payload, {tag: 'Hauptbild', index:0} ),
            layout_image_1 : payload.layout_image_1 ?? imgWithTagAtIndex(payload, {tag: 'Bild', index:0} ),
            layout_image_2 : payload.layout_image_2 ?? imgWithTagAtIndex(payload, {tag: 'Bild', index:1} ),
            layout_image_3 : payload.layout_image_3 ?? imgWithTagAtIndex(payload, {tag: 'Bild', index:2} ),
            layout_image_4 : payload.layout_image_4 ?? imgWithTagAtIndex(payload, {tag: 'Bild', index:3} ),
            layout_image_5 : payload.layout_image_5 ?? imgWithTagAtIndex(payload, {tag: 'Bild', index:4} ),
            floor_image_1 : payload.floor_image_1 ?? imgWithTagAtIndex(payload, {tag: 'Grundriss', index:0, startsWith: true} ),
            floor_image_2 : payload.floor_image_2 ?? imgWithTagAtIndex(payload, {tag: 'Grundriss', index:1, startsWith: true} ),
            feature_page_title : 'Die wichtigsten Fakten im Überblick'
        }

        return {...payload, ...overwrite};
    }
    
    // Enable Options:
    setup.options = {
        imageGalleryPath : 'listing.media.images' // path to look for images in the payload
    }
    
    // Finally, call templateSetup function and pass the setup object as an argument. 
    $uhuu.templateSetup(setup);    
}


// Custom Filter Function: Logic to filter and retrieve images based on arguments
const imgWithTagAtIndex = (payload, args) => {
    const images = payload?.listing?.media?.images ?? [];        
    const {tag, index, startsWith} = args;
    let imagesWithTagCounter = 0        
    for (const image of images) {
        // old sample has strig tags, handle for testing
        if(typeof image.tags == 'string' ) image.tags = image.tags.split(';');

        if (image.tags) {
            for (const imageTag of image.tags) {
                if ((startsWith && imageTag.startsWith(tag)) || imageTag === tag) {
                    if (index === imagesWithTagCounter) {
                        return image
                    }
                    imagesWithTagCounter++
                }
            }
        }
    }        
    return null;
}

