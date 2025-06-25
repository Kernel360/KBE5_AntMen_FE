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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'pdf' | 'unsupported'>('image');

  if (!managerData) return null;

  // 파일 확장자로 파일 타입 확인
  const getFileType = (fileUrl: string): 'image' | 'pdf' | 'unsupported' => {
    if (!fileUrl || typeof fileUrl !== 'string') {
      return 'unsupported';
    }
    
    const extension = fileUrl.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unsupported';
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleFilePreview = (fileUrl: string) => {
    const fileType = getFileType(fileUrl);
    setSelectedFileUrl(fileUrl);
    setSelectedFileType(fileType);
    setImageError(false);
    setImageLoading(true);
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
                {managerData.managerFileUrls && managerData.managerFileUrls.length > 0 ? (
                  <div className="space-y-2">
                    {managerData.managerFileUrls.map((file, index) => {
                      // 안전한 파일 정보 처리
                      const fileUrl = file?.fileUrl || '';
                      const fileType = getFileType(fileUrl);
                      const fileName = fileUrl ? (fileUrl.split('/').pop() || `파일 ${index + 1}`) : `파일 ${index + 1}`;
                      
                      return (
                        <div key={file?.id || index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              파일 {index + 1}
                            </span>
                            <span className="text-xs text-gray-400">
                              {fileName}
                            </span>
                            {fileType === 'unsupported' && (
                              <span className="text-xs text-orange-500">
                                미리보기 지원 안함 (이미지/PDF만 지원)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFilePreview(fileUrl)}
                              disabled={fileType === 'unsupported' || !fileUrl}
                            >
                              미리보기
                            </Button>
                            {fileUrl && (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="outline" size="sm">
                                  다운로드
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    등록된 신분증 파일이 없습니다.
                  </div>
                )}
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
            </div>

            {/* 재신청 시 이전 거절사유 표시 */}
            {managerData.rejectReason && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-orange-800 mb-1">재신청 - 이전 거절사유</h4>
                    <p className="text-sm text-orange-700">{managerData.rejectReason}</p>
                  </div>
                </div>
              </div>
            )}

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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="relative">
            <button
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
              onClick={() => setSelectedFileUrl(null)}
            >
              <X className="w-4 h-4" />
            </button>
            {selectedFileUrl && (
              <div className="w-full">
                {imageLoading && selectedFileType === 'image' && (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">이미지 로딩 중...</div>
                  </div>
                )}
                
                {selectedFileType === 'image' && (
                  <>
                    {imageError ? (
                      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-2">이미지를 불러올 수 없습니다.</p>
                        <a
                          href={selectedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          파일 다운로드
                        </a>
                      </div>
                    ) : (
                      <img
                        src={selectedFileUrl}
                        alt="신분증 미리보기"
                        className="w-full h-auto max-h-[75vh] object-contain"
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                          setImageLoading(false);
                          setImageError(true);
                        }}
                        style={{ display: imageLoading ? 'none' : 'block' }}
                      />
                    )}
                  </>
                )}

                {selectedFileType === 'pdf' && (
                  <div className="w-full h-[75vh]">
                    <iframe
                      src={selectedFileUrl}
                      className="w-full h-full border-0"
                      title="PDF 미리보기"
                      onLoad={() => setImageLoading(false)}
                    />
                  </div>
                )}

                {selectedFileType === 'unsupported' && (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-2">지원하지 않는 파일 형식입니다.</p>
                    <p className="text-sm text-gray-400 mb-4">이미지 파일(JPG, PNG, GIF 등) 또는 PDF 파일만 미리보기 가능합니다.</p>
                    <a
                      href={selectedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      파일 다운로드
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 