import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface ManagerFileUrl {
  id: number;
  managerFileUrl: string;
  originalFileName: string;
  uuidFileName: string;
  extension: string;
  contentType: string;
}

interface ManagerDetailData {
  userId?: number;
  userName: string;
  userTel: string;
  userEmail: string;
  userGender: string;
  userBirth: string;
  userProfile: string;
  managerAddress: string;
  managerTime: string;
  managerFileUrls: ManagerFileUrl[];
  managerStatus: string;
  rejectReason?: string;
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

  // userId가 없으면 에러 모달 표시
  if (!managerData.userId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-lg">⚠️ 오류 발생</DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-red-800 font-semibold text-lg mb-2">데이터 로딩 중 오류가 발생했습니다</p>
              <p className="text-red-600 text-sm leading-relaxed">
                사용자 정보를 찾을 수 없습니다.<br />
                페이지를 새로고침하거나 다시 시도해주세요.
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <Button 
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
    onReject(managerData.userId!, rejectReason);
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              매니저 상세 정보
            </DialogTitle>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-medium text-gray-900">{managerData.userName}</span>님의 상세 정보를 확인하고 승인 또는 거절할 수 있습니다.
            </p>
          </DialogHeader>

          <div className="mt-6">
            {/* 재신청 시 이전 거절사유 표시 */}
            {managerData.rejectReason && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2 text-sm">
                  재신청 - 이전 거절사유
                </h4>
                <div className="bg-white rounded-md p-3 border border-orange-200">
                  <p className="text-orange-700 text-sm">{managerData.rejectReason}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 프로필 사진 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-gray-700 text-sm">
                  프로필 사진
                </h3>
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={handleProfileClick}>
                    <img
                      src={managerData.userProfile}
                      alt="프로필"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200 group-hover:border-gray-300 transition-all duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                        <Search className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">클릭하여 확대</p>
              </div>

              {/* 신분증 파일 */}
              <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
                <h3 className="font-medium mb-3 text-gray-700 text-sm">
                  신분증 파일
                </h3>
                {managerData.managerFileUrls && managerData.managerFileUrls.length > 0 ? (
                  <div className="space-y-2">
                    {managerData.managerFileUrls.map((file, index) => {
                      // 안전한 파일 정보 처리
                      const fileUrl = file?.managerFileUrl || '';
                      const fileType = getFileType(fileUrl);
                      const fileName = file?.originalFileName || `파일 ${index + 1}`;
                      
                      return (
                        <div key={file?.id || index} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                <span className="text-gray-600 text-xs">파일</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                  파일 {index + 1}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {fileName}
                                </span>
                                {fileType === 'unsupported' && (
                                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1">
                                    미리보기 지원 안함
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilePreview(fileUrl)}
                                disabled={fileType === 'unsupported' || !fileUrl}
                                className="text-xs px-3 py-1"
                              >
                                미리보기
                              </Button>
                              {fileUrl && (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                                    다운로드
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500 text-sm">등록된 신분증 파일이 없습니다</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-medium mb-4 text-gray-700 text-sm">
                개인정보
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">이름</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.userName}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">생년월일</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.userBirth}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">성별</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.userGender}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">전화번호</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.userTel}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">이메일</span>
                  <span className="font-medium text-gray-900 text-sm break-all">{managerData.userEmail}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200 md:col-span-2">
                  <span className="text-xs text-gray-500 block mb-1">주소</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.managerAddress}</span>
                </div>
                <div className="bg-white rounded-md p-3 border border-gray-200 md:col-span-3">
                  <span className="text-xs text-gray-500 block mb-1">근무가능시간</span>
                  <span className="font-medium text-gray-900 text-sm">{managerData.managerTime}</span>
                </div>
              </div>
            </div>



            {showRejectInput ? (
              <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-red-800 mb-3">
                    거절 사유
                  </label>
                  <Textarea
                    placeholder="거절 사유를 상세히 입력해주세요..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px] text-sm bg-white border-2 border-red-200 focus:border-red-400 focus:ring-red-200 resize-none rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size="sm"
                    className="bg-white border-gray-500 text-gray-700 hover:bg-gray-100"
                  >
                    취소
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    onClick={handleRejectSubmit}
                    size="sm"
                  >
                    거절하기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={handleRejectClick}
                >
                  거절
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => onApprove(managerData.userId!)}
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
        <DialogContent className="max-w-2xl p-4">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all z-10 shadow-md"
              onClick={() => setIsProfileModalOpen(false)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <img
              src={managerData.userProfile}
              alt="프로필 확대"
              className="w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600 font-medium">{managerData.userName}님의 프로필 사진</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 신분증 파일 미리보기 모달 */}
      <Dialog open={!!selectedFileUrl} onOpenChange={() => setSelectedFileUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-4">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all z-10 shadow-md"
              onClick={() => setSelectedFileUrl(null)}
            >
              <X className="w-4 h-4 text-gray-600" />
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