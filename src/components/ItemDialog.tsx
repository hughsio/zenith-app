import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Item } from '@shared/types';
import { useEffect } from 'react';
const itemSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required.' }),
  quantity: z.coerce.number().int().min(1, { message: 'Quantity must be at least 1.' }),
});
export type ItemFormData = z.infer<typeof itemSchema>;
interface ItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
  item?: Item | null;
  isSaving: boolean;
}
export function ItemDialog({ isOpen, onClose, onSave, item, isSaving }: ItemDialogProps) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset({
          name: item.name,
          quantity: item.quantity,
        });
      } else {
        form.reset({
          name: '',
          quantity: 1,
        });
      }
    }
  }, [item, form, isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-50 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details for this item.' : 'Add a new item to this bin.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Red Scarf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}