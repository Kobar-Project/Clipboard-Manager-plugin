import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

// --- Translations ---
const TRANSLATIONS = {
    en: { copy: "Copy", paste: "Paste", numberOfSlots: "Number of Clipboard Slots", slotsMinMaxInfo: "Min: 4, Max: 20 slots.", emptySlotTip: "Copy items to fill slots", stopCopyMode: "Stop Copy Mode", startCopyMode: "Start Copy Mode", stopPasteMode: "Stop Paste Mode", startPasteMode: "Start Paste Mode", autoAddClipboard: "Auto-add to Clipboard", autoAddClipboardDesc: "Automatically send picked colors to the Sequential Clipboard slots.", imagePreview: "Image Content", copyAndPaste: "Copy & Paste", settings: "Settings" },
    tr: { copy: "Kopyala", paste: "Yapıştır", numberOfSlots: "Pano Slot Sayısı", slotsMinMaxInfo: "Min: 4, Maks: 20 slot.", emptySlotTip: "Slotları doldurmak için kopyalama yapın", stopCopyMode: "Kopyalama Modunu Durdur", startCopyMode: "Kopyalama Modunu Başlat", stopPasteMode: "Yapıştırma Modunu Durdur", startPasteMode: "Yapıştırma Modunu Başlat", autoAddClipboard: "Panoya Otomatik Ekle", autoAddClipboardDesc: "Seçilen renkleri otomatik olarak Sıralı Pano yuvalarına gönderir.", imagePreview: "Resim İçeriği", copyAndPaste: "Kopyala ve Yapıştır", settings: "Ayarlar" },
    de: { copy: "Kopieren", paste: "Einfügen", numberOfSlots: "Anzahl der Slots", slotsMinMaxInfo: "Min: 4, Max: 20 Slots.", emptySlotTip: "Kopieren, um Slots zu füllen", stopCopyMode: "Kopiermodus stoppen", startCopyMode: "Kopiermodus starten", stopPasteMode: "Einfügemodus stoppen", startPasteMode: "Einfügemodus starten", autoAddClipboard: "Autom. zur Ablage hinzufügen", autoAddClipboardDesc: "Ausgewählte Farben automatisch an die Slots senden.", imagePreview: "Bildinhalt", copyAndPaste: "Kopieren & Einfügen", settings: "Einstellungen" },
    fr: { copy: "Copier", paste: "Coller", numberOfSlots: "Nombre d'emplacements", slotsMinMaxInfo: "Min: 4, Max: 20.", emptySlotTip: "Copiez des éléments pour remplir", stopCopyMode: "Arrêter le mode copie", startCopyMode: "Démarrer le mode copie", stopPasteMode: "Arrêter le mode collage", startPasteMode: "Démarrer le mode collage", autoAddClipboard: "Ajout auto. au presse-papiers", autoAddClipboardDesc: "Envoyer automatiquement les couleurs aux emplacements.", imagePreview: "Contenu de l'image", copyAndPaste: "Copier et Coller", settings: "Paramètres" },
    es: { copy: "Copiar", paste: "Pegar", numberOfSlots: "Número de ranuras", slotsMinMaxInfo: "Mín: 4, Máx: 20.", emptySlotTip: "Copiar elementos para llenar", stopCopyMode: "Detener modo de copia", startCopyMode: "Iniciar modo de copia", stopPasteMode: "Detener modo de pegar", startPasteMode: "Iniciar modo de pegar", autoAddClipboard: "Autocompletar portapapeles", autoAddClipboardDesc: "Enviar colores automáticamente a las ranuras.", imagePreview: "Contenido de imagen", copyAndPaste: "Copiar y Pegar", settings: "Ajustes" },
    ja: { copy: "コピー", paste: "貼り付け", numberOfSlots: "スロット数", slotsMinMaxInfo: "最小: 4, 最大: 20", emptySlotTip: "コピーしてスロットを埋める", stopCopyMode: "コピーモードを停止", startCopyMode: "コピーモードを開始", stopPasteMode: "貼り付けモードを停止", startPasteMode: "貼り付けモードを開始", autoAddClipboard: "自動追加", autoAddClipboardDesc: "選択した色をスロットに自動送信します。", imagePreview: "画像コンテンツ", copyAndPaste: "コピー＆ペースト", settings: "設定" },
    ru: { copy: "Копировать", paste: "Вставить", numberOfSlots: "Количество слотов", slotsMinMaxInfo: "Мин: 4, Макс: 20.", emptySlotTip: "Скопируйте, чтобы заполнить слоты", stopCopyMode: "Остановить копирование", startCopyMode: "Начать копирование", stopPasteMode: "Остановить вставку", startPasteMode: "Начать вставку", autoAddClipboard: "Авто-добавление", autoAddClipboardDesc: "Автоматическая отправка цветов в слоты.", imagePreview: "Содержимое изображения", copyAndPaste: "Копировать и вставить", settings: "Настройки" },
    ar: { copy: "نسخ", paste: "لصق", numberOfSlots: "عدد الخانات", slotsMinMaxInfo: "الحد الأدنى: 4، الحد الأقصى: 20.", emptySlotTip: "انسخ لملء الخانات", stopCopyMode: "إيقاف وضع النسخ", startCopyMode: "بدء وضع النسخ", stopPasteMode: "إيقاف وضع اللصق", startPasteMode: "بدء وضع اللصق", autoAddClipboard: "إضافة تلقائية", autoAddClipboardDesc: "إرسال الألوان المحددة تلقائيًا.", imagePreview: "محتوى الصورة", copyAndPaste: "نسخ ولصق", settings: "إعدادات" },
    zh: { copy: "复制", paste: "粘贴", numberOfSlots: "剪贴板插槽数", slotsMinMaxInfo: "最小：4，最大：20", emptySlotTip: "复制项目以填充插槽", stopCopyMode: "停止复制模式", startCopyMode: "开始复制模式", stopPasteMode: "停止粘贴模式", startPasteMode: "开始粘贴模式", autoAddClipboard: "自动添加到剪贴板", autoAddClipboardDesc: "自动将选定的颜色发送到插槽。", imagePreview: "图像内容", copyAndPaste: "复制与粘贴", settings: "设置" },
    hi: { copy: "कॉपी", paste: "पेस्ट", numberOfSlots: "स्लॉट की संख्या", slotsMinMaxInfo: "न्यूनतम: 4, अधिकतम: 20.", emptySlotTip: "स्लॉट भरने के लिए कॉपी करें", stopCopyMode: "कॉपी मोड रोकें", startCopyMode: "कॉपी मोड प्रारंभ करें", stopPasteMode: "पेस्ट मोड रोकें", startPasteMode: "पेस्ट मोड प्रारंभ करें", autoAddClipboard: "स्वतः जोड़ें", autoAddClipboardDesc: "स्लॉट में स्वतः रंग भेजें।", imagePreview: "छवि सामग्री", copyAndPaste: "कॉपी और पेस्ट", settings: "सेटिंग्स" }
};

