'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  BasicSignupForm,
  type BasicSignupFormData,
} from '@/features/auth/signup/ui/BasicSignupForm'
import {
  ManagerAdditionalInfo,
  type ManagerAdditionalData,
} from '@/features/auth/signup/ui/ManagerAdditionalInfo'
import { FileUploadSection } from '@/features/auth/signup/ui/FileUploadSection'
import { useSocialProfileStore } from '@/shared/stores/socialProfileStore'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

interface ValidationErrors {
  [key: string]: string
}

const ManagerSignUpPage = () => {
  const router = useRouter()
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIdValid, setIsIdValid] = useState(false)

  const { socialProfile, isSocialSignup, clearSocialProfile } =
    useSocialProfileStore()

  const [basicData, setBasicData] = useState<BasicSignupFormData>({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    gender: '',
    birthDate: '',
    profileImage: null,
  })

  const [additionalData, setAdditionalData] = useState<ManagerAdditionalData>({
    address: '',
    addressDetail: '',
    latitude: null,
    longitude: null,
    workHours: {
      start: '09:00',
      end: '18:00',
    },
  })

  const [identityFiles, setIdentityFiles] = useState<File[]>([])

  useEffect(() => {
    if (isSocialSignup && socialProfile) {
      setBasicData((prev) => ({
        ...prev,
        email: socialProfile.email,
        username: socialProfile.id,
      }))
    }
  }, [isSocialSignup, socialProfile])

  const handleBasicChange = useCallback((
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setBasicData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const handleProfileImageChange = useCallback((file: File | null) => {
    setBasicData((prev) => ({
      ...prev,
      profileImage: file,
    }))
    if (errors.profileImage) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.profileImage
        return newErrors
      })
    }
  }, [errors.profileImage])

  const handleAdditionalChange = useCallback((
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setAdditionalData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const handleWorkHoursChange = useCallback((type: 'start' | 'end', value: string) => {
    setAdditionalData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [type]: value,
      },
    }))
  }, [])

  const handleAddressChange = useCallback((address: string) => {
    setAdditionalData((prev) => ({
      ...prev,
      address,
    }))
    if (errors.address) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.address
        return newErrors
      })
    }
  }, [errors.address])

  const handleAddressDetailChange = useCallback((detail: string) => {
    setAdditionalData((prev) => ({
      ...prev,
      addressDetail: detail,
    }))
    if (errors.addressDetail) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.addressDetail
        return newErrors
      })
    }
  }, [errors.addressDetail])

  // ✅ 수정된 좌표 변경 핸들러 - 위경도 분리
  const handleCoordinatesChange = useCallback((latitude: number | null, longitude: number | null) => {
    setAdditionalData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }))
  }, [])

  const handleAddressSelect = useCallback(async (addressData: {
    main: string;
    detail: string;
    addressName: string;
    area: number;
  }) => {
    console.log('부모에서 주소 선택 확인:', addressData.main);
  }, [])

  const validateForm = useCallback((): boolean => {
    // 소셜 로그인이 아닌 경우 아이디 중복 확인 상태 체크
    if (!isSocialSignup && !isIdValid) {
      return false
    }

    const newErrors: ValidationErrors = {}

    // Basic data validation
    if (!basicData.username && !isSocialSignup)
      newErrors.username = '아이디를 입력해주세요'
    if (!basicData.password && !isSocialSignup)
      newErrors.password = '비밀번호를 입력해주세요'
    else if (!isSocialSignup && basicData.password.length < 6)
      newErrors.password = '비밀번호는 6자리 이상이어야 합니다'
    if (!basicData.name) newErrors.name = '이름을 입력해주세요'
    if (!basicData.phone) newErrors.phone = '전화번호를 입력해주세요'
    if (!basicData.email) newErrors.email = '이메일을 입력해주세요'
    if (!basicData.gender) newErrors.gender = '성별을 선택해주세요'
    if (!basicData.birthDate) newErrors.birthDate = '생년월일을 입력해주세요'
    if (!basicData.profileImage)
      newErrors.profileImage = '프로필 사진을 업로드해주세요'

    // Additional data validation
    if (!additionalData.address) newErrors.address = '주소를 입력해주세요'

    // Identity files validation
    if (identityFiles.length === 0)
      newErrors.identityFiles = '최소 1개의 신원 확인 서류가 필요합니다'

    setErrors(newErrors)

    // 필수 항목이 모두 채워지지 않은 경우
    if (Object.keys(newErrors).length > 0) {
      alert('모든 필수 항목을 입력해주세요')
      return false
    }

    return Object.keys(newErrors).length === 0
  }, [basicData, additionalData, identityFiles, isSocialSignup, isIdValid])

  const handleBack = useCallback(() => {
    clearSocialProfile()
    router.push('/signup')
  }, [clearSocialProfile, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사 활성화

    if (!validateForm()) {
      // Show error message
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()

      // Basic user information
      formData.append('userLoginId', basicData.username)
      if (!isSocialSignup) {
        formData.append('userPassword', basicData.password)
      }
      formData.append('userName', basicData.name)
      formData.append('userTel', basicData.phone)
      formData.append('userEmail', basicData.email)
      formData.append('userGender', basicData.gender) // M or W
      formData.append('userBirth', basicData.birthDate)

      if (isSocialSignup && socialProfile) {
        formData.append('userType', socialProfile.provider)
      }

      // Profile image
      if (basicData.profileImage) {
        formData.append('userProfile', basicData.profileImage)
      }

      // ✅ 주소만 깔끔하게 전송 (위경도 정보 제외)
      const cleanAddress = additionalData.addressDetail
          ? `${additionalData.address} ${additionalData.addressDetail}`.trim()
          : additionalData.address

      // 주소는 깔끔하게, 위경도는 별도 필드로 전송
      formData.append('managerAddress', cleanAddress)
      formData.append(
          'managerTime',
          `${additionalData.workHours.start}-${additionalData.workHours.end}`,
      )

      // ✅ 위경도는 별도 필드로만 전송
      if (additionalData.latitude !== null) {
        formData.append('managerLatitude', additionalData.latitude.toString())
      }
      if (additionalData.longitude !== null) {
        formData.append('managerLongitude', additionalData.longitude.toString())
      }

      // Identity verification files
      identityFiles.forEach((file) => {
        formData.append('managerFileUrls', file)
      })

      // 개발용 로그 - 전송되는 데이터 확인
      if (process.env.NODE_ENV === 'development') {
        console.log('\n=== FormData 내용 ===');
        formData.forEach((value, key) => {
          // value의 자료형 확인
          const valueType = typeof value;
          const constructor = value.constructor.name;

          if (value instanceof File) {
            console.log(`📁 ${key}: [파일] ${value.name} (${(value.size/1024).toFixed(1)}KB) - ${value.type}`);
            console.log(`   타입: ${valueType}, 생성자: ${constructor}`);
          } else {
            console.log(`📝 ${key}: ${value}`);
            console.log(`   타입: ${valueType}, 생성자: ${constructor}`);
          }
        });
      }

      // API 호출
      const response = await fetch('http://localhost:9092/v1/manager/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include', // 세션 쿠키 포함
      })

      // 응답 상태 확인
      console.log('API 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = '회원가입 중 오류가 발생했습니다.';

        try {
          const errorData = await response.text();
          console.error('서버 에러 응답:', errorData);

          // 상태 코드별 에러 메시지
          switch (response.status) {
            case 400:
              errorMessage = '입력 정보를 확인해주세요.';
              break;
            case 401:
              errorMessage = '인증이 필요합니다.';
              break;
            case 403:
              errorMessage = '권한이 없습니다.';
              break;
            case 409:
              errorMessage = '이미 존재하는 사용자입니다.';
              break;
            case 500:
              errorMessage = '서버 내부 오류가 발생했습니다.';
              break;
            default:
              errorMessage = `서버 오류 (${response.status})`;
          }
        } catch (parseError) {
          console.error('에러 응답 파싱 실패:', parseError);
        }

        throw new Error(`${errorMessage} (상태 코드: ${response.status})`);
      }

      const data = await response.json()
      console.log('회원가입 성공:', data)

      // 가입 성공 후 스토어 클리어
      clearSocialProfile()

      // Redirect to pending page instead of login page
      router.push('/signup/manager/pending')

    } catch (error) {
      console.error('회원가입 실패:', error)

      // 에러 타입별 처리
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('네트워크 연결을 확인해주세요.');
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false)
    }
  }

