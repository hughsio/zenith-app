import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Bin, SearchResult } from '@shared/types';
import { Button } from '@/components/ui/button';
import { BinCard } from '@/components/BinCard';
import { BinDialog } from '@/components/BinDialog';
import { SearchBar } from '@/components/SearchBar';
import { SearchResultsDialog } from '@/components/SearchResultsDialog';
import { EmptyState } from '@/components/EmptyState';
import { PlusCircle, Archive, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
type BinsResponse = { items: Bin[] };
export function HomePage() {
  const queryClient = useQueryClient();
  const [isBinDialogOpen, setIsBinDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { data: binsData, isLoading, error } = useQuery<BinsResponse>({
    queryKey: ['bins'],
    queryFn: () => api('/api/bins'),
  });
  const { mutate: createBin, isPending: isCreating } = useMutation({
    mutationFn: (newBin: { name: string; description?: string }) => api<Bin>('/api/bins', {
      method: 'POST',
      body: JSON.stringify(newBin),
    }),
    onSuccess: () => {
      toast.success('Bin created successfully!');
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      setIsBinDialogOpen(false);
    },
    onError: (err) => {
      toast.error(`Failed to create bin: ${err.message}`);
    },
  });
  const { mutate: searchItems, isPending: isSearching } = useMutation<SearchResult[], Error, string>({
    mutationFn: (query: string) => api(`/api/bins/search?q=${encodeURIComponent(query)}`),
    onSuccess: (data, query) => {
      setSearchResults(data);
      setSearchQuery(query);
      setIsSearchDialogOpen(true);
    },
    onError: (err) => {
      toast.error(`Search failed: ${err.message}`);
    },
  });
  const bins = binsData?.items ?? [];
  return (
    <>
      <div className="space-y-12">
        <header className="flex flex-col items-center justify-between gap-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Zenith</motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-500 dark:text-slate-400 mt-2">Your elegant storage organization system.</motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <SearchBar onSearch={searchItems} isSearching={isSearching} />
            <Button id="add-new-bin-button" size="lg" onClick={() => setIsBinDialogOpen(true)} className="w-full sm:w-auto flex-shrink-0 h-12">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Bin
            </Button>
          </motion.div>
        </header>
        <section>
          {isLoading && (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
          )}
          {error && (
            <div className="text-center py-24 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              <h3 className="text-xl font-semibold">An error occurred</h3>
              <p className="mt-2">{error.message}</p>
            </div>
          )}
          {!isLoading && !error && bins.length === 0 && (
            <EmptyState
              icon={<Archive className="h-full w-full" />}
              title="No Bins Found"
              description="Get started by creating your first storage bin."
            >
              <Button onClick={() => setIsBinDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Bin
              </Button>
            </EmptyState>
          )}
          {!isLoading && !error && bins.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {bins.map((bin) => (
                  <motion.div key={bin.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                    <BinCard bin={bin} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
        <footer className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Built with ❤️ at Cloudflare
        </footer>
      </div>
      <BinDialog
        isOpen={isBinDialogOpen}
        onClose={() => setIsBinDialogOpen(false)}
        onSave={createBin}
        isSaving={isCreating}
      />
      <SearchResultsDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        results={searchResults}
        query={searchQuery}
      />
    </>
  );
}