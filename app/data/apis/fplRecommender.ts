import type { ManagerStrategy } from '@/types';

export async function fetchManagerStrategy(
    managerId: number
): Promise<ManagerStrategy> {
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

    // just cast-and-return the full payload
    const data = (await res.json()) as ManagerStrategy;
    return data;
}
