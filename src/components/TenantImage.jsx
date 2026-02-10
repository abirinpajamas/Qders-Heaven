import { User } from 'lucide-react';

const TenantImage = ({ src, alt, className = "" }) => {
  const imageClass = `w-full h-full object-cover rounded-full ${className}`;
  const containerClass = "w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden";
  
  if (src && src !== 'null' && src !== '') {
    return (
      <div className={containerClass}>
        <img 
          src={`/${src}`} 
          alt={alt || "Tenant"} 
          className={imageClass}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <User className="w-8 h-8 text-primary-600" style={{ display: 'none' }} />
      </div>
    );
  }
  
  return (
    <div className={containerClass}>
      <User className="w-8 h-8 text-primary-600" />
    </div>
  );
};

export default TenantImage;
