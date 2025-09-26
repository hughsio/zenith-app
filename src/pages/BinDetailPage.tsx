import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Bin, Item } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { QrCodeDisplay } from '@/components/QrCodeDisplay';
import { ItemDialog, ItemFormData } from '@/components/ItemDialog';
import { BinDialog } from '@/components/BinDialog';
import { EmptyState } from '@/components/EmptyState';
import { BarcodeScannerDialog } from '@/components/BarcodeScannerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, ChevronLeft, Package, List, Loader2, X, ScanLine, Pencil } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
export function BinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isBinDialogOpen, setIsBinDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { data: bin, isLoading, error } = useQuery<Bin>({
    queryKey: ['bin', id],
    queryFn: () => api(`/api/bins/${id}`),
    enabled: !!id,
  });
  const { mutate: updateBin, isPending: isUpdating } = useMutation({
    mutationFn: (updatedBin: Bin) => api<Bin>(`/api/bins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedBin),
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(['bin', id], data);
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      toast.success('Bin updated successfully!');
      setIsBinDialogOpen(false);
      setIsItemDialogOpen(false);
      setEditingItem(null);
      setSelectedItems(new Set());
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });
  const { mutate: deleteBin, isPending: isDeleting } = useMutation({
    mutationFn: () => api(`/api/bins/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Bin deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      navigate('/');
    },
    onError: (err) => {
      toast.error(`Deletion failed: ${err.message}`);
    },
  });
  const handleSaveItem = (itemData: ItemFormData) => {
    if (!bin) return;
    let newItems: Item[];
    if (editingItem) {
      newItems = bin.items.map(i => i.id === editingItem.id ? { ...i, ...itemData } : i);
    } else {
      newItems = [...bin.items, { id: uuidv4(), ...itemData }];
    }
    updateBin({ ...bin, items: newItems });
  };
  const handleBarcodeScan = (scannedText: string) => {
    if (!bin) return;
    toast.success(`Scanned: ${scannedText}`);
    const newItem: Item = {
      id: uuidv4(),
      name: scannedText, // Using the scanned text as the item name
      quantity: 1,
    };
    const newItems = [...bin.items, newItem];
    updateBin({ ...bin, items: newItems });
  };
  const handleDeleteItem = (itemId: string) => {
    if (!bin) return;
    const newItems = bin.items.filter(i => i.id !== itemId);
    updateBin({ ...bin, items: newItems });
  };
  const handleBulkDelete = () => {
    if (!bin || selectedItems.size === 0) return;
    const newItems = bin.items.filter(item => !selectedItems.has(item.id));
    updateBin({ ...bin, items: newItems });
  };
  const handleSaveBin = (binData: { name: string; description?: string }) => {
    if (!bin) return;
    updateBin({ ...bin, ...binData });
  };
  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  const allItemsSelected = useMemo(() => {
    return bin ? selectedItems.size === bin.items.length && bin.items.length > 0 : false;
  }, [selectedItems, bin]);
  const toggleSelectAll = () => {
    if (allItemsSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(bin?.items.map(item => item.id)));
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (error || !bin) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold text-red-600">Error loading bin</h2>
        <p className="mt-2 text-slate-500">{error?.message || 'The requested bin could not be found.'}</p>
        <Button asChild className="mt-6">
          <Link to="/"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  const totalQuantity = bin.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <div className="space-y-8">
        <div>
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link to="/"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{bin.name}</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{bin.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" onClick={() => setIsBinDialogOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the "{bin.name}" bin and all its items.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteBin()} disabled={isDeleting}>
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Items in Bin</CardTitle>
                  <CardDescription>A list of all items stored in this bin.</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditingItem(null); setIsItemDialogOpen(true); }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Add Manually</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsScannerOpen(true)}>
                      <ScanLine className="mr-2 h-4 w-4" />
                      <span>Scan Barcode</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {bin.items.length === 0 ? (
                  <EmptyState
                    icon={<Package className="h-full w-full" />}
                    title="This bin is empty"
                    description="Add your first item to get started."
                  />
                ) : (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <Checkbox id="select-all" checked={allItemsSelected} onCheckedChange={toggleSelectAll} className="mr-4" />
                      <label htmlFor="select-all" className="flex-1 font-medium text-sm">
                        {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select All'}
                      </label>
                      <AnimatePresence>
                        {selectedItems.size > 0 && (
                           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete Selected</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete {selectedItems.size} items?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone. Are you sure you want to permanently delete the selected items?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleBulkDelete} disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {bin.items.map((item) => (
                      <div key={item.id} className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <Checkbox checked={selectedItems.has(item.id)} onCheckedChange={() => toggleSelectItem(item.id)} className="mr-4" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{item.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Quantity: {item.quantity}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsItemDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the "{item.name}" item.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(item.id)} disabled={isUpdating}>
                                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Bin Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><List className="h-4 w-4" /> Item Types</span>
                  <span className="font-medium">{bin.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Package className="h-4 w-4" /> Total Units</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>
              </CardContent>
            </Card>
            <QrCodeDisplay binId={bin.id} binName={bin.name} />
          </div>
        </div>
      </div>
      <ItemDialog
        isOpen={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        isSaving={isUpdating}
      />
      <BinDialog
        isOpen={isBinDialogOpen}
        onClose={() => setIsBinDialogOpen(false)}
        onSave={handleSaveBin}
        bin={bin}
        isSaving={isUpdating}
      />
      <BarcodeScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleBarcodeScan}
      />
    </>
  );
}