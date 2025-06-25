// src/utils/kakaoCoords.ts

export interface CoordinateResponse {
    x: string; // 경도 (longitude)
    y: string; // 위도 (latitude)
}

export interface AddressToCoordResponse {
    documents: {
        address_name: string;
        x: string; // 경도
        y: string; // 위도
        address_type: string;
        address: {
            address_name: string;
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
            mountain_yn: string;
            main_address_no: string;
            sub_address_no: string;
        };
        road_address: {
            address_name: string;
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
            road_name: string;
            underground_yn: string;
            main_building_no: string;
            sub_building_no: string;
            building_name: string;
            zone_no: string;
        } | null;
    }[];
    meta: {
        total_count: number;
        pageable_count: number;
        is_end: boolean;
    };
}

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * 카카오 API를 사용하여 주소를 위경도로 변환합니다.
 * @param address - 변환할 주소
 * @returns Promise<Coordinates | null>
 */
export const getCoordinatesFromAddress = async (
    address: string
): Promise<Coordinates | null> => {
    try {
        /*
        const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

        // 더 상세한 환경변수 체크
        if (!KAKAO_REST_API_KEY) {
            console.error('❌ 카카오 REST API 키가 설정되지 않았습니다.');
            console.error('환경변수 KAKAO_REST_API_KEY를 확인하세요.');
            return null;
        }

        if (KAKAO_REST_API_KEY.length < 10) {
            console.error('❌ 카카오 API 키가 너무 짧습니다. 올바른 키인지 확인하세요.');
            return null;
        }

        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;



        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });



        if (!response.ok) {
            if (response.status === 401) {
                console.error('❌ 401 인증 오류 - API 키를 확인하세요');
                console.error('- API 키가 올바른지 확인');
                console.error('- 카카오 개발자 콘솔에서 도메인 설정 확인');
                console.error('- Web 플랫폼이 등록되어 있는지 확인');
            } else if (response.status === 403) {
                console.error('❌ 403 권한 오류 - 도메인 설정을 확인하세요');
            } else if (response.status === 429) {
                console.error('❌ 429 요청 한도 초과');
            }

            // 에러 응답 내용도 확인
            const errorText = await response.text();
            console.error('에러 응답 내용:', errorText);

            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }

        const data: AddressToCoordResponse = await response.json();

        if (!data.documents || !Array.isArray(data.documents) || data.documents.length === 0) {
            console.warn('⚠️ 주소 검색 결과가 없습니다:', address);
            return null;
        }

        const firstResult = data.documents[0];
        const lat = parseFloat(firstResult.y);
        const lng = parseFloat(firstResult.x);

        if (isNaN(lat) || isNaN(lng)) {
            console.error('❌ 유효하지 않은 좌표 데이터:', firstResult);
            return null;
        }

        return { lat, lng };

         */

        const response = await fetch('/api/kakao-coords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.documents || data.documents.length === 0) {
            return null;
        }

        const firstResult = data.documents[0];
        const lat = parseFloat(firstResult.y);
        const lng = parseFloat(firstResult.x);

        return { lat, lng };

    } catch (error) {
        console.error('💥 좌표 변환 중 오류:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('네트워크 오류일 가능성이 있습니다. 인터넷 연결을 확인하세요.');
        }

        return null;
    }
};

/**
 * 위경도를 문자열로 포맷팅합니다.
 * @param lat - 위도
 * @param lng - 경도
 * @param precision - 소수점 자릿수 (기본값: 6)
 * @returns string - "위도,경도" 형태의 문자열
 */
export const formatCoordinates = (
    lat: number,
    lng: number,
    precision: number = 6
): string => {
    // 입력값 검증
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        throw new Error('유효하지 않은 좌표 값입니다.');
    }

    if (precision < 0 || precision > 10) {
        throw new Error('precision은 0-10 사이의 값이어야 합니다.');
    }

    return `${lat.toFixed(precision)},${lng.toFixed(precision)}`;
};

/**
 * 좌표 문자열을 파싱하여 객체로 변환합니다.
 * @param coordString - "위도,경도" 형태의 문자열
 * @returns Coordinates | null
 */
export const parseCoordinates = (coordString: string): Coordinates | null => {
    try {
        if (!coordString || typeof coordString !== 'string') {
            return null;
        }

        const parts = coordString.split(',');
        if (parts.length !== 2) {
            return null;
        }

        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());

        if (isNaN(lat) || isNaN(lng)) {
            return null;
        }

        return { lat, lng };
    } catch (error) {
        console.error('좌표 파싱 오류:', error);
        return null;
    }
};

/**
 * 두 좌표 간의 거리를 계산합니다 (Haversine formula)
 * @param coord1 - 첫 번째 좌표
 * @param coord2 - 두 번째 좌표
 * @returns 거리 (단위: km)
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
};

/**
 * 테스트용 함수 (개발 환경에서만 사용)
 */
export const testKakaoAPI = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('🧪 카카오 API 테스트 시작');

    const testAddress = '서울특별시 강남구 테헤란로 152';
    const result = await getCoordinatesFromAddress(testAddress);

    if (result) {
        console.log('✅ 테스트 성공:', result);
        console.log('포맷된 좌표:', formatCoordinates(result.lat, result.lng));
    } else {
        console.log('❌ 테스트 실패');
    }
};