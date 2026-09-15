import React, { useState, useRef, useEffect } from 'react';
import { PrintSectionsSelection, PrintOptions } from '../types';
import { ChevronDown, Award, X } from 'lucide-react';

interface PrintControlPanelProps {
  selection: PrintSectionsSelection;
  onChangeSelection: (newSelection: PrintSectionsSelection) => void;
  options?: PrintOptions;
  onChangeOptions?: (newOptions: PrintOptions) => void;
}

export const PrintControlPanel: React.FC<PrintControlPanelProps> = ({
  selection,
  onChangeSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: keyof PrintSectionsSelection) => {
    onChangeSelection({
      ...selection,
      [key]: !selection[key],
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedTestsCount = [
    selection.test1,
    selection.test2,
    selection.test3,
    selection.answers,
  ].filter(Boolean).length;

  const anyTestSelected = selectedTestsCount > 0;
  const allTestsSelected =
    selection.test1 && selection.test2 && selection.test3 && selection.answers;

  const handleToggleAllTests = () => {
    const targetState = !allTestsSelected;
    onChangeSelection({
      ...selection,
      test1: targetState,
      test2: targetState,
      test3: targetState,
      answers: targetState,
    });
  };

  return (
    <aside className="print-control-panel bg-white border border-stone-200 rounded-xl p-2.5 sm:p-3 shadow-xs mb-6 sticky top-4 z-20 no-print">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Checkboxes List */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* 1. Онол */}
          <label
            className={`flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1.5 rounded-lg border transition-all ${
              selection.theory
                ? 'bg-amber-50/60 border-amber-200 text-stone-900'
                : 'border-transparent text-stone-700 hover:bg-stone-50 hover:border-stone-200'
            }`}
          >
            <input
              type="checkbox"
              checked={selection.theory}
              onChange={() => toggleSection('theory')}
              className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
            />
            <span>Онол</span>
          </label>

          {/* 2. Жишээ */}
          <label
            className={`flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1.5 rounded-lg border transition-all ${
              selection.examples
                ? 'bg-amber-50/60 border-amber-200 text-stone-900'
                : 'border-transparent text-stone-700 hover:bg-stone-50 hover:border-stone-200'
            }`}
          >
            <input
              type="checkbox"
              checked={selection.examples}
              onChange={() => toggleSection('examples')}
              className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
            />
            <span>Жишээ</span>
          </label>

          {/* 3. Дасгал */}
          <label
            className={`flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none px-2.5 py-1.5 rounded-lg border transition-all ${
              selection.practice
                ? 'bg-amber-50/60 border-amber-200 text-stone-900'
                : 'border-transparent text-stone-700 hover:bg-stone-50 hover:border-stone-200'
            }`}
          >
            <input
              type="checkbox"
              checked={selection.practice}
              onChange={() => toggleSection('practice')}
              className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
            />
            <span>Дасгал</span>
          </label>

          <div className="h-5 w-px bg-stone-200 mx-1 hidden sm:block" />

          {/* 4. СОРИЛ Dropdown Button & Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                anyTestSelected
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
              }`}
              title="Сорил болон хариуны сонголтууд"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Сорил</span>
              {selectedTestsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold leading-none">
                  {selectedTestsCount}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-amber-800' : 'text-stone-400'
                }`}
              />
            </button>

            {/* Dropdown containing the 4 items */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-extrabold text-stone-900">Сорил сонголт</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAllTests}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                  >
                    {allTestsSelected ? 'Арилгах' : 'Бүгдийг сонгох'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {/* 1. Анхан */}
                  <label className="flex items-center space-x-2.5 text-xs font-semibold text-stone-800 cursor-pointer select-none p-2 rounded-lg hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.test1}
                      onChange={() => toggleSection('test1')}
                      className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-900">Анхан</span>
                      <span className="text-[10px] text-stone-500 font-normal">1-р түвшний сорил</span>
                    </div>
                  </label>

                  {/* 2. Дунд */}
                  <label className="flex items-center space-x-2.5 text-xs font-semibold text-stone-800 cursor-pointer select-none p-2 rounded-lg hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.test2}
                      onChange={() => toggleSection('test2')}
                      className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-900">Дунд</span>
                      <span className="text-[10px] text-stone-500 font-normal">2-р түвшний сорил</span>
                    </div>
                  </label>

                  {/* 3. Гүнзгий */}
                  <label className="flex items-center space-x-2.5 text-xs font-semibold text-stone-800 cursor-pointer select-none p-2 rounded-lg hover:bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={selection.test3}
                      onChange={() => toggleSection('test3')}
                      className="w-4 h-4 rounded text-amber-700 border-stone-300 focus:ring-amber-500 accent-amber-700 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-900">Гүнзгий</span>
                      <span className="text-[10px] text-stone-500 font-normal">3-р түвшний сорил</span>
                    </div>
                  </label>

                  {/* 4. Хариу хэвлэх - styled matching user's image */}
                  <label className="flex items-center space-x-2.5 text-xs font-bold text-amber-950 bg-amber-50/90 cursor-pointer select-none p-2 rounded-lg border border-amber-300 hover:bg-amber-100/80 transition-colors mt-2">
                    <input
                      type="checkbox"
                      checked={selection.answers}
                      onChange={() => toggleSection('answers')}
                      className="w-4 h-4 rounded text-amber-700 border-amber-400 focus:ring-amber-500 accent-amber-700 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-amber-900">Хариу хэвлэх</span>
                      <span className="text-[10px] text-amber-700 font-normal">Зөв бодолт, хариунууд</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Active Chips for Tests when selected */}
          {anyTestSelected && (
            <div className="hidden md:flex items-center space-x-1 pl-1">
              {selection.test1 && (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold flex items-center space-x-1 border border-stone-200">
                  <span>Анхан</span>
                  <button
                    type="button"
                    onClick={() => toggleSection('test1')}
                    className="hover:text-red-600 cursor-pointer ml-0.5"
                    title="Анхан сорилыг болих"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selection.test2 && (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold flex items-center space-x-1 border border-stone-200">
                  <span>Дунд</span>
                  <button
                    type="button"
                    onClick={() => toggleSection('test2')}
                    className="hover:text-red-600 cursor-pointer ml-0.5"
                    title="Дунд сорилыг болих"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selection.test3 && (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold flex items-center space-x-1 border border-stone-200">
                  <span>Гүнзгий</span>
                  <button
                    type="button"
                    onClick={() => toggleSection('test3')}
                    className="hover:text-red-600 cursor-pointer ml-0.5"
                    title="Гүнзгий сорилыг болих"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selection.answers && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center space-x-1">
                  <span>Хариу</span>
                  <button
                    type="button"
                    onClick={() => toggleSection('answers')}
                    className="hover:text-red-600 cursor-pointer ml-0.5"
                    title="Хариу хэвлэхийг болих"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

