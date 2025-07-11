'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import {
  BasicSignupForm,
  type BasicSignupFormData,
} from '@/features/auth/signup/ui/BasicSignupForm'
import {
  ManagerAdditionalInfo,
  type ManagerAdditionalData,
} from '@/features/auth/signup/ui/ManagerAdditionalInfo'
import { FileUploadSection } from '@/features/auth/signup/ui/FileUploadSection'
import { Button } from '@/shared/components/Button'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { getManagerInfo, updateManagerInfo } from '@/shared/api/manager'

interface ValidationErrors {
  [key: string]: string
}

const ManagerReapplyPage = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 기본 정보 (이름, 전화번호, 이메일, 성별, 생년월일, 프로필 사진 수정 가능)
  const [basicData, setBasicData] = useState<BasicSignupFormData>({
    username: '', // 아이디는 수정 불가
    password: '', // 비밀번호는 수정 불가
    name: '',
    phone: '',
    email: '',
    gender: '',
    birthDate: '',
    profileImage: null,
  })

  // 추가 정보 (주소, 근무시간 수정 가능)
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
  const [existingFiles, setExistingFiles] = useState<any[]>([])

  // 로그인 확인 및 기존 정보 로드
  useEffect(() => {
    const initializeData = async () => {
      if (!user || user.userRole !== 'MANAGER') {
        router.push('/login')
        return
      }
      
      // REJECTED 상태가 아니면 재신청 페이지에 접근할 수 없음
      if (user.managerStatus !== 'REJECTED') {
        router.push('/manager')
        return
      }

      // 기존 매니저 정보 불러오기
      try {
        if (!user.userId) {
          throw new Error('사용자 ID가 없습니다')
        }
        
        console.log('🔄 매니저 정보 조회 시작...')
        const managerInfo = await getManagerInfo()
        console.log('📥 받아온 매니저 정보:', managerInfo)
        
        // 성별 값 변환: 백엔드 "남성"/"여성" → 프론트엔드 "M"/"W"
        let genderValue = '';
        if (managerInfo.userGender === '남성') {
          genderValue = 'M';
        } else if (managerInfo.userGender === '여성') {
          genderValue = 'W';
        } else {
          // 혹시 이미 M, W로 오는 경우도 대비
          genderValue = managerInfo.userGender || '';
        }
        
        setBasicData({
          username: managerInfo.userLoginId || '',
          password: '', // 비밀번호는 불러오지 않음
          name: managerInfo.userName || '',
          phone: managerInfo.userTel || '',
          email: managerInfo.userEmail || '',
          gender: genderValue,
          birthDate: managerInfo.userBirth || '',
          profileImage: null, // 새 이미지 업로드용
          existingProfileImageUrl: managerInfo.userProfile, // 기존 이미지 URL
        })

        // 추가 정보 설정 (백엔드 응답 필드명에 맞춤)
        const [startTime, endTime] = managerInfo.managerTime ? managerInfo.managerTime.split('-') : ['09:00', '18:00']
        setAdditionalData({
          address: managerInfo.managerAddress || '',
          addressDetail: '', // 백엔드에서 분리된 필드가 없으므로 빈 값
          latitude: managerInfo.managerLatitude || null,
          longitude: managerInfo.managerLongitude || null,
          workHours: {
            start: startTime || '09:00',
            end: endTime || '18:00',
          },
        })

        // 기존 파일 정보 설정
        setExistingFiles(managerInfo.managerFileUrls || [])

        console.log('✅ 기존 매니저 정보 로드 완료:', managerInfo)
        
      } catch (error) {
        console.error('❌ 매니저 정보 로드 실패:', error)
        // 실패해도 빈 폼으로 진행
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [user, router])

  // 기본 정보 변경 핸들러
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

  // 프로필 이미지 변경 핸들러
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

  // 추가 정보 변경 핸들러
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
    console.log('재신청 주소 선택:', addressData.main);
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}

    // 기본 정보 검증
    if (!basicData.name) newErrors.name = '이름을 입력해주세요'
    if (!basicData.phone) newErrors.phone = '전화번호를 입력해주세요'
    if (!basicData.email) newErrors.email = '이메일을 입력해주세요'
    if (!basicData.gender) newErrors.gender = '성별을 선택해주세요'
    if (!basicData.birthDate) newErrors.birthDate = '생년월일을 입력해주세요'
    // 프로필 이미지: 새로 업로드하거나 기존 이미지가 있어야 함
    if (!basicData.profileImage && !basicData.existingProfileImageUrl) {
      newErrors.profileImage = '프로필 사진을 업로드해주세요'
    }

    // 추가 정보 검증
    if (!additionalData.address) newErrors.address = '주소를 입력해주세요'

    // 신원 확인 서류 검증 (기존 파일 + 새 파일)
    if (identityFiles.length === 0 && existingFiles.length === 0)
      newErrors.identityFiles = '최소 1개의 신원 확인 서류가 필요합니다'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [basicData, additionalData, identityFiles, existingFiles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (!user?.userId) {
        throw new Error('사용자 정보가 없습니다')
      }

      // 재신청 API 호출 (기존 데이터 덮어쓰기)
      const formData = new FormData()
      
      // 기본 정보 추가 (백엔드 DTO 필드명에 맞춤)
      formData.append('userName', basicData.name)
      formData.append('userTel', basicData.phone)
      formData.append('userEmail', basicData.email)
      // 재신청 API도 UserGender enum을 사용하므로 M, W 전송
      const genderForBackend = basicData.gender // M or W
      console.log('📤 전송할 성별 값:', genderForBackend)
      formData.append('userGender', genderForBackend)
      formData.append('userBirth', basicData.birthDate)
      if (basicData.profileImage) {
        formData.append('userProfile', basicData.profileImage)
      }
      
      // 추가 정보 추가 (백엔드 DTO 필드명에 맞춤)
      formData.append('managerAddress', additionalData.address)
      if (additionalData.latitude) {
        formData.append('managerLatitude', additionalData.latitude.toString())
      }
      if (additionalData.longitude) {
        formData.append('managerLongitude', additionalData.longitude.toString())
      }
      formData.append('managerTime', `${additionalData.workHours.start}-${additionalData.workHours.end}`)
      formData.append('userType', 'MANAGER')

      // 파일 추가 (백엔드에서 배열로 받음)
      identityFiles.forEach((file) => {
        formData.append('managerFileUrls', file)
      })

      // API 함수 사용하여 매니저 정보 수정 (덮어쓰기)
      await updateManagerInfo(formData)

      // 성공 시 재신청 완료 페이지로 이동
      router.push('/manager/reapply/success')
      
    } catch (error) {
      console.error('재신청 오류:', error)
      alert('재신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>로딩 중...</div>
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommonHeader title="재신청" />
        
        <div className="p-4 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">기존 정보를 불러오고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="매니저 재신청" 
        showBackButton 
      />
      
      <div className="pt-24 pb-8">
        <div className="max-w-md mx-auto px-6">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📝 재신청 안내</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• 거절 사유를 참고하여 정보를 수정해주세요</p>
              <p>• 필요한 서류를 다시 업로드해주세요</p>
              <p>• 재검토에는 1-3일이 소요됩니다</p>
            </div>
          </div>

          {/* 거절 사유 표시 */}
          {user.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">❌ 거절 사유</h3>
              <p className="text-sm text-red-700 whitespace-pre-wrap">{user.rejectionReason}</p>
            </div>
          )}

                     <form onSubmit={handleSubmit} className="space-y-6">
             {/* 기본 정보 수정 */}
             <div className="bg-white rounded-lg p-6 border border-gray-200">
               <h3 className="font-semibold text-gray-900 mb-4">기본 정보 수정</h3>
               <BasicSignupForm
                 formData={basicData}
                 onChange={handleBasicChange}
                 onImageChange={handleProfileImageChange}
                 errors={errors}
                 isSocialSignup={false}
                 onIdValidationChange={() => {}}
                 showUsernameField={false}
                 showPasswordField={false}
               />
             </div>

             {/* 추가 정보 수정 */}
             <div className="bg-white rounded-lg p-6 border border-gray-200">
               <h3 className="font-semibold text-gray-900 mb-4">추가 정보 수정</h3>
               <ManagerAdditionalInfo
                 data={additionalData}
                 onChange={handleAdditionalChange}
                 onWorkHoursChange={handleWorkHoursChange}
                 onAddressChange={handleAddressChange}
                 onAddressDetailChange={handleAddressDetailChange}
                 onCoordinatesChange={handleCoordinatesChange}
                 onAddressSelect={handleAddressSelect}
                 errors={errors}
               />
             </div>

             {/* 서류 재업로드 */}
             <div className="bg-white rounded-lg p-6 border border-gray-200">
               <h3 className="font-semibold text-gray-900 mb-4">서류 재업로드</h3>
               <FileUploadSection
                 files={identityFiles}
                 onFilesChange={setIdentityFiles}
                 existingFiles={existingFiles}
                 onExistingFileRemove={(fileId) => {
                   setExistingFiles(prev => prev.filter(file => file.id !== fileId))
                 }}
                 error={errors.identityFiles}
               />
             </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? '재신청 중...' : '재신청하기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManagerReapplyPage 