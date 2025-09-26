import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@shared/types';
import { Link } from 'react-router-dom';
import { Package, Inbox, SearchX } from 'lucide-react';
interface SearchResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResult[];
  query: string;
}
export function SearchResultsDialog({ isOpen, onClose, results, query }: SearchResultsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search Results</DialogTitle>
          <DialogDescription>
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {results.length > 0 ? (
            <div className="space-y-3 py-4">
              {results.map((result) => (
                <div key={`${result.binId}-${result.itemId}`} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{result.itemName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Qty: {result.itemQuantity}</span> in bin: <span className="font-medium">{result.binName}</span>
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" onClick={onClose}>
                    <Link to={`/bins/${result.binId}`}>
                      <Inbox className="mr-2 h-4 w-4" /> View Bin
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchX className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
              <h3 className="mt-4 text-xl font-semibold">No Results Found</h3>
              <p className="mt-1 text-slate-500">We couldn't find any items matching your search.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}