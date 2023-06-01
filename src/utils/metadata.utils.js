import urlMetadata from "url-metadata"

export function getMetadata(link){
    return urlMetadata(link);
}

export async function fetchMetadata(link) {
  return await urlMetadata(link);
}
