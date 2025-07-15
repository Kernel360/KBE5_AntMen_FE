import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface ReviewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewInfo: any;
  userName: string;
  userType: 'manager' | 'customer';
}

export function ReviewListModal({
  isOpen,
  onClose,
  reviewInfo,
  userName,
  userType
}: ReviewListModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
        <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
              {userName}님 리뷰 정보 전체보기
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 px-6 pt-4 pb-8">
            {reviewInfo ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 받은 리뷰 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {userType === 'manager' ? '받은 리뷰 (고객이 작성)' : '받은 리뷰 (매니저가 작성)'}
                    </h3>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">총 {reviewInfo.totalReceivedReviews}개</span>
                      <div className="text-xs text-gray-400">
                        평균 {reviewInfo.averageReceivedRating}/5점
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reviewInfo.receivedReviews && reviewInfo.receivedReviews.length > 0 ? (
                      reviewInfo.receivedReviews.map((review: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{review.targetName}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">({review.rating}/5)</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                          <p className="text-gray-400 text-xs">{review.reviewDate?.slice(0, 10)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        받은 리뷰가 없습니다
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 작성한 리뷰 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {userType === 'manager' ? '작성한 리뷰 (고객에게)' : '작성한 리뷰 (매니저에게)'}
                    </h3>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">총 {reviewInfo.totalWrittenReviews}개</span>
                      <div className="text-xs text-gray-400">
                        평균 {reviewInfo.averageWrittenRating}/5점
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reviewInfo.writtenReviews && reviewInfo.writtenReviews.length > 0 ? (
                      reviewInfo.writtenReviews.map((review: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{review.targetName}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">({review.rating}/5)</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                          <p className="text-gray-400 text-xs">{review.reviewDate?.slice(0, 10)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        작성한 리뷰가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">리뷰 정보를 불러올 수 없습니다</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 