const t = (key) => {
    const store = window.useAppStore?.getState() || { language: 'en' };
    const lang = store.language || 'en';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
};

// --- Zustand Store Initialization ---
let initialSlotCount = 8;
let initialAutoHideDuration = 5000;
try {
    const saved = localStorage.getItem('kobar-plugin-clipboard-settings');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slotCount) initialSlotCount = parsed.slotCount;
        if (parsed.autoHideDuration !== undefined) initialAutoHideDuration = parsed.autoHideDuration;
    }
} catch(e){}

const usePluginStore = create((set, get) => ({
    slots: Array(initialSlotCount).fill().map(() => ({ state: 'empty', type: null, content: null })),
    slotCount: initialSlotCount,
    isCopyModeActive: false,
    isPasteModeActive: false,
    autoHideDuration: initialAutoHideDuration,

    setSlotCount: (count) => set((state) => {
        let newSlots = [...state.slots];
        if (count > newSlots.length) {
            const addedSlots = Array(count - newSlots.length).fill().map(() => ({ state: 'empty', type: null, content: null }));
            newSlots = [...newSlots, ...addedSlots];
        } else if (count < newSlots.length) {
            newSlots = newSlots.slice(0, count);
        }
        localStorage.setItem('kobar-plugin-clipboard-settings', JSON.stringify({ 
            slotCount: count,
            autoHideDuration: state.autoHideDuration
        }));
        return { slotCount: count, slots: newSlots };
    }),

    setAutoHideDuration: (ms) => set((state) => {
        localStorage.setItem('kobar-plugin-clipboard-settings', JSON.stringify({ 
            slotCount: state.slotCount, 
            autoHideDuration: ms 
        }));
        return { autoHideDuration: ms };
    }),

    toggleCopyMode: () => set((state) => {
        if (state.isCopyModeActive) {
            window.api?.stopClipboardListener?.();
            return {
                isCopyModeActive: false,
                slots: state.slots.map(s => s.state === 'listening' ? { ...s, state: 'empty' } : s)
            };
        } else {
            const firstEmpty = state.slots.findIndex(s => s.state === 'empty');
            if (firstEmpty !== -1) {
                window.api?.startClipboardListener?.();
                const newSlots = [...state.slots];
                newSlots[firstEmpty] = { ...newSlots[firstEmpty], state: 'listening' };
                return {
                    isCopyModeActive: true,
                    isPasteModeActive: false,
                    slots: newSlots
                };
            }
        }
        return state;
    }),

    togglePasteMode: () => set((state) => {
        if (state.isPasteModeActive) {
            window.api?.setGlobalPasteMode?.(false);
            return {
                isPasteModeActive: false,
                slots: state.slots.map(s => s.state === 'selected' ? { ...s, state: 'filled' } : s)
            };
        } else {
            const firstFilled = state.slots.findIndex(s => s.state === 'filled');
            if (firstFilled !== -1) {
                window.api?.stopClipboardListener?.();
                window.api?.setGlobalPasteMode?.(true);
                const newSlots = state.slots.map(s => s.state === 'listening' ? { ...s, state: 'empty' } : s);
                newSlots[firstFilled] = { ...newSlots[firstFilled], state: 'selected' };
                return {
                    isPasteModeActive: true,
                    isCopyModeActive: false,
                    slots: newSlots
                };
            }
        }
        return state;
    }),

    addClipboardItem: (type, content) => set((state) => {
        if (!state.isCopyModeActive) return state;
        const listeningIndex = state.slots.findIndex(s => s.state === 'listening');
        if (listeningIndex === -1) return state;

        let newSlots = [...state.slots];
        newSlots[listeningIndex] = { state: 'filled', type, content };

        const nextEmptyIndex = newSlots.findIndex((s, i) => i > listeningIndex && s.state === 'empty');
        let isCopyModeActive = true;
        if (nextEmptyIndex !== -1) {
            newSlots[nextEmptyIndex] = { ...newSlots[nextEmptyIndex], state: 'listening' };
        } else {
            isCopyModeActive = false;
            window.api?.stopClipboardListener?.();
        }
        return { slots: newSlots, isCopyModeActive };
    }),

    pasteNextItem: () => set((state) => {
        if (!state.isPasteModeActive) return state;
        const selectedIndex = state.slots.findIndex(s => s.state === 'selected');
        if (selectedIndex === -1) return state;

        let newSlots = [...state.slots];
        const item = { ...newSlots[selectedIndex] };
        newSlots[selectedIndex] = { state: 'empty', type: null, content: null };

        const nextFilledIndex = newSlots.findIndex((s, i) => i > selectedIndex && s.state === 'filled');
        let isPasteModeActive = true;
        if (nextFilledIndex !== -1) {
            newSlots[nextFilledIndex] = { ...newSlots[nextFilledIndex], state: 'selected' };
        } else {
            isPasteModeActive = false;
            window.api?.setGlobalPasteMode?.(false);
        }
        return { slots: newSlots, isPasteModeActive };
    }),

    clearSlot: (index) => set((state) => {
        if (state.slots[index].state === 'filled') {
            const newSlots = [...state.slots];
            newSlots[index] = { state: 'empty', type: null, content: null };
            return { slots: newSlots };
        }
        return state;
    }),

    resetAll: () => set((state) => {
        window.api?.stopClipboardListener?.();
        window.api?.setGlobalPasteMode?.(false);
        return {
            slots: Array(state.slotCount).fill().map(() => ({ state: 'empty', type: null, content: null })),
            isCopyModeActive: false,
            isPasteModeActive: false
        };
    }),

    setListeningSlot: (index) => set((state) => {
        if (!state.isCopyModeActive || state.slots[index].state !== 'empty') return state;
        let newSlots = state.slots.map(s => s.state === 'listening' ? { ...s, state: 'empty' } : s);
        newSlots[index] = { ...newSlots[index], state: 'listening' };
        return { slots: newSlots };
    }),

    setSelectedSlot: (index) => set((state) => {
        if (!state.isPasteModeActive || state.slots[index].state !== 'filled') return state;
        let newSlots = state.slots.map(s => s.state === 'selected' ? { ...s, state: 'filled' } : s);
        newSlots[index] = { ...newSlots[index], state: 'selected' };
        return { slots: newSlots };
    }),

    forceAddClipboardItem: (type, content) => set((state) => {
        let newSlots = [...state.slots];
        const listeningIndex = newSlots.findIndex(s => s.state === 'listening');
        const targetIndex = listeningIndex !== -1 ? listeningIndex : newSlots.findIndex(s => s.state === 'empty');
        
        let isCopyModeActive = state.isCopyModeActive;

        if (targetIndex !== -1) {
            newSlots[targetIndex] = { state: 'filled', type, content };
            if (isCopyModeActive && listeningIndex !== -1) {
                const nextEmptyIndex = newSlots.findIndex((s, i) => i > targetIndex && s.state === 'empty');
                if (nextEmptyIndex !== -1) {
                    newSlots[nextEmptyIndex] = { ...newSlots[nextEmptyIndex], state: 'listening' };
                } else {
                    isCopyModeActive = false;
                    window.api?.stopClipboardListener?.();
                }
            }
        } else {
            newSlots.shift();
            newSlots.push({ state: 'filled', type, content });
        }
        return { slots: newSlots, isCopyModeActive };
    })
}));

