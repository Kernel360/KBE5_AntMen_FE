import { FC } from 'react';

interface UnderConstructionProps {
  message?: string;
}

const UnderConstruction: FC<UnderConstructionProps> = ({ 
  message = "곧 새로운 기능으로 찾아뵙겠습니다! 😊" 
}) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h4 
          className="text-xl font-Apple_SD_Gothic_Neo font-semibold text-gray-400"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
};

export default UnderConstruction; 