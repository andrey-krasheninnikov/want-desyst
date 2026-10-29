import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Checkbox, Combobox, Pagination, Progress, FileUpload } from '../packages/react/src/index';

const paginationLabels = { navigation: 'Pages', previous: 'Previous', next: 'Next', pageSize: 'Rows', page: (page: number) => 'Page ' + page, results: (from: number, to: number, total: number) => `${from} to ${to} of ${total}` };

test('checkbox exposes its mixed state and native form name', () => {
  const html = renderToStaticMarkup(<Checkbox checked="indeterminate" name="selected" aria-label="Select rows" />);
  expect(html).toContain('aria-checked="mixed"');
  expect(html).toContain('name="selected"');
});

test('combobox submits the selected value and keeps its display label separate', () => {
  const html = renderToStaticMarkup(<Combobox label="Project" name="project" value="website" options={[{ value: 'website', label: 'Website' }]} emptyLabel="No matches" onValueChange={() => {}} />);
  expect(html).toContain('role="combobox"');
  expect(html).toContain('value="Website"');
  expect(html).toContain('type="hidden" name="project" value="website"');
  expect(html).toContain('aria-expanded="false"');
});

test('pagination handles empty results, invalid counts and an out-of-range page', () => {
  for (const totalItems of [0, -1, NaN]) {
    const html = renderToStaticMarkup(<Pagination page={99} pageSize={0} totalItems={totalItems} labels={paginationLabels} onChange={() => {}} />);
    expect(html).toContain('0 to 0 of 0');
    expect(html).toContain('aria-current="page"');
    expect(html.match(/disabled=""/g)?.length).toBe(2);
  }
  const html = renderToStaticMarkup(<Pagination page={999} pageSize={10} totalItems={123} labels={paginationLabels} onChange={() => {}} />);
  expect(html).toContain('121 to 123 of 123');
  expect(html).toContain('aria-label="Page 13" aria-current="page"');
  expect(html.match(/aria-label="Page /g)?.length).toBe(5);
});

test('progress clamps determinate values and exposes indeterminate semantics', () => {
  const full = renderToStaticMarkup(<Progress label="Upload" value={200} max={10} />);
  expect(full).toContain('aria-valuenow="10"');
  expect(full).toContain('aria-valuemax="10"');
  const invalid = renderToStaticMarkup(<Progress label="Upload" value={-1} max={0} />);
  expect(invalid).toContain('aria-valuenow="0"');
  expect(invalid).toContain('aria-valuemax="100"');
  const waiting = renderToStaticMarkup(<Progress label="Waiting" value={null} />);
  expect(waiting).not.toContain('aria-valuenow');
  expect(waiting).toContain('data-state="indeterminate"');
});

test('file selection is SSR safe and preserves disabled single-file configuration', () => {
  const html = renderToStaticMarkup(<FileUpload label="Files" files={[]} onFilesChange={() => {}} multiple={false} disabled accept=".txt"
    labels={{ choose: 'Choose', drop: 'Drop files', remove: name => 'Remove ' + name, invalidType: name => name, tooLarge: name => name, tooMany: max => String(max) }} />);
  expect(html).toContain('accept=".txt"');
  expect(html).toContain('disabled=""');
  expect(html).not.toContain('multiple=""');
  expect(html).not.toContain('blob:');
});
