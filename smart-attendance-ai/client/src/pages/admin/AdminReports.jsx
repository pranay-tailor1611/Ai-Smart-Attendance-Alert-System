import { FileDown, Sheet } from 'lucide-react';
import { reportApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/dashboard/PageHeader';

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const { toast } = useToast();

  const exportFile = async (type) => {
    try {
      const fn = type === 'pdf' ? reportApi.pdf : reportApi.excel;
      const { data } = await fn();
      downloadBlob(data, type === 'pdf' ? 'attendance-report.pdf' : 'attendance-report.xlsx');
      toast(`${type.toUpperCase()} downloaded`, 'success');
    } catch {
      toast('Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Export institution-wide attendance with risk status and AI recommendations." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>PDF Report</CardTitle>
            <p className="text-sm text-muted-foreground">Student details, attendance %, risk status, AI recommendations</p>
          </CardHeader>
          <Button onClick={() => exportFile('pdf')}>
            <FileDown className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Excel Report</CardTitle>
            <p className="text-sm text-muted-foreground">Spreadsheet export for institutional records</p>
          </CardHeader>
          <Button onClick={() => exportFile('excel')}>
            <Sheet className="mr-2 h-4 w-4" /> Download Excel
          </Button>
        </Card>
      </div>
    </div>
  );
}
