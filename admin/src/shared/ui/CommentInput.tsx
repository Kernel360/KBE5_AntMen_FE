import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Send } from 'lucide-react';

interface CommentInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel?: () => void;
    placeholder?: string;
    rows?: number;
    label?: string;
    submitText?: string;
    cancelText?: string;
    disabled?: boolean;
    isReply?: boolean;
    replyTo?: string;
    className?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
    value,
    onChange,
    onSubmit,
    onCancel,
    placeholder = "댓글을 입력하세요...",
    rows = 4,
    label,
    submitText = "등록",
    cancelText = "취소",
    disabled = false,
    isReply = false,
    replyTo,
    className = ""
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!value.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <Label className="text-gray-700 font-medium">
                    {label}
                    {isReply && replyTo && (
                        <span className="text-blue-700 font-medium text-sm ml-2">
                            {replyTo}님에게 답글
                        </span>
                    )}
                </Label>
            )}
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className="bg-white resize-none"
                disabled={disabled || isSubmitting}
            />
            <div className="flex gap-2">
                <Button 
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!value.trim() || disabled || isSubmitting}
                >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? '처리중...' : submitText}
                </Button>
                {onCancel && (
                    <Button 
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {cancelText}
                    </Button>
                )}
            </div>
        </div>
    );
}; 