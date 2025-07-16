import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface WorkHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workHistory: any[];
  userName: string;
}

export function WorkHistoryModal({
  isOpen,
  onClose,
  workHistory,
  userName
}: WorkHistoryModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden bg-white">
        <DialogHeader className="px-6 py-4 bg-white flex-shrink-0 space-y-0 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0 p-0">
              <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
              {userName}님 근무 내역 전체보기
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
          <div className="space-y-4 px-6 pt-4 pb-8">
            {workHistory && workHistory.length > 0 ? (
              workHistory.map((work: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 text-lg">{work.customerName}</span>
                        <Badge variant="outline" className="text-sm">
                          {work.serviceName}
                        </Badge>
                      </div>
                      <div className="text-base text-gray-600 mb-2">
                        <span className="font-medium">근무일:</span> {work.workDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {work.rating ? (
                        <>
                          <span className="text-sm text-gray-500">평점:</span>
                          <div className="flex">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`text-base ${star <= work.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">({work.rating}/5)</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">평점 없음</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">근무 내역이 없습니다</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 