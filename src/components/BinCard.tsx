import { Bin } from '@shared/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Package, List } from 'lucide-react';
interface BinCardProps {
  bin: Bin;
}
export function BinCard({ bin }: BinCardProps) {
  const itemCount = bin.items.length;
  const totalQuantity = bin.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="h-full"
    >
      <Link to={`/bins/${bin.id}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-900 rounded-lg">
        <Card className="flex flex-col h-full bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg">
                <Box className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{bin.name}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{bin.description || 'No description'}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow" />
          <CardFooter className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>{itemCount} item type{itemCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{totalQuantity} total unit{totalQuantity !== 1 ? 's' : ''}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}