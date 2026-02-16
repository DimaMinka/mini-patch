import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const password = req.headers.get('x-upload-password');

    if (password === process.env.UPLOAD_PASSWORD && password !== undefined && password !== '') {
        return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
}
