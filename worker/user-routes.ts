import { Hono } from "hono";
import { z } from "zod";
import type { Env } from './core-utils';
import { BinEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Bin, SearchResult } from "@shared/types";
const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name cannot be empty."),
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
});
const binCreateSchema = z.object({
  name: z.string().min(1, "Bin name cannot be empty."),
  description: z.string().optional().default(""),
});
const binUpdateSchema = z.object({
  name: z.string().min(1, "Bin name cannot be empty."),
  description: z.string().optional().default(""),
  items: z.array(itemSchema),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET all bins
  app.get('/api/bins', async (c) => {
    const page = await BinEntity.list(c.env);
    const sortedItems = page.items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, { ...page, items: sortedItems });
  });
  // Search for items in bins
  app.get('/api/bins/search', async (c) => {
    const q = c.req.query('q');
    if (!q || q.trim().length < 2) {
      return bad(c, 'Search query must be at least 2 characters long.');
    }
    const searchTerm = q.toLowerCase();
    const { items: allBins } = await BinEntity.list(c.env);
    const results: SearchResult[] = [];
    for (const bin of allBins) {
      for (const item of bin.items) {
        if (item.name.toLowerCase().includes(searchTerm)) {
          results.push({
            itemId: item.id,
            itemName: item.name,
            itemQuantity: item.quantity,
            binId: bin.id,
            binName: bin.name,
          });
        }
      }
    }
    return ok(c, results);
  });
  // POST a new bin
  app.post('/api/bins', async (c) => {
    const body = await c.req.json();
    const validation = binCreateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map(e => e.message).join(', '));
    }
    const { name, description } = validation.data;
    const now = Date.now();
    const newBin: Bin = {
      id: crypto.randomUUID(),
      name,
      description,
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    const created = await BinEntity.create(c.env, newBin);
    return ok(c, created);
  });
  // GET a single bin by ID
  app.get('/api/bins/:id', async (c) => {
    const { id } = c.req.param();
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const binEntity = new BinEntity(c.env, id);
    if (!(await binEntity.exists())) {
      return notFound(c, 'Bin not found');
    }
    const bin = await binEntity.getState();
    return ok(c, bin);
  });
  // PUT (update) a bin by ID
  app.put('/api/bins/:id', async (c) => {
    const { id } = c.req.param();
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const body = await c.req.json();
    const validation = binUpdateSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, validation.error.issues.map(e => e.message).join(', '));
    }
    const updateData = validation.data;
    const binEntity = new BinEntity(c.env, id);
    if (!(await binEntity.exists())) {
      return notFound(c, 'Bin not found');
    }
    const updatedBin = await binEntity.mutate(currentBin => ({
      ...currentBin,
      name: updateData.name,
      description: updateData.description,
      items: updateData.items,
      updatedAt: Date.now(),
    }));
    return ok(c, updatedBin);
  });
  // DELETE a bin by ID
  app.delete('/api/bins/:id', async (c) => {
    const { id } = c.req.param();
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await BinEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Bin not found or already deleted');
    }
    return ok(c, { id, deleted: true });
  });
}