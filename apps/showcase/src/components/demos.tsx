import { useState } from 'react';
import { Mail, CodeXml, Flag } from 'lucide-react';
import { ContactCard, CommentFeed, type CommentItem } from '@want-desyst/react';

export function DemoContact() {
  return <ContactCard name="Example Owner" subtitle="Demo product" actions={[
    { title: 'Email', detail: 'hello@example.com', href: 'mailto:hello@example.com', icon: Mail },
    { title: 'Source', detail: 'Want Desyst', href: 'https://github.com/andrey-krasheninnikov/want-desyst', icon: CodeXml }
  ]} />;
}
export function DemoComments() {
  const [reported, setReported] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const comments: CommentItem[] = Array.from({ length: 10 }, (_, index) => ({
    id: String(index), author: index === 0 ? 'You' : 'Guest ' + (index + 1), own: index === 0,
    createdAt: Date.UTC(2026, 9, 13 + index),
    text: index === 2 ? 'A longer demonstration comment. '.repeat(18) : 'A demonstration comment for the component showcase.',
    actions: [{ id: 'report', label: reported.includes(String(index)) ? 'Saved' : 'Report', disabled: reported.includes(String(index)), icon: Flag }]
  }));
  return <><CommentFeed locale="en" comments={comments} labels={{ title: 'Demo comments', empty: 'No comments yet.', previous: 'Previous comments', next: 'Next comments', readMore: 'Read comment', collapse: 'Collapse comment' }}
    onAction={(id, action) => { setReported(current => [...current, id]); setResult('Comment ' + id + ': ' + action); }} />
    <p role="status" className="demo-status">{result}</p></>;
}
