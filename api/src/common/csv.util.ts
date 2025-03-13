export function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values: string[] = headers.map((header: string) => {
      let value = row[header];
      if (value === null || value === undefined) {
        value = '';
      } else {
        value = value.toString();
        if (/[",\n]/.test(value)) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}
