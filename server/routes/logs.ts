import { RequestHandler } from "express";

type StoredLog = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const store: Record<string, StoredLog> = {};

export const getLogs: RequestHandler = (_req, res) => {
  res.json({ logs: Object.values(store) });
};

export const postLogs: RequestHandler = (req, res) => {
  const logs = (req.body?.logs as StoredLog[]) || [];
  for (const l of logs) {
    store[l.date] = l;
  }
  res.json({ ok: true, count: logs.length });
};
