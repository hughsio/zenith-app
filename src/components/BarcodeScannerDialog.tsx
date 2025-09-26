import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, AlertTriangle, XCircle } from 'lucide-react';
interface BarcodeScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}
const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdgePercentage = 0.7;
    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
};
export function BarcodeScannerDialog({ isOpen, onClose, onScanSuccess }: BarcodeScannerDialogProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      setError(null);
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;
      const startScanner = async () => {
        try {
          await scanner.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: qrboxFunction,
              aspectRatio: 1.0,
            },
            (decodedText, _decodedResult) => {
              onScanSuccess(decodedText);
              handleClose();
            },
            (_errorMessage) => {
              // handle scan error, usually ignored
            }
          );
        } catch (err: any) {
          console.error("Scanner start error:", err);
          setError(`Failed to start scanner: ${err.message || 'Unknown error'}. Please ensure camera permissions are granted.`);
        }
      };
      startScanner();
      return () => {
        handleClose();
      };
    }
  }, [isOpen]);
  const handleClose = () => {
    if (scannerRef.current && scannerRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
      scannerRef.current.stop().catch(err => {
        console.error("Failed to stop scanner:", err);
      }).finally(() => {
        scannerRef.current = null;
        onClose();
      });
    } else {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-50 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Scan Barcode
          </DialogTitle>
          <DialogDescription>
            Position the item's barcode within the frame.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div id="reader" className="w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 aspect-square"></div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}