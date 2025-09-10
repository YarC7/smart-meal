import { RequestHandler } from "express";

type GroceryItem = { name: string; unit: string; qty: number; cost?: number };

let lastList: GroceryItem[] = [];

export const getGrocery: RequestHandler = (_req, res) => {
  res.json({ items: lastList });
};

export const postGrocery: RequestHandler = (req, res) => {
  const items = (req.body?.items as GroceryItem[]) || [];
  lastList = items;
  console.log(`[api] /api/grocery <- ${items.length} items`);
  res.json({ ok: true, count: items.length });
};