window.KoBarClipboardAPI = {
    forceAddClipboardItem: (type, content) => {
        usePluginStore.getState().forceAddClipboardItem(type, content);
    }
};

// --- UI Components ---
function getSlotColorClass(state, design) {
    switch (state) {
        case 'empty': return 'radio-grey';
        case 'listening': return 'radio-blue';
        case 'filled': return 'radio-green';
        case 'selected': return `radio-green ring-2 ring-primary ring-offset-1 ${design === 'style2' ? 'ring-offset-transparent' : 'ring-offset-[var(--theme-bg-dark)]'}`;
        default: return 'radio-grey';
    }
}

const TooltipButton = ({ onClick, onDoubleClick, className, label, children }) => {
    return (
        <button 
            onClick={onClick} 
            onDoubleClick={onDoubleClick} 
            title={label} 
            className={className}
        >
            {children}
        </button>
    );
};

const InlineClipboardUI = () => {
    const slots = usePluginStore(state => state.slots);
    const isCopyModeActive = usePluginStore(state => state.isCopyModeActive);
    const isPasteModeActive = usePluginStore(state => state.isPasteModeActive);
    const autoHideDuration = usePluginStore(state => state.autoHideDuration);
    
    // Actions
    const { toggleCopyMode, togglePasteMode, resetAll, addClipboardItem, pasteNextItem, clearSlot, setListeningSlot, setSelectedSlot } = usePluginStore.getState();

    // Subscribe to KoBar app store natively
    const [appState, setAppState] = useState(() => {
        const store = window.useAppStore?.getState() || {};
        return { orientation: store.orientation || 'horizontal', design: store.design || 'style1', edgePosition: store.edgePosition || 'top' };
    });

    useEffect(() => {
        if (!window.useAppStore) return;
        return window.useAppStore.subscribe((state) => {
            setAppState({ orientation: state.orientation, design: state.design, edgePosition: state.edgePosition });
        });
    }, []);

    const { orientation, design, edgePosition } = appState;

    const [activePreviewSlot, setActivePreviewSlot] = useState(null);
    const referenceRef = useRef(null);
    const floatingRef = useRef(null);
    const [floatingStyle, setFloatingStyle] = useState({ top: -9999, left: -9999 });

    // Register IPC Listeners
    useEffect(() => {
        let cleanupUpdate = null;
        let cleanupPaste = null;

        if (window.api?.onClipboardUpdate) {
            cleanupUpdate = window.api.onClipboardUpdate((data) => {
                usePluginStore.getState().addClipboardItem(data.type, data.content);
            });
        }
        
        return () => {
            if (cleanupUpdate) cleanupUpdate();
            if (cleanupPaste) cleanupPaste();
        };
    }, []); // Run once on mount

    // Register request-next-paste listener dynamically based on paste mode
    useEffect(() => {
        let cleanupPaste = null;
        let lastPasteTime = 0; // Debounce state

        if (isPasteModeActive && window.api?.onRequestNextPaste) {
            cleanupPaste = window.api.onRequestNextPaste(() => {
                const now = Date.now();
                if (now - lastPasteTime < 300) return; // Prevent double trigger within 300ms
                lastPasteTime = now;

                const state = usePluginStore.getState(); // Read fresh from global
                const targetSlot = state.slots.find(s => s.state === 'selected') || state.slots.find(s => s.state === 'filled');
                if (targetSlot && targetSlot.content && targetSlot.type) {
                    window.api?.executeGlobalPaste({ type: targetSlot.type, content: targetSlot.content });
                    state.pasteNextItem();
                }
            });
        }
        return () => {
            if (cleanupPaste) cleanupPaste();
        };
    }, [isPasteModeActive]);

    useEffect(() => {
        const hasPasteable = slots.some(s => s.state === 'filled' || s.state === 'selected');
        if (isPasteModeActive && !hasPasteable) {
            window.api?.setGlobalPasteMode?.(false);
            usePluginStore.setState({ isPasteModeActive: false });
        }
    }, [isPasteModeActive, slots]);

    const handleSlotClick = (e, index, state) => {
        e.preventDefault();
        if (!isCopyModeActive && (state === 'filled' || state === 'selected')) {
            if (activePreviewSlot === index) {
                setActivePreviewSlot(null);
                referenceRef.current = null;
            } else {
                referenceRef.current = e.currentTarget;
                setActivePreviewSlot(index);
            }
            if (isPasteModeActive) {
                setSelectedSlot(index);
                const slotData = slots[index];
                if (slotData && slotData.content && slotData.type) {
                    window.api?.writeToClipboard({ type: slotData.type, content: slotData.content });
                }
            }
            return;
        }
        if (isCopyModeActive && state === 'empty') {
            setListeningSlot(index);
        }
    };

    // Mathematical Positioning using Floating UI
    useEffect(() => {
        if (activePreviewSlot !== null && referenceRef.current && floatingRef.current) {
            computePosition(referenceRef.current, floatingRef.current, {
                placement: orientation === 'horizontal' ? (edgePosition === 'top' ? 'bottom' : 'top') : (edgePosition === 'left' ? 'right' : 'left'),
                middleware: [offset(12), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
                setFloatingStyle({ left: x, top: y });
            });
        }
    }, [activePreviewSlot, orientation, edgePosition]);

    // Close preview on outside click
    useEffect(() => {
        if (activePreviewSlot !== null) {
            let timer = null;
            if (autoHideDuration > 0) {
                timer = setTimeout(() => {
                    setActivePreviewSlot(null);
                    referenceRef.current = null;
                }, autoHideDuration);
            }
            
            const handleOutsideClick = (e) => {
                const portal = document.getElementById('clipboard-preview-portal');
                if (portal && portal.contains(e.target)) return;
                setActivePreviewSlot(null);
                referenceRef.current = null;
            };
            document.addEventListener('mousedown', handleOutsideClick);
            return () => {
                if (timer) clearTimeout(timer);
                document.removeEventListener('mousedown', handleOutsideClick);
            };
        }
    }, [activePreviewSlot, autoHideDuration]);

    const truncateContent = (content, limit = 150) => {
        if (typeof content !== 'string') return '';
        if (content.length <= limit) return content;
        return content.substring(0, limit) + '...';
    };

    // Portal logic for preview
    const renderPreviewPortal = () => {
        if (activePreviewSlot === null) return null;
        const slotData = slots[activePreviewSlot];
        if (!slotData?.content) return null;

        return createPortal(
            <div 
                id="clipboard-preview-portal"
                ref={floatingRef}
                className="fixed z-[999999] animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-auto"
                style={{
                    left: `${floatingStyle.left}px`,
                    top: `${floatingStyle.top}px`
                }}
            >
                <div className="bg-black/90 backdrop-blur-3xl text-white text-xs p-3 rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 w-64 max-w-xs break-words flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <span className="font-bold text-slate-300">Preview</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActivePreviewSlot(null);
                                referenceRef.current = null;
                            }}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-32 custom-scrollbar pr-1 select-text">
                        {slotData.type === 'image' ? <span className="italic opacity-50">{t('imagePreview')}</span> : truncateContent(slotData.content, 500)}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className={`flex ${orientation === 'horizontal' ? 'flex-row h-full' : 'flex-col w-full'} items-center justify-center gap-2 relative no-drag-region`}>
            {/* Copy Button */}
            <TooltipButton
                onClick={toggleCopyMode}
                onDoubleClick={resetAll}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCopyModeActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-[var(--theme-primary)] hover:bg-white/10 shadow-lg'
                }`}
                label={isCopyModeActive ? t('stopCopyMode') : t('startCopyMode')}
            >
                <span className="material-symbols-outlined text-[24px]">content_copy</span>
            </TooltipButton>

            {/* Slots Grid */}
            <div className={`flex flex-wrap justify-center content-center ${orientation === 'horizontal' ? 'gap-1.5 h-full max-h-[80px]' : 'gap-2 w-full max-w-full px-1'} relative`} onClick={e => e.stopPropagation()}>
                {slots.map((slot, index) => (
                    <label
                        key={index}
                        title={slot.content ? (slot.type === 'image' ? t('imagePreview') : truncateContent(slot.content, 100)) : t('emptySlotTip')}
                        className={`relative flex items-center justify-center cursor-pointer transition-transform ${activePreviewSlot === index ? 'scale-125 z-10' : 'hover:scale-110'} ${!isCopyModeActive && !isPasteModeActive && slot.state === 'empty' ? 'opacity-50' : 'opacity-100'}`}
                        onClick={(e) => handleSlotClick(e, index, slot.state)}
                        onDoubleClick={(e) => { e.preventDefault(); clearSlot(index); }}
                    >
                        <input
                            readOnly
                            checked={slot.state !== 'empty'}
                            className={`custom-radio ${getSlotColorClass(slot.state, design)} pointer-events-none`}
                            type="radio"
                        />
                    </label>
                ))}
            </div>

            {/* Paste Button */}
            <TooltipButton
                onClick={togglePasteMode}
                onDoubleClick={resetAll}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isPasteModeActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-white/5 text-slate-400 hover:text-[var(--theme-primary)] hover:bg-white/10 shadow-lg'
                }`}
                label={isPasteModeActive ? t('stopPasteMode') : t('startPasteMode')}
            >
                <span className="material-symbols-outlined text-[24px]">content_paste</span>
            </TooltipButton>
            
            {renderPreviewPortal()}
        </div>
    );
};

