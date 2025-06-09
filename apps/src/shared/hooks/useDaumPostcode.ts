import { useEffect } from 'react';

declare global {
  interface Window {
    daum: any;
  }
}

interface DaumPostcodeData {
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
}

interface UseDaumPostcodeOptions {
  onComplete: (data: DaumPostcodeData) => void;
}

const useDaumPostcode = (isOpen: boolean, { onComplete }: UseDaumPostcodeOptions) => {
  useEffect(() => {
    if (isOpen && window.daum && window.daum.Postcode) {
      const postcode = new window.daum.Postcode({
        oncomplete: onComplete,
        width: '100%',
        height: '100%',
      });
      postcode.embed(document.getElementById('postcode-container'));
    }
  }, [isOpen, onComplete]);
};

export default useDaumPostcode; 