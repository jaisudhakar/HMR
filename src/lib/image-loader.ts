type LoaderArgs = { src: string; width: number; quality?: number };

/** Pexels photos are resized by the Pexels CDN; local files are served as-is. */
export default function imageLoader({ src, width }: LoaderArgs) {
  if (src.startsWith('https://images.pexels.com/')) {
    return `${src}?auto=compress&cs=tinysrgb&w=${width}`;
  }
  return `${src}?w=${width}`;
}
