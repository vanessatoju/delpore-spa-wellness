import { router, json, error } from '@appdeploy/sdk';
import { db } from '@appdeploy/sdk';

export const handler = router({
  'GET /api/visitor-count': [async () => {
    const { items } = await db.list<{ value?: number }>('global_visitor_counter', { limit: 1 });
    if (items.length === 0) {
      const [id] = await db.add('global_visitor_counter', [{ value: 1 }]);
      if (!id) return error('Unable to initialize visitor counter', 500);
      return json({ count: 1 });
    }
    const current = items[0];
    const next = (current.value ?? 0) + 1;
    const [updated] = await db.update('global_visitor_counter', [{ id: current.id, record: { value: next } }]);
    if (!updated) return error('Unable to update visitor counter', 500);
    return json({ count: next });
  }],
});
