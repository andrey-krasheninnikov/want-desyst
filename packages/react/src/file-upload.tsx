import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { File as FileIcon, X } from 'lucide-react';
import { Button } from './ui/button.js';
import { cn } from './utils.js';

export type FileUploadProps = {
  label: ReactNode;
  files: File[];
  onFilesChange: (files: File[]) => void;
  labels: { choose: string; drop: string; remove: (name: string) => string; invalidType: (name: string) => string; tooLarge: (name: string, maxSize: number) => string; tooMany: (maxFiles: number) => string };
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
};

function FilePreview({ file }: { file: File }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!file.type.startsWith('image/')) return;
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? <img className="ui-file-preview" src={url} alt="" /> : <FileIcon className="ui-file-preview" aria-hidden="true" />;
}

export function FileUpload({ label, files, onFilesChange, labels, accept, multiple = true, maxSize, maxFiles, disabled, id, className }: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  function add(incoming: File[]) {
    if (disabled || incoming.length === 0) return;
    const types = accept?.split(',').map(type => type.trim().toLowerCase()).filter(Boolean) ?? [];
    for (const file of incoming) {
      const matches = types.length === 0 || types.some(type => type.startsWith('.') ? file.name.toLowerCase().endsWith(type) : type.endsWith('/*') ? file.type.toLowerCase().startsWith(type.slice(0, -1)) : file.type.toLowerCase() === type);
      if (!matches) { setError(labels.invalidType(file.name)); return; }
      if (maxSize !== undefined && file.size > maxSize) { setError(labels.tooLarge(file.name, maxSize)); return; }
    }
    const next = multiple ? [...files, ...incoming] : incoming;
    const limit = multiple ? maxFiles : 1;
    if (limit !== undefined && next.length > limit) { setError(labels.tooMany(limit)); return; }
    setError('');
    onFilesChange(next);
  }

  return <div data-slot="file-upload" className={cn('ui-file-upload', className)}>
    <label htmlFor={inputId}>{label}</label>
    <div className="ui-file-drop" data-dragging={dragging && !disabled || undefined} data-disabled={disabled || undefined}
      onDragOver={event => { if (!disabled && event.dataTransfer.types.includes('Files')) { event.preventDefault(); setDragging(true); } }}
      onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
      onDrop={event => { event.preventDefault(); setDragging(false); add(Array.from(event.dataTransfer.files)); }}>
      <p id={inputId + '-help'}>{labels.drop}</p>
      <input ref={input} id={inputId} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} aria-describedby={inputId + '-help'} onChange={event => { add(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }} />
      <Button type="button" variant="secondary" disabled={disabled} aria-describedby={error ? inputId + '-error' : inputId + '-help'} onClick={() => input.current?.click()}>{labels.choose}</Button>
    </div>
    {error && <p id={inputId + '-error'} className="ui-file-error" role="alert">{error}</p>}
    {files.length > 0 && <ul className="ui-file-list">{files.map((file, index) => <li key={file.name + ':' + file.size + ':' + file.lastModified + ':' + file.type + ':' + index}>
      <FilePreview file={file} /><span className="ui-file-name">{file.name}</span>
      <Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label={labels.remove(file.name)} onClick={() => { setError(''); onFilesChange(files.filter((_, at) => at !== index)); }}><X aria-hidden="true" /></Button>
    </li>)}</ul>}
  </div>;
}
