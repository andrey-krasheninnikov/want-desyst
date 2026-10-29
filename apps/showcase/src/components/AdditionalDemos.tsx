import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button, Checkbox, Combobox, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  FileUpload, Pagination, Popover, PopoverTrigger, PopoverContent, PopoverClose, Progress,
  Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell, Skeleton,
  ToastProvider, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose, ToastViewport,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Input } from '@want-foundation/desyst-react';
import { Section } from './Section';

function DemoCheckbox() {
  const [checked, setChecked] = useState([false, true]);
  const all = checked.every(Boolean);
  return <div className="demo-stack">
    <label className="demo-check"><Checkbox checked={all ? true : checked.some(Boolean) ? 'indeterminate' : false} onCheckedChange={value => setChecked([Boolean(value), Boolean(value)])} />Select all examples</label>
    {checked.map((value, index) => <label key={index} className="demo-check"><Checkbox checked={value} onCheckedChange={next => setChecked(current => current.map((item, at) => at === index ? Boolean(next) : item))} />Example {index + 1}</label>)}
    <label className="demo-check"><Checkbox disabled />Disabled checkbox</label>
  </div>;
}

function DemoOverlays() {
  const [result, setResult] = useState('');
  return <><div className="demo-actions">
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary">Example actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent><DropdownMenuItem onSelect={() => setResult('Edit selected.')}>Edit example</DropdownMenuItem><DropdownMenuItem onSelect={() => setResult('Copy selected.')}>Copy example</DropdownMenuItem><DropdownMenuItem disabled>Archive unavailable</DropdownMenuItem></DropdownMenuContent>
    </DropdownMenu>
    <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="About these examples"><Info aria-hidden="true" /></Button></TooltipTrigger><TooltipContent>These examples use local state.</TooltipContent></Tooltip></TooltipProvider>
    <Popover><PopoverTrigger asChild><Button variant="outline">Example settings</Button></PopoverTrigger>
      <PopoverContent aria-label="Example settings"><div className="demo-stack"><h3>Example settings</h3><label htmlFor="example-note">Note</label><Input id="example-note" defaultValue="Local preview" /><PopoverClose asChild><Button variant="secondary">Close settings</Button></PopoverClose></div></PopoverContent>
    </Popover>
  </div><p className="demo-status" role="status">{result}</p></>;
}

function DemoFeedback() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(65);
  const [result, setResult] = useState('');
  return <ToastProvider label="Notification" duration={5000}><div className="demo-stack">
    <div className="demo-actions"><Button type="button" onClick={() => setOpen(true)}>Show notification</Button><Button type="button" variant="secondary" onClick={() => setProgress(value => value >= 100 ? 0 : Math.min(100, value + 10))}>Advance progress</Button></div>
    <Progress label="Example progress" value={progress} /><p>{progress}%</p>
    <Progress label="Indeterminate example" value={null} />
    <p className="demo-status" role="status">{result}</p>
    <Toast open={open} onOpenChange={setOpen}><div><ToastTitle>Example saved</ToastTitle><ToastDescription>This change is local to the showcase.</ToastDescription></div>
      <ToastAction asChild altText="Undo the local example change"><Button type="button" variant="secondary" onClick={() => setResult('Example change undone.')}>Undo example</Button></ToastAction>
      <ToastClose aria-label="Dismiss notification"><X aria-hidden="true" /></ToastClose>
    </Toast><ToastViewport label="Notifications ({hotkey})" />
  </div></ToastProvider>;
}

function DemoCombobox() {
  const [value, setValue] = useState('design');
  return <Combobox label="Project" name="project" value={value} onValueChange={setValue} emptyLabel="No projects found." placeholder="Search projects"
    options={[{ value: 'design', label: 'Design system' }, { value: 'website', label: 'Website' }, { value: 'mobile', label: 'Mobile app' }, { value: 'archive', label: 'Archived project', disabled: true }]} />;
}

function DemoTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const rows = Array.from({ length: 23 }, (_, index) => ({ id: index + 1, name: 'Example ' + (index + 1), status: index % 2 ? 'Draft' : 'Ready' }));
  return <div className="demo-stack"><Button type="button" variant="secondary" onClick={() => setLoading(value => !value)}>Toggle table loading</Button>
    <Table aria-busy={loading}><TableCaption>Local project examples</TableCaption><TableHeader><TableRow><TableHead>Select</TableHead><TableHead>Project</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody>{loading ? <TableRow><TableCell colSpan={3}><Skeleton className="h-11 w-full" /><span role="status" className="sr-only">Loading table preview</span></TableCell></TableRow> : rows.slice((page - 1) * pageSize, page * pageSize).map(row => <TableRow key={row.id} data-state={selected.includes(row.id) ? 'selected' : undefined}><TableCell><Checkbox aria-label={'Select example ' + row.id} checked={selected.includes(row.id)} onCheckedChange={value => setSelected(current => value ? [...current, row.id] : current.filter(id => id !== row.id))} /></TableCell><TableHead scope="row">{row.name}</TableHead><TableCell>{row.status}</TableCell></TableRow>)}</TableBody>
    </Table>
    <Pagination page={page} pageSize={pageSize} totalItems={rows.length} pageSizeOptions={[5, 10, 20]} onChange={(nextPage, nextSize) => { setPage(nextPage); setPageSize(nextSize); }}
      labels={{ navigation: 'Project pages', previous: 'Previous page', next: 'Next page', pageSize: 'Rows per page', page: value => 'Page ' + value, results: (from, to, total) => `${from} to ${to} of ${total} examples` }} />
  </div>;
}

function DemoFiles() {
  const [files, setFiles] = useState<File[]>([]);
  return <FileUpload label="Attachments" files={files} onFilesChange={setFiles} accept="image/*,.txt" maxSize={1024 * 1024} maxFiles={3}
    labels={{ choose: 'Choose attachments', drop: 'Drop images or text files here. Up to 3 files, 1 MB each. Files stay in this page.', remove: name => 'Remove ' + name, invalidType: name => name + ': choose an image or text file.', tooLarge: name => name + ': maximum size is 1 MB.', tooMany: max => 'Choose at most ' + max + ' files.' }} />;
}

export function AdditionalDemos() {
  return <>
    <Section title="Checkboxes"><DemoCheckbox /></Section>
    <Section title="Menus, tooltips and popovers"><DemoOverlays /></Section>
    <Section title="Notifications and progress"><DemoFeedback /></Section>
    <Section title="Searchable combobox"><DemoCombobox /></Section>
    <Section title="Table and pagination"><DemoTable /></Section>
    <Section title="File selection"><DemoFiles /></Section>
  </>;
}
