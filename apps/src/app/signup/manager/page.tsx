'use client'

import React, { useState, useEffect } from 'react'
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

interface ValidationErrors {
  [key: string]: string
}

const ManagerSignUpPage = () => {
  const router = useRouter()
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    workArea: '',
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
        username: socialProfile.id, // 아이디도 이메일로 초기 설정
      }))
    }
  }, [isSocialSignup, socialProfile])

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setBasicData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProfileImageChange = (file: File | null) => {
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
  }

  const handleAdditionalChange = (
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
  }

  const handleWorkHoursChange = (type: 'start' | 'end', value: string) => {
    setAdditionalData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [type]: value,
      },
    }))
  }

  const validateForm = (): boolean => {
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
    if (!additionalData.workArea)
      newErrors.workArea = '근무 가능 지역을 입력해주세요'

    // Identity files validation
    if (identityFiles.length === 0)
      newErrors.identityFiles = '최소 1개의 신원 확인 서류가 필요합니다'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBack = () => {
    clearSocialProfile() // 뒤로가기 시 스토어 초기화
    router.push('/signup')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      formData.append('userGender', basicData.gender.toUpperCase()) // 'male' -> 'MALE'
      formData.append('userBirth', basicData.birthDate)

      if (isSocialSignup && socialProfile) {
        formData.append('userType', socialProfile.provider)
      }

      // Profile image
      if (basicData.profileImage) {
        formData.append('userProfile', basicData.profileImage)
      }

      // Manager specific information
      formData.append('managerAddress', additionalData.address)
      formData.append('managerArea', additionalData.workArea)
      formData.append(
        'managerTime',
        `${additionalData.workHours.start}-${additionalData.workHours.end}`,
      )

      // Identity verification files
      identityFiles.forEach((file) => {
        formData.append('managerFileUrls', file)
      })

      const response = await fetch('https://api.antmen.site/managers/signup', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('회원가입 중 오류가 발생했습니다.')
      }

      const data = await response.json()
      console.log('회원가입 성공:', data)

      // 가입 성공 후 스토어 클리어
      clearSocialProfile()

      // Redirect to pending page instead of login page
      router.push('/signup/manager/pending')
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-[375px] px-4 pt-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={handleBack} className="p-2 text-2xl font-bold">
            &larr; 매니저 회원가입
          </button>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <BasicSignupForm
            formData={basicData}
            onChange={handleBasicChange}
            onImageChange={handleProfileImageChange}
            errors={errors}
            isSocialSignup={isSocialSignup}
          />

          {/* Manager Additional Information */}
          <ManagerAdditionalInfo
            data={additionalData}
            onChange={handleAdditionalChange}
            onWorkHoursChange={handleWorkHoursChange}
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
            className={`w-full h-[52px] bg-[#0fbcd6] text-white rounded-lg mt-8 text-base font-medium ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#0eaec5]'
            }`}
          >
            {isSubmitting ? '처리중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ManagerSignUpPage
