// app/api/kakao-coords/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

        if (!KAKAO_REST_API_KEY) {
            console.error('❌ 카카오 REST API 키가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: 'API key not found' },
                { status: 500 }
            );
        }

        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
        console.log('🔍 요청 URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();

            return NextResponse.json(
                { error: 'Kakao API request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch coordinates' },
            { status: 500 }
        );
    }
}