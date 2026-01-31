'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Settings, Star, Database } from 'lucide-react';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'সারসংক্ষেপ', icon: <FileText size={16} /> },
    { id: 'specs', label: 'বৈশিষ্ট্য', icon: <Settings size={16} /> },
    { id: 'reviews', label: 'মতামত', icon: <Star size={16} /> },
  ];

  const specs = product?.specifications || [];

  return (
    <div className="mt-10 border-t border-border/20 pt-5">
      {/* --- Navigation Layout --- */}
      <div className="flex items-center gap-8 md:gap-12 mb-10 overflow-x-auto no-scrollbar border-b border-border/10">
        {tabs.map((tab) => (
          <button
            aria-label={tab.label}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2.5 pb-4 shrink-0 transition-all group"
          >
            <span
              className={`transition-colors duration-300 ${
                activeTab === tab.id ? 'text-primary' : 'text-pText/40 group-hover:text-pText'
              }`}
            >
              {tab.icon}
            </span>
            <span
              className={`font-black uppercase text-xs md:text-sm transition-colors duration-300 ${
                activeTab === tab.id ? 'text-text' : 'text-pText/40 group-hover:text-pText'
              }`}
            >
              {tab.label}
            </span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-4px_10px_rgba(41,252,86,0.5)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* --- Content Area --- */}
      <div className="min-h-45">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <p className="text-pText/80 text-base md:text-lg leading-relaxed italic font-medium border-l-2 border-primary/20 pl-6">
                  {product?.description || 'এই পণ্যটির জন্য কোন বর্ণনা পাওয়া যায়নি।'}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {specs.length > 0 ? (
                  specs.map((item, i) => (
                    <div
                      key={item._id || i}
                      className="flex justify-between items-center py-5 border-b border-border/10 group/item transition-all hover:px-2"
                    >
                      <span className="text-pText/40 font-black uppercase text-[9px] group-hover/item:text-primary transition-colors">
                        {item.key}
                      </span>
                      <span className="font-bold text-sm tracking-tight text-text/90 italic">
                        {item.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 flex flex-col items-center opacity-20">
                    <Database size={40} className="mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-center">
                      কারিগরি তথ্য পাওয়া যায়নি
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/20 rounded-3xl">
                <Star className="text-primary/20 mb-4" size={32} />
                <p className="text-pText font-black uppercase text-[10px]">
                  এখনও কোনো রিভিউ দেওয়া হয়নি
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
