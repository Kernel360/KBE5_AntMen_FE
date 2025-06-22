import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface ManagerFileUrl {
  id: number;
  fileUrl: string;
}

interface ManagerDetailData {
  userId: number;
  userName: string;
  userTel: string;
  userEmail: string;
  userGender: string;
  userBirth: string;
  userProfile: string;
  managerAddress: string;
  managerArea: string;
  managerTime: string;
  managerFileUrls: ManagerFileUrl[];
  managerStatus: string;
  rejectReason: string;
}

interface ManagerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerData?: ManagerDetailData;
  onApprove: (userId: number) => void;
  onReject: (userId: number, reason: string) => void;
}

export function ManagerDetailModal({
  isOpen,
  onClose,
  managerData,
  onApprove,
  onReject,
}: ManagerDetailModalProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!managerData) return null;

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleFilePreview = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
  };

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    onReject(managerData.userId, rejectReason);
    setShowRejectInput(false);
    setRejectReason("");
  };

  const handleCancel = () => {
    setShowRejectInput(false);
    setRejectReason("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>매니저 상세 정보</DialogTitle>
            <p className="text-sm text-gray-500">
              {managerData.userName}님의 상세 정보를 확인하고 승인 또는 거절할 수 있습니다.
            </p>
          </DialogHeader>

          <div className="mt-4">
            <div className="grid grid-cols-2 gap-8">
              {/* 프로필 사진 */}
              <div>
                <h3 className="font-medium mb-2">프로필 사진:</h3>
                <div className="relative">
                  <img
                    src={managerData.userProfile}
                    alt="프로필"
                    className="w-32 h-32 rounded-full object-cover cursor-pointer"
                    onClick={handleProfileClick}
                  />
                  <button 
                    className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={handleProfileClick}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 신분증 파일 */}
              <div>
                <h3 className="font-medium mb-2">신분증 파일:</h3>
                <div className="flex items-center gap-2">
                  {managerData.managerFileUrls.map((file) => (
                    <div key={file.id}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilePreview(file.fileUrl)}
                      >
                        미리보기
                      </Button>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                      >
                        <Button variant="outline" size="sm">
                          다운로드
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div>
                <span className="font-medium">이름:</span> {managerData.userName}
              </div>
              <div>
                <span className="font-medium">생년월일:</span> {managerData.userBirth}
              </div>
              <div>
                <span className="font-medium">성별:</span> {managerData.userGender}
              </div>
              <div>
                <span className="font-medium">이메일:</span> {managerData.userEmail}
              </div>
              <div>
                <span className="font-medium">전화번호:</span> {managerData.userTel}
              </div>
              <div>
                <span className="font-medium">활동주소:</span> {managerData.managerAddress}
              </div>
              <div>
                <span className="font-medium">활동지역:</span> {managerData.managerArea}
              </div>
              <div>
                <span className="font-medium">활동시간:</span> {managerData.managerTime}
              </div>
              <div>
                <span className="font-medium">상태:</span> {managerData.managerStatus}
              </div>
              {managerData.rejectReason && (
                <div className="col-span-2">
                  <span className="font-medium">거절 사유:</span> {managerData.rejectReason}
                </div>
              )}
            </div>

            {showRejectInput ? (
              <div className="mt-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    거절 사유
                  </label>
                  <Textarea
                    placeholder="거절 사유를 입력해주세요."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    취소
                  </Button>
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={handleRejectSubmit}
                  >
                    거절하기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2 mt-8">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleRejectClick}
                >
                  거절
                </Button>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => onApprove(managerData.userId)}
                >
                  승인
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 프로필 사진 확대 모달 */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-3xl">
          <div className="relative">
            <button
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={() => setIsProfileModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={managerData.userProfile}
              alt="프로필 확대"
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 신분증 파일 미리보기 모달 */}
      <Dialog open={!!selectedFileUrl} onOpenChange={() => setSelectedFileUrl(null)}>
        <DialogContent className="max-w-3xl">
          <div className="relative">
            <button
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={() => setSelectedFileUrl(null)}
            >
              <X className="w-4 h-4" />
            </button>
            {selectedFileUrl && (
              <img
                src={selectedFileUrl}
                alt="신분증 미리보기"
                className="w-full h-auto"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 