// 추가: 전송 데이터 미리보기 함수 (개발용)
  const previewSubmissionData = () => {
    if (process.env.NODE_ENV === 'development') {
      const cleanAddress = additionalData.addressDetail
          ? `${additionalData.address} ${additionalData.addressDetail}`.trim()
          : additionalData.address;

      console.log('=== 전송 예정 데이터 미리보기 ===');
      console.log('사용자 정보:', {
        아이디: basicData.username,
        이름: basicData.name,
        이메일: basicData.email,
        전화번호: basicData.phone,
        성별: basicData.gender,
        생년월일: basicData.birthDate
      });

      console.log('매니저 정보:', {
        주소: cleanAddress,
        위도: additionalData.latitude,
        경도: additionalData.longitude,
        근무시간: `${additionalData.workHours.start}-${additionalData.workHours.end}`
      });

      console.log('파일 정보:', {
        프로필사진: basicData.profileImage?.name || '없음',
        신원확인서류: identityFiles.map(f => f.name)
      });
    }
  };

  return (
      <div className="min-h-screen bg-white">
        <CommonHeader 
          title="매니저 회원가입" 
          showBackButton 
          onBack={handleBack} 
        />
        
        <div className="pt-24 pb-8">
          <div className="max-w-md mx-auto px-6">

          {/* Main Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <BasicSignupForm
                formData={basicData}
                onChange={handleBasicChange}
                onImageChange={handleProfileImageChange}
                errors={errors}
                isSocialSignup={isSocialSignup}
                onIdValidationChange={setIsIdValid}
            />

            {/* Manager Additional Information */}
            <ManagerAdditionalInfo
                data={additionalData}
                onChange={handleAdditionalChange}
                onWorkHoursChange={handleWorkHoursChange}
                onAddressChange={handleAddressChange}
                onAddressDetailChange={handleAddressDetailChange}
                onCoordinatesChange={handleCoordinatesChange} // ✅ 수정된 핸들러
                onAddressSelect={handleAddressSelect}
                errors={errors}
            />

            {/* File Upload Section */}
            <FileUploadSection
                files={identityFiles}
                onFilesChange={setIdentityFiles}
                error={errors.identityFiles}
            />

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-[52px] bg-primary-500 text-white rounded-lg mt-8 text-base font-medium ${
                    isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-primary-600'
                }`}
            >
              {isSubmitting ? '처리중...' : '회원가입'}
            </button>
          </form>
          </div>
        </div>
      </div>
  )
}

export default ManagerSignUpPage