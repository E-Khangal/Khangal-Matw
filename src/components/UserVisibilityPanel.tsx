import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckSquare, Square, ShieldCheck, Copy, Check } from 'lucide-react';
import { visibilityService, TopicSectionVisibility } from '../services/visibilityService';

interface UserVisibilityPanelProps {
  topicId: string;
  topicTitle: string;
  onPreviewAsUser: () => void;
}

export const UserVisibilityPanel: React.FC<UserVisibilityPanelProps> = ({
  topicId,
  topicTitle,
  onPreviewAsUser,
}) => {
  const [visibility, setVisibility] = useState<TopicSectionVisibility>(() =>
    visibilityService.getTopicVisibility(topicId)
  );
  const [isHidden, setIsHidden] = useState<boolean>(() =>
    visibilityService.isTopicHidden(topicId)
  );
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    setVisibility(visibilityService.getTopicVisibility(topicId));
    setIsHidden(visibilityService.isTopicHidden(topicId));
  }, [topicId]);

  const handleToggle = (key: keyof TopicSectionVisibility) => {
    const updated = { ...visibility, [key]: !visibility[key] };
    setVisibility(updated);
    visibilityService.setTopicVisibility(topicId, updated);
  };

  const handleToggleHidden = () => {
    const newHidden = !isHidden;
    setIsHidden(newHidden);
    visibilityService.setTopicHidden(topicId, newHidden);
  };

  const handleSelectAll = () => {
    const allOn: TopicSectionVisibility = {
      theory: true,
      examples: true,
      practice: true,
      test1: true,
      test2: true,
      test3: true,
      answers: true,
    };
    setVisibility(allOn);
    visibilityService.setTopicVisibility(topicId, allOn);
  };

  const handleStandardOnly = () => {
    const standard: TopicSectionVisibility = {
      theory: true,
      examples: true,
      practice: true,
      test1: false,
      test2: false,
      test3: false,
      answers: false,
    };
    setVisibility(standard);
    visibilityService.setTopicVisibility(topicId, standard);
  };

  const handleApplyToAll = () => {
    visibilityService.applyAsDefault(topicId);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const sections: { key: keyof TopicSectionVisibility; label: string; desc: string }[] = [
    { key: 'theory', label: 'Онол, дүрэм', desc: 'Үндсэн тодорхойлолт, томьёо' },
    { key: 'examples', label: 'Бодолттой жишээ', desc: 'Алхамчилсан бодолтууд' },
    { key: 'practice', label: 'Бие даах дасгал', desc: 'Сурагчийн бодлогууд' },
    { key: 'test1', label: 'Сорил 1 (Анхан)', desc: '10 онооны анхан сорил' },
    { key: 'test2', label: 'Сорил 2 (Дунд)', desc: '10 онооны дунд сорил' },
    { key: 'test3', label: 'Сорил 3 (Гүнзгий)', desc: '10 онооны гүнзгий сорил' },
    { key: 'answers', label: 'Хариу ба бодолт', desc: 'Бүх бодлогын эцсийн хариу' },
  ];

  return (
    <div className="no-print mb-5 bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-stone-50 border-2 border-amber-300/80 rounded-2xl p-4 md:p-5 shadow-xs transition-all">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs md:text-sm font-black text-stone-900 tracking-tight">
                Хэрэглэгчдэд харагдах эрхийн тохиргоо
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Админ удирдлага
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Хүсэлтээр орсон хэрэглэгчдэд «{topicTitle}» хичээлээс юу юу харагдахыг доорх нүднүүдийг чеклэж тохируулна
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
          <button
            type="button"
            onClick={handleToggleHidden}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
              isHidden
                ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Энэ сэдвийг хэрэглэгчийн жагсаалтад бүхэлд нь харуулах эсэх"
          >
            {isHidden ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-red-600" />
                <span>Сэдэв нуугдсан</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Сэдэв нээлттэй</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onPreviewAsUser}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-900 hover:bg-black text-amber-400 flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            title="Хэрэглэгчдэд яг одоо яаж харагдаж байгааг шалгах"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Хэрэглэгчийн харагдацаар харах</span>
          </button>
        </div>
      </div>

      {/* Checkbox Pills Grid */}
      <div className="pt-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
            Хичээл дундаас хэрэглэгчдэд нээх хэсгүүд:
          </span>
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              type="button"
              onClick={handleStandardOnly}
              className="text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Зөвхөн онол, дасгал
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Бүгдийг нээх
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={handleApplyToAll}
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 cursor-pointer"
              title="Энэ сонголтыг бусад бүх сэдвүүдийн анхдагч болгож тохируулах"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Бүх сэдэвт хадгалагдлаа</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Бүх сэдэвт хуулах</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {sections.map(({ key, label, desc }) => {
            const checked = visibility[key];
            return (
              <label
                key={key}
                onClick={() => handleToggle(key)}
                className={`flex items-start space-x-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  checked
                    ? 'bg-white border-amber-400 shadow-2xs text-stone-950 ring-1 ring-amber-400/50'
                    : 'bg-stone-100/80 border-stone-200 text-stone-500 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold leading-tight ${checked ? 'text-stone-950' : 'text-stone-600'}`}>
                    {label}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate mt-0.5">
                    {desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
