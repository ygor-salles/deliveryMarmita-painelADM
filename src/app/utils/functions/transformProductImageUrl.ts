import { environment } from 'src/environments/environment';

const { productImagesServerUrl } = environment;

export default function transformProductImageUrl(link?: string): string {
  return `${productImagesServerUrl}${link}`;
}
