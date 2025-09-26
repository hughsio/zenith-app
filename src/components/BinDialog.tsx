import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bin } from '@shared/types';
import { useEffect } from 'react';
const binSchema = z.object({
  name: z.string().min(1, { message: 'Bin name is required.' }),
  description: z.string().optional(),
});
type BinFormData = z.infer<typeof binSchema>;
interface BinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BinFormData) => void;
  bin?: Bin | null;
  isSaving: boolean;
}
export function BinDialog({ isOpen, onClose, onSave, bin, isSaving }: BinDialogProps) {
  const form = useForm<BinFormData>({
    resolver: zodResolver(binSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  useEffect(() => {
    if (bin) {
      form.reset({
        name: bin.name,
        description: bin.description,
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [bin, form, isOpen]);
  const handleSave = (data: BinFormData) => {
    onSave(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>{bin ? 'Edit Bin' : 'Create New Bin'}</DialogTitle>
          <DialogDescription>
            {bin ? 'Update the details for your storage bin.' : 'Give your new storage bin a name and description.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Winter Clothes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Sweaters, jackets, and scarves" className="resize-none" {...field} />
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
                {isSaving ? 'Saving...' : 'Save Bin'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}