const SettingsPanelUI = () => {
    const slotCount = usePluginStore(state => state.slotCount);
    const autoHideDuration = usePluginStore(state => state.autoHideDuration);
    const { setSlotCount, setAutoHideDuration } = usePluginStore.getState();

    return (
        <div className="flex flex-col gap-4 text-white">
            <h3 className="text-lg font-bold border-b border-white/10 pb-2">{t('copyAndPaste')} {t('settings')}</h3>
            
            <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300">{t('numberOfSlots')}</label>
                <input 
                    type="range" 
                    min="4" max="20" step="1" 
                    value={slotCount} 
                    onChange={(e) => setSlotCount(Number(e.target.value))}
                    className="w-full accent-[var(--theme-primary)]"
                />
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>4</span>
                    <span>{slotCount}</span>
                    <span>20</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{t('slotsMinMaxInfo')}</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm text-slate-300">Tooltip Auto-Hide Duration</label>
                <select 
                    className="bg-black/40 border border-white/10 rounded p-1 text-sm text-white focus:outline-none focus:border-[var(--theme-primary)]"
                    value={autoHideDuration} 
                    onChange={(e) => setAutoHideDuration(Number(e.target.value))}
                >
                    <option value={1000}>1 Second</option>
                    <option value={2000}>2 Seconds</option>
                    <option value={3000}>3 Seconds</option>
                    <option value={5000}>5 Seconds</option>
                    <option value={10000}>10 Seconds</option>
                    <option value={0}>Never Hide</option>
                </select>
            </div>
        </div>
    );
};

// --- Plugin Registration ---

if (window.KoBarExtensions?.buttons) {
    window.KoBarExtensions.buttons = window.KoBarExtensions.buttons.filter(b => b.id !== 'kobar-clipboard-manager-btn');
}
if (window.KoBarExtensions?.panels?.delete) {
    window.KoBarExtensions.panels.delete('kobar-clipboard-manager-panel');
}

if (window.KoBarExtensions?.registerInlineWidget) {
    window.KoBarExtensions.registerInlineWidget('kobar-clipboard-manager-inline', {
        id: 'kobar-clipboard-manager-inline',
        render: () => window.React.createElement(InlineClipboardUI)
    });
}

if (window.KoBarExtensions?.registerSettingsPanel) {
    window.KoBarExtensions.registerSettingsPanel('com.kobar.clipboardmanager', {
        id: 'com.kobar.clipboardmanager',
        render: () => window.React.createElement(SettingsPanelUI)
    });
}
