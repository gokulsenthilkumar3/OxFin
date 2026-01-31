// src/app/api/ai/recommendations/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { securityHeaders } from '@/guards/securityHeaders';
import { rateLimiter } from '@/guards/rateLimiter';
import { csrfProtection } from '@/guards/csrf';

const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.reset) {
        rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
        return true;
    }
    if (entry.count >= 60) return false;
    entry.count++;
    return true;
}

export async function GET(req: Request) {
    const sec = securityHeaders(new Request(req) as any);
    if (sec instanceof NextResponse) return sec;
    const rl = await rateLimiter(new Request(req) as any);
    if (rl instanceof NextResponse) return rl;
    const csrf = await csrfProtection(new Request(req) as any);
    if (csrf instanceof NextResponse) return csrf;

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const recommendations = [
        { id: 'inv-001', title: 'Low‑risk index fund', description: 'Ideal for beginners', risk: 'low' },
        { id: 'loan-123', title: 'Personal loan – 5% APR', description: 'Quick approval', risk: 'medium' },
        { id: 'card-xyz', title: 'Premium credit card', description: 'Earn 2% cashback', risk: 'high' },
    ];
    return NextResponse.json({ recommendations });
}
