import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react';
import { ArrowLeft, ArrowRight, UserRound } from 'lucide-react';
import { carouselScroll, scrollCarousel } from './carousel-scroll.js';
import { Button } from './ui/button.js';

export type CommentAction = { id: string; label: string; disabled?: boolean; icon?: ComponentType<SVGProps<SVGSVGElement>> };
export type CommentItem = { id: string; author: string; text: string; own?: boolean; createdAt?: { dateTime: string; label: string }; actions?: CommentAction[] };
export type CommentFeedProps = {
  comments: CommentItem[]; busy?: boolean;
  labels: { title: string; empty: string; previous: string; next: string; readMore: string; collapse: string };
  onAction: (commentId: string, actionId: string) => void;
};
export function CommentFeed({ comments, labels, busy = false, onAction }: CommentFeedProps) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState({ at: 1, total: 1 });
  const step = useRef(0);
  useEffect(() => {
    const element = track.current!;
    const update = () => {
      const card = element.querySelector('article')?.getBoundingClientRect();
      if (!card) { setPage({ at: 1, total: 1 }); return; }
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const count = Math.max(1, Math.round((element.clientWidth + gap) / (card.width + gap)));
      step.current = count * (card.width + gap);
      const total = Math.max(1, Math.ceil(comments.length / count));
      const { offset, max } = carouselScroll(element);
      setPage({ at: offset >= max - 2 ? total : Math.min(total, Math.round(offset / step.current) + 1), total });
    };
    const observer = new ResizeObserver(update); observer.observe(element);
    element.addEventListener('scroll', update, { passive: true }); update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, [comments.length]);
  const move = (direction: number) => scrollCarousel(track.current!, (page.at - 1 + direction) * step.current);
  return <div data-comment-carousel>
    <div ref={track} className="comment-feed" role="group" tabIndex={0} aria-label={labels.title}>
      {comments.length === 0 ? <p className="text-muted-foreground">{labels.empty}</p> : comments.map(item => <article key={item.id} className="comment-row">
        <span className="comment-avatar" data-own={item.own} aria-hidden="true"><UserRound /></span>
        <div className="min-w-0"><div className="comment-meta"><strong>{item.author}</strong>{item.createdAt !== undefined && <time dateTime={item.createdAt.dateTime}>{item.createdAt.label}</time>}</div>
          {item.text.length > 240 || item.text.split('\n').length > 6 ? <details className="comment-disclosure">
            <summary><span dir="auto" className="comment-excerpt" aria-hidden="true">{item.text}</span><span className="comment-read">{labels.readMore}</span><span className="comment-collapse">{labels.collapse}</span></summary>
            <p dir="auto" className="comment-text">{item.text}</p>
          </details> : <p dir="auto" className="comment-text">{item.text}</p>}
          <div className="comment-actions">{item.actions?.map(({ id, label, disabled, icon: Icon }) => <Button key={id} type="button" variant="ghost" size="sm" disabled={busy || disabled} onClick={() => onAction(item.id, id)}>
            {Icon && <Icon data-icon="inline-start" aria-hidden="true" />}{label}
          </Button>)}</div>
        </div>
      </article>)}
    </div>
    {comments.length > 0 && <nav className="carousel-pagination" aria-label={labels.title}>
      <Button variant="secondary" size="icon" disabled={page.at === 1} onClick={() => move(-1)} aria-label={labels.previous}><ArrowLeft aria-hidden="true" /></Button>
      <output dir="ltr" aria-live="polite">{page.at} / {page.total}</output>
      <Button variant="secondary" size="icon" disabled={page.at === page.total} onClick={() => move(1)} aria-label={labels.next}><ArrowRight aria-hidden="true" /></Button>
    </nav>}
  </div>;
}
