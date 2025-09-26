import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Printer } from 'lucide-react';
import React from 'react';
interface QrCodeDisplayProps {
  binId: string;
  binName: string;
}
export function QrCodeDisplay({ binId, binName }: QrCodeDisplayProps) {
  const url = `${window.location.origin}/bins/${binId}`;
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code for ${binName}</title>
            <style>
              @media print {
                @page { size: 4in 6in; margin: 0.25in; }
                body { font-family: sans-serif; text-align: center; }
                h1 { font-size: 24pt; margin-bottom: 0.25in; }
                svg { width: 3in !important; height: 3in !important; }
                .no-print { display: none; }
              }
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              h1 { font-family: sans-serif; }
              button { margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; }
            </style>
          </head>
          <body>
            <h1>${binName}</h1>
            <div id="qr-code-container"></div>
            <button class="no-print" onclick="window.print()">Print</button>
          </body>
        </html>
      `);
      const qrContainer = printWindow.document.getElementById('qr-code-container');
      if (qrContainer) {
        const svgString = new XMLSerializer().serializeToString(
          document.getElementById('qr-code-svg-for-print')!
        );
        qrContainer.innerHTML = svgString;
      }
      printWindow.document.close();
      // Some browsers require a small delay for the content to render before printing
      setTimeout(() => {
        printWindow.focus();
        // printWindow.print();
        // printWindow.close();
      }, 250);
    }
  };
  return (
    <>
      {/* Hidden SVG for high-res printing */}
      <div style={{ display: 'none' }}>
        <QRCodeSVG
          id="qr-code-svg-for-print"
          value={url}
          size={300}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={true}
        />
      </div>
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <QrCode className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            <div>
              <CardTitle>Bin QR Code</CardTitle>
              <CardDescription>Scan to view contents.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <QRCodeSVG
              value={url}
              size={192}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2 h-4 w-4" /> Print Label
          </Button>
        </CardContent>
      </Card>
    </>
  );
}