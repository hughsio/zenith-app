import { IndexedEntity } from "./core-utils";
import type { Bin } from "@shared/types";
export class BinEntity extends IndexedEntity<Bin> {
  static readonly entityName = "bin";
  static readonly indexName = "bins";
  static readonly initialState: Bin = { 
    id: "", 
    name: "", 
    description: "", 
    items: [],
    createdAt: 0,
    updatedAt: 0,
  };
}