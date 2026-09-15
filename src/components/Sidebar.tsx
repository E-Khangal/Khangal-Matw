import React, { useState, useEffect } from 'react';
import { GradeNumber, AuthUser } from '../types';
import { GRADES_LIST, GRADE_TOPICS_CATALOG } from '../data/initialData';
import { visibilityService } from '../services/visibilityService';
import {
  GraduationCap,
  BookOpen,
  FolderKanban,
  Settings,
  ChevronRight,
  Database,
  Printer,
  Sparkles,
  Layers,
  X,
  Sliders,
  LogOut,
  User,
  UserCheck,
  EyeOff,
} from 'lucide-react';

interface SidebarProps {
  selectedGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onOpenAdmin: () => void;
  onOpenQuestionBank: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: AuthUser;
  onOpenSettings: () => void;
  onLogout: () => void;
  pendingRequestsCount?: number;
  onOpenAccessRequests?: () => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedGrade,
  onSelectGrade,
  selectedTopicId,
  onSelectTopic,
  onOpenAdmin,
  onOpenQuestionBank,
  mobileOpen,
  onCloseMobile,
  currentUser,
  onOpenSettings,
  onLogout,
  pendingRequestsCount = 0,
  onOpenAccessRequests,
  isAdmin,
}) => {
  const allGradeTopics = GRADE_TOPICS_CATALOG[selectedGrade] || [];
  const [, setTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTrigger((prev) => prev + 1);
    window.addEventListener('visibility-settings-updated', handleUpdate);
    return () => {
      window.removeEventListener('visibility-settings-updated', handleUpdate);
    };
  }, []);

  // Filter topics for regular users (hide topics hidden by admin)
  const displayedTopics = isAdmin
    ? allGradeTopics
    : allGradeTopics.filter((t) => !visibilityService.isTopicHidden(t.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-14 bg-stone-950/40 backdrop-blur-xs z-30 lg:hidden modal-backdrop"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 w-72 bg-stone-900 text-stone-100 flex flex-col border-r border-stone-800 transition-transform duration-200 ease-in-out lg:sticky lg:top-14 lg:self-start lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:shrink-0 no-print ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Grades Selector Tabs */}
        <div className="p-3 border-b border-stone-800/80 bg-stone-950/40 shrink-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Анги сонгох
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20">
                {isAdmin ? 'Админ' : 'Хэрэглэгч'}
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 lg:hidden cursor-pointer"
                aria-label="Хаах"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {GRADES_LIST.map((grade) => {
              const isSelected = grade === selectedGrade;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    onSelectGrade(grade);
                    // auto pick first available topic
                    const topics = GRADE_TOPICS_CATALOG[grade] || [];
                    const firstAvailable = isAdmin
                      ? topics[0]
                      : topics.find((t) => !visibilityService.isTopicHidden(t.id));
                    if (firstAvailable) {
                      onSelectTopic(firstAvailable.id);
                    }
                  }}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-xs scale-102'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {grade}-р анги
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics List for selected grade */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-1 mb-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <span>{selectedGrade}-р ангийн сэдвүүд</span>
            <span className="text-[10px] text-stone-500">
              {displayedTopics.length} сэдэв
            </span>
          </div>

          {displayedTopics.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              Энэ ангид одоогоор нээлттэй сэдэв алга байна.
            </div>
          ) : (
            <div className="space-y-1">
              {displayedTopics.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                const isHiddenFromUsers = visibilityService.isTopicHidden(topic.id);

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-stone-800 text-amber-400 border border-stone-700 shadow-xs'
                        : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          topic.hasFullPackage ? 'bg-amber-400' : 'bg-stone-600'
                        }`}
                      />
                      <span className="truncate">{topic.title}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      {isAdmin && isHiddenFromUsers && (
                        <span
                          className="text-[9px] px-1 py-0.2 bg-red-500/20 text-red-300 border border-red-500/30 rounded flex items-center space-x-0.5"
                          title="Хэрэглэгчдэд нуугдсан"
                        >
                          <EyeOff className="w-2.5 h-2.5" />
                          <span>Нууц</span>
                        </span>
                      )}
                      {topic.hasFullPackage && !isHiddenFromUsers && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                          Бэлэн
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-amber-400' : 'text-stone-600 group-hover:text-stone-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tools & Settings Navigation */}
        <div className="p-3 border-t border-stone-800 space-y-1.5 bg-stone-950/60 shrink-0">
          {/* Admin tools: ONLY shown for admin */}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => {
                  onOpenQuestionBank();
                  onCloseMobile();
                }}
                className="w-full py-2 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center space-x-2.5 cursor-pointer"
              >
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Асуултын сан / Захиалгат хуудас</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenAdmin();
                  onCloseMobile();
                }}
                className="w-full py-2 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center space-x-2.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">Материал засах / нэмэх</span>
              </button>

              {/* Нэвтрэх хүсэлтүүд (Админд зориулсан) */}
              {onOpenAccessRequests && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAccessRequests();
                    onCloseMobile();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer relative"
                  title="Нэвтрэх хүсэлтүүдийг хянах, зөвшөөрөх"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      {pendingRequestsCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse ring-1 ring-stone-900">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </div>
                    <span className="truncate">Нэвтрэх хүсэлтүүд</span>
                  </div>
                  {pendingRequestsCount > 0 ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-600 text-white font-bold rounded-full animate-pulse">
                      {pendingRequestsCount} шинэ
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 shrink-0" />
                  )}
                </button>
              )}
            </>
          )}

          {/* Тохиргоо (Settings) - Available to all users */}
          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Тохиргоо</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 shrink-0" />
          </button>

          {/* User Profile Info & Logout */}
          <div className="pt-2 border-t border-stone-800/80 mt-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900/90 border border-stone-800">
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white/10">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-stone-200 truncate">
                    {currentUser.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 ml-1.5"
                title="Системээс гарах"
                aria-label="Системээс гарах"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
