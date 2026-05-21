import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const guestToken = searchParams.get('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (guestToken) {
        // Guest flow — use the token from the URL
        headers['x-guest-token'] = guestToken;
    } else {
        // Logged-in flow — forward the Payload JWT from the session cookie
        const cookieStore = await cookies();
        const payloadToken = cookieStore.get('payload-token')?.value;
        if (payloadToken) {
            headers['Authorization'] = `JWT ${payloadToken}`;
        }
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/web-orders/${id}`, { headers });
        const data = await res.json();
        return Response.json(data, { status: res.status });
    } catch (error: any) {
        return Response.json(
            { error: error.message || 'Failed to fetch order' },
            { status: 500 }
        );
    }
}
