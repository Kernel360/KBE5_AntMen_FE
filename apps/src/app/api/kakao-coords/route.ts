// app/api/kakao-coords/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

        if (!KAKAO_REST_API_KEY) {
            return NextResponse.json(
                { error: 'API key not found' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Kakao API request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Kakao API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coordinates' },
            { status: 500 }
        );
    }
}