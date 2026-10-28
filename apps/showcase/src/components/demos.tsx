import { useState } from 'react';
import { Mail, CodeXml, Flag } from 'lucide-react';
import { Button, ContactCard, CommentFeed, DateField, UrlField, Window, type CommentItem, type DateFieldLabels } from '@want-foundation/desyst-react';

const dateLabels: DateFieldLabels = {
  date: 'Choose date', datetime: 'Choose date and time', calendar: 'Calendar',
  previousYear: 'Previous year', previousMonth: 'Previous month',
  nextMonth: 'Next month', nextYear: 'Next year',
  hours: 'Hours', minutes: 'Minutes', today: 'Today', clear: 'Clear', apply: 'Apply'
};

export function DemoBriefElements() {
  const [day, setDay] = useState('2026-10-28');
  const [meeting, setMeeting] = useState('2026-10-28T10:30');
  const [url, setUrl] = useState('https://example.com');
  const [saved, setSaved] = useState('');
  return <Window title="Project planning" kicker="Shared controls"
    actions={<Button variant="secondary" onClick={() => setSaved('Example saved locally.')}>Save example</Button>}>
    <div className="demo-fields">
      <div className="demo-field-label"><span>Due date</span>
        <DateField mode="date" value={day} onChange={setDay} labels={dateLabels} locale="en-GB" ariaLabel="Due date" />
      </div>
      <div className="demo-field-label"><span>Meeting</span>
        <DateField mode="datetime" value={meeting} onChange={setMeeting} labels={dateLabels} locale="en-GB" ariaLabel="Meeting" />
      </div>
      <UrlField label="Reference URL" value={url} onChange={setUrl} openLabel="Open reference URL" />
      <p role="status" className="demo-status">{saved}</p>
    </div>
  </Window>;
}

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
    createdAt: { dateTime: new Date(Date.UTC(2026, 9, 13 + index)).toISOString(), label: (13 + index) + ' October 2026' },
    text: index === 2 ? 'A longer demonstration comment. '.repeat(18) : 'A demonstration comment for the component showcase.',
    actions: [{ id: 'report', label: reported.includes(String(index)) ? 'Saved' : 'Report', disabled: reported.includes(String(index)), icon: Flag }]
  }));
  return <><CommentFeed comments={comments} labels={{ title: 'Demo comments', empty: 'No comments yet.', previous: 'Previous comments', next: 'Next comments', readMore: 'Read comment', collapse: 'Collapse comment' }}
    onAction={(id, action) => { setReported(current => [...current, id]); setResult('Comment ' + id + ': ' + action); }} />
    <p role="status" className="demo-status">{result}</p></>;
}
