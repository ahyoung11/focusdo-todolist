import React, { useState, useEffect, useMemo } from 'react';
import { Task, Category, Priority, FilterType, SortOption, SubTask } from './types/todo';

// Lucide icon SVG components
const Icons = {
  Check: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Star: ({ filled = false, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
    <svg className={`${className} ${filled ? "fill-amber-400 text-amber-400" : "fill-none text-slate-400 hover:text-amber-400"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Sun: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Folder: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Download: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Upload: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Menu: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '업무', color: '#3b82f6' },
  { id: 'personal', name: '개인', color: '#10b981' },
  { id: 'study', name: '공부', color: '#8b5cf6' },
  { id: 'shopping', name: '쇼핑', color: '#f59e0b' },
];

const getTodayStr = () => new Date().toISOString().split('T')[0];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('focusdo_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('focusdo_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('focusdo_dark') === 'true';
  });

  const [currentFilter, setCurrentFilter] = useState<FilterType>('today');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState('work');

  useEffect(() => {
    localStorage.setItem('focusdo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusdo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('focusdo_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: '',
      completed: false,
      dueDate: newDueDate || (currentFilter === 'today' ? getTodayStr() : ''),
      priority: newPriority,
      starred: currentFilter === 'important',
      categoryId: categories.some(c => c.id === currentFilter) ? currentFilter : newCategory,
      subTasks: [],
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDueDate('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t));
  };

  const handleToggleStar = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks(tasks.map(t => t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t));
  };

  const todayStr = getTodayStr();

  const counts = useMemo(() => {
    return {
      today: tasks.filter(t => !t.completed && t.dueDate === todayStr).length,
      important: tasks.filter(t => !t.completed && t.starred).length,
      upcoming: tasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).length,
      all: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
    };
  }, [tasks, todayStr]);

  const filteredTasks = useMemo(() => {
    const list = tasks.filter(task => {
      if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (currentFilter === 'today') return task.dueDate === todayStr || (!task.completed && !task.dueDate);
      if (currentFilter === 'important') return task.starred;
      if (currentFilter === 'upcoming') return task.dueDate && task.dueDate > todayStr;
      if (currentFilter === 'all') return true;
      if (currentFilter === 'completed') return task.completed;
      return task.categoryId === currentFilter;
    });

    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (sortBy === 'priority') {
        const pMap: Record<Priority, number> = { high: 1, medium: 2, low: 3 };
        return pMap[a.priority] - pMap[b.priority];
      }
      if (sortBy === 'due') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, currentFilter, searchQuery, sortBy, todayStr]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 사이드바 */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-200 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
              <Icons.Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">FocusDo</h1>
              <p className="text-[11px] text-slate-500 font-medium">스마트 할 일 관리</p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            {darkMode ? <Icons.Sun className="w-4 h-4 text-amber-400" /> : <Icons.Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">필터</div>
          <SidebarBtn active={currentFilter === 'today'} onClick={() => { setCurrentFilter('today'); setIsMobileSidebarOpen(false); }} icon={<Icons.Calendar className="w-4 h-4 text-blue-500" />} label="오늘 할 일" count={counts.today} />
          <SidebarBtn active={currentFilter === 'important'} onClick={() => { setCurrentFilter('important'); setIsMobileSidebarOpen(false); }} icon={<Icons.Star filled className="w-4 h-4 text-amber-500" />} label="중요한 일" count={counts.important} />
          <SidebarBtn active={currentFilter === 'upcoming'} onClick={() => { setCurrentFilter('upcoming'); setIsMobileSidebarOpen(false); }} icon={<Icons.Clock className="w-4 h-4 text-purple-500" />} label="예정된 일" count={counts.upcoming} />
          <SidebarBtn active={currentFilter === 'all'} onClick={() => { setCurrentFilter('all'); setIsMobileSidebarOpen(false); }} icon={<Icons.Folder className="w-4 h-4 text-slate-500" />} label="전체 목록" count={counts.all} />
          <SidebarBtn active={currentFilter === 'completed'} onClick={() => { setCurrentFilter('completed'); setIsMobileSidebarOpen(false); }} icon={<Icons.Check className="w-4 h-4 text-emerald-500" />} label="완료된 항목" count={counts.completed} />

          <div className="pt-4 pb-1 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">카테고리</span>
            <button onClick={() => setShowCategoryModal(true)} className="text-xs text-blue-500 hover:underline font-medium">관리</button>
          </div>
          {categories.map(cat => (
            <SidebarBtn key={cat.id} active={currentFilter === cat.id} onClick={() => { setCurrentFilter(cat.id); setIsMobileSidebarOpen(false); }} icon={<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />} label={cat.name} count={tasks.filter(t => !t.completed && t.categoryId === cat.id).length} />
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              <span>전체 달성률</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
          <button onClick={() => setShowSettingsModal(true)} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">
            <Icons.Settings className="w-4 h-4" />
            <span>환경설정 및 백업</span>
          </button>
        </div>
      </aside>

      {/* 메인 리스트 */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <Icons.Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-bold">
              {currentFilter === 'today' && '오늘 할 일'}
              {currentFilter === 'important' && '중요한 일'}
              {currentFilter === 'upcoming' && '예정된 일'}
              {currentFilter === 'all' && '전체 할 일 목록'}
              {currentFilter === 'completed' && '완료된 항목'}
              {categories.find(c => c.id === currentFilter)?.name}
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
              {filteredTasks.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색..." className="w-32 md:w-48 pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:outline-none" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border-transparent focus:outline-none">
              <option value="created">최신순</option>
              <option value="due">마감일순</option>
              <option value="priority">우선순위순</option>
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl w-full mx-auto space-y-5">
          {/* 빠른 추가 */}
          <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex-shrink-0" />
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="새로운 할 일을 입력하세요... (Enter 키로 바로 등록)" className="flex-1 text-sm md:text-base bg-transparent border-none focus:outline-none" />
              <button type="submit" disabled={!newTitle.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs md:text-sm font-semibold flex items-center space-x-1">
                <Icons.Plus className="w-4 h-4" />
                <span>추가</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <Icons.Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="bg-transparent border-none text-xs focus:outline-none" />
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)} className="bg-transparent border-none text-xs focus:outline-none font-medium">
                  <option value="high">🔴 높음</option>
                  <option value="medium">🟡 보통</option>
                  <option value="low">🔵 낮음</option>
                </select>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="bg-transparent border-none text-xs focus:outline-none font-medium">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </form>

          {/* 목록 */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 text-sm">표시할 할 일이 없습니다.</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const category = categories.find(c => c.id === task.categoryId);
                const isSelected = selectedTaskId === task.id;
                return (
                  <div key={task.id} onClick={() => setSelectedTaskId(task.id)} className={`group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${task.completed ? 'bg-slate-100/60 dark:bg-slate-900/40 border-transparent opacity-70' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }} className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 hover:border-emerald-500'}`}>
                        {task.completed && <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm md:text-base font-medium truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                          {category && <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${category.color}15`, color: category.color }}>{category.name}</span>}
                          {task.dueDate && <span className="text-slate-400">{task.dueDate}</span>}
                          {task.priority === 'high' && <span className="text-rose-500 text-[10px]">높음</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleToggleStar(task.id)} className="p-1.5 text-slate-400 hover:text-amber-400"><Icons.Star filled={task.starred} className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Icons.Trash className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* 상세 드로어 */}
      {selectedTask && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">태스크 상세정보</span>
            <button onClick={() => setSelectedTaskId(null)} className="p-1.5 text-slate-400 hover:text-slate-600"><Icons.X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <textarea value={selectedTask.title} onChange={(e) => handleUpdateTask({ ...selectedTask, title: e.target.value })} rows={2} className="w-full bg-transparent border-none text-base font-semibold focus:outline-none" />
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 text-xs border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">마감일</span>
                <input type="date" value={selectedTask.dueDate || ''} onChange={(e) => handleUpdateTask({ ...selectedTask, dueDate: e.target.value })} className="bg-white dark:bg-slate-900 border rounded px-2 py-1 text-xs" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">우선순위</span>
                <select value={selectedTask.priority} onChange={(e) => handleUpdateTask({ ...selectedTask, priority: e.target.value as Priority })} className="bg-white dark:bg-slate-900 border rounded px-2 py-1 text-xs">
                  <option value="high">🔴 높음</option>
                  <option value="medium">🟡 보통</option>
                  <option value="low">🔵 낮음</option>
                </select>
              </div>
            </div>
            <textarea value={selectedTask.description} onChange={(e) => handleUpdateTask({ ...selectedTask, description: e.target.value })} rows={4} placeholder="메모 / 설명..." className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none" />
          </div>
        </div>
      )}

      {/* 카테고리 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">카테고리 관리</h3>
              <button onClick={() => setShowCategoryModal(false)}><Icons.X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 mb-4">
              {categories.map(c => (
                <div key={c.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 환경설정 모달 */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-5 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">환경설정</h3>
              <button onClick={() => setShowSettingsModal(false)}><Icons.X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              <button onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ tasks, categories }, null, 2));
                const a = document.createElement('a');
                a.href = dataStr;
                a.download = `backup_${todayStr}.json`;
                a.click();
              }} className="w-full flex items-center justify-center space-x-2 p-2 border rounded-xl text-xs">
                <Icons.Download className="w-4 h-4 text-blue-500" />
                <span>데이터 백업 (JSON 다운로드)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'}`}>
      <div className="flex items-center space-x-2.5 truncate">{icon}<span className="truncate">{label}</span></div>
      {count > 0 && <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${active ? 'bg-blue-200/60 dark:bg-blue-800/60 text-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{count}</span>}
    </button>
  );
}

