import urlMetadata from "url-metadata"

export function getMetadata(link){
    return urlMetadata(link);
}