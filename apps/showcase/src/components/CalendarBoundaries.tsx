import { useState } from 'react';
import { DateField, type DateFieldLabels } from '@want-foundation/desyst-react';

const labels: DateFieldLabels = {
  date: 'Date', datetime: 'Date and time', calendar: 'Calendar', year: 'Year',
  previousYear: 'Previous year', previousMonth: 'Previous month', nextYear: 'Next year', nextMonth: 'Next month',
  hours: 'Hours', minutes: 'Minutes', today: 'Today', clear: 'Clear', apply: 'Apply',
};

export default function CalendarBoundaries() {
  const [value, setValue] = useState('0001-01-01');
  return <main>
    <h1>Calendar boundaries</h1>
    <label>Calendar value<input value={value} onChange={event => setValue(event.currentTarget.value)} /></label>
    <DateField mode="date" value={value} onChange={setValue} labels={labels} locale="en-GB" ariaLabel="Test date" />
    <output aria-label="Selected date">{value}</output>
  </main>;
}
