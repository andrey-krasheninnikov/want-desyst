import type { ComponentProps } from 'react';
import { Card, CardContent } from './ui/card.js';
import { cn } from './utils.js';

export type MediaCardProps = Omit<ComponentProps<'a'>, 'title' | 'children'> & {
  title: string; caption?: string; index?: number; headingLevel?: 2 | 3;
  image: { src: string; width: number; height: number; alt: string };
};
export function MediaCard({ title, caption, index, image, headingLevel = 3, className, ...props }: MediaCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return <article className="min-w-0"><Card className="gallery-card">
    <a className={cn('media-card-link', className)} {...props}>
      <div className="media-frame"><img {...image} loading="lazy" className="gallery-image" /></div>
      <CardContent className="media-card-caption">
        <div className="min-w-0"><Heading className="media-card-title">{title}</Heading>{caption && <p className="media-card-description">{caption}</p>}</div>
        {index !== undefined && <span aria-hidden="true" className="media-card-index">{String(index).padStart(2, '0')}</span>}
      </CardContent>
    </a>
  </Card></article>;
}
