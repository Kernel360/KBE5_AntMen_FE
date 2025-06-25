import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { UserGender } from '@/entities/account/model/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: UserGender;
    userProfile: string;
  };
  onSubmit: (data: {
    name: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: UserGender;
    userProfile: string;
  }) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: EditProfileModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      birthDate: formData.get('birthDate') as string,
      email: formData.get('email') as string,
      gender: initialData.gender,
      userProfile: initialData.userProfile,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[390px] transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-black mb-4"
                >
                  정보 수정
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      이름
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={initialData.name}
                      className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                      placeholder="이름을 입력해주세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={initialData.phone}
                      className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                      placeholder="전화번호를 입력해주세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      생년월일
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      defaultValue={initialData.birthDate}
                      className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-black">
                      이메일
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={initialData.email}
                      className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 h-[52px] px-4 bg-gray-100 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-200 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-[52px] px-4 bg-[#00BCD4] text-white rounded-lg text-base font-medium hover:bg-[#00acc1] transition-colors"
                    >
                      저장
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 