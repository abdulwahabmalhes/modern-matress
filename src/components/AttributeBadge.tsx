import React from 'react';
import { Ruler, Activity, Layers, Feather, Droplets, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AttributeBadgeProps {
  attribute: {
    id: number;
    groupId: number;
    valueEn: string;
    valueAr: string;
    groupNameEn: string;
    groupNameAr: string;
  };
}

export const AttributeBadge: React.FC<AttributeBadgeProps> = ({ attribute }) => {
  const { language } = useLanguage();

  const getIcon = (groupName: string | undefined) => {
    const name = (groupName || '').toLowerCase();
    if (name.includes('height') || name.includes('ارتفاع') || name.includes('سمك')) return <Ruler className="w-3.5 h-3.5" />;
    if (name.includes('spring') || name.includes('coil') || name.includes('نابض') || name.includes('نوابض')) return <Activity className="w-3.5 h-3.5" />;
    if (name.includes('foam') || name.includes('layer') || name.includes('رغوة') || name.includes('طبقة')) return <Layers className="w-3.5 h-3.5" />;
    if (name.includes('soft') || name.includes('firm') || name.includes('comfort') || name.includes('صلابة') || name.includes('راحة')) return <Feather className="w-3.5 h-3.5" />;
    if (name.includes('fabric') || name.includes('material') || name.includes('قماش') || name.includes('خامة')) return <Droplets className="w-3.5 h-3.5" />;
    return <CheckCircle2 className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex items-center gap-1.5 bg-gray-50 border border-cream px-2 py-1 rounded-lg text-dark group-hover:bg-primary/5 transition-colors">
      <div className="text-gray-400 group-hover:text-primary transition-colors">
        {getIcon(attribute.groupNameEn || attribute.groupNameAr)}
      </div>
      <div className="flex flex-col">
        {/* <span className="text-[8px] font-bold uppercase text-gray-400 leading-none">{language === 'ar' ? attribute.groupNameAr : attribute.groupNameEn}</span> */}
        <span className="text-[10px] font-extrabold leading-none">{language === 'ar' ? attribute.valueAr : attribute.valueEn}</span>
      </div>
    </div>
  );
};
