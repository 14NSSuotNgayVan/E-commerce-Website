import React, { useState } from 'react';

interface ScaleImageProps {
  src: string;
  alt?: string;
  scale?: number; // Biên độ scale mà bạn muốn áp dụng khi hover
  className?: string;
}

const ScaleImage: React.FC<ScaleImageProps> = ({ src, alt, scale = 2, className }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => setIsHovering(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMouseX(x);
    setMouseY(y);
  };

  const getTransformStyles = () => {
    if (!isHovering) {
      return {};
    }
    return {
      transform: `scale(${scale})`,
      transformOrigin: `${mouseX}px ${mouseY}px`
    };
  };

  return (
    <div
      className={className || ""}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ overflow: 'hidden', cursor: 'zoom-in' }}
    >
      <img
      className='w-100 h-100 object-position-center object-fit-cover'
        src={src}
        alt={alt}
        style={{
          ...getTransformStyles(),
          transition: 'transform 0.1s ease-out',
          width: '100%', // or set to the width you want
          height: 'auto' // maintain aspect ratio
        }}
      />
    </div>
  );
};

export default ScaleImage;
