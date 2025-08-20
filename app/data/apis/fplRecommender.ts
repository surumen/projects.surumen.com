import type { ManagerStrategy } from '@/types';
import { fplApiCache, CACHE_TTL, cacheKeys } from '@/store/cache/apiCache';

export async function fetchManagerStrategy(
    managerId: number
): Promise<ManagerStrategy> {
    return fplApiCache.get(
        cacheKeys.strategy(managerId),
        async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_MCP_API_BASE}/tools/plan_manager_strategy`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ manager_id: managerId }),
                }
            );

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`MCP error ${res.status}: ${err}`);
            }

            return (await res.json()) as ManagerStrategy;
        },
        CACHE_TTL.STRATEGY
    );
}

/**
 * Force refresh strategy by invalidating cache
 */
export async function refreshManagerStrategy(managerId: number): Promise<ManagerStrategy> {
    fplApiCache.invalidate(cacheKeys.strategy(managerId));
    return fetchManagerStrategy(managerId);
}
