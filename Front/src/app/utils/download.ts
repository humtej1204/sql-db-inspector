export function extractFilename(contentDisposition: string | null, defFilename?: string): string {
  if (!contentDisposition) return 'archivo';

  const filenameStar = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(contentDisposition);
  if (filenameStar?.[1]) {
    return decodeURIComponent(filenameStar[1]);
  }

  const filename = /filename\s*=\s*"?([^"]+)"?/i.exec(contentDisposition);
  if (filename?.[1]) {
    return filename[1];
  }

  return defFilename || 'archivo';
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'archivo';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
