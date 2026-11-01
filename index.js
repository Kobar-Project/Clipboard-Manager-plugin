(function(react, reactDom) {
  "use strict";
  function computeBubblePosition(opts) {
    var anchor = opts.anchor;
    var viewport = opts.viewport;
    var margin = opts.margin;
    var gap = opts.gap;
    var horizontalBar = opts.orientation === "horizontal";
    var edge = opts.edgePosition;
    var availW = Math.max(0, viewport.width - 2 * margin);
    var availH = Math.max(0, viewport.height - 2 * margin);
    var width = Math.min(opts.size.width, availW);
    var height = Math.min(opts.size.height, availH);
    var preferred, opposite;
    if (horizontalBar) {
      preferred = edge === "top" ? "bottom" : "top";
    } else {
      preferred = edge === "left" ? "right" : "left";
    }
    opposite = { top: "bottom", bottom: "top", left: "right", right: "left" }[preferred];
    function room(side2) {
      if (side2 === "bottom") return viewport.height - margin - (anchor.bottom + gap);
      if (side2 === "top") return anchor.top - gap - margin;
      if (side2 === "right") return viewport.width - margin - (anchor.right + gap);
      return anchor.left - gap - margin;
    }
    var main = horizontalBar ? height : width;
    var side = preferred;
    if (room(preferred) < main) {
      if (room(opposite) >= main || room(opposite) > room(preferred)) side = opposite;
    }
    var space = Math.max(0, room(side));
    if (horizontalBar && height > space) height = space;
    if (!horizontalBar && width > space) width = space;
    var left, top;
    if (horizontalBar) {
      top = side === "bottom" ? anchor.bottom + gap : anchor.top - gap - height;
      left = (anchor.left + anchor.right) / 2 - width / 2;
    } else {
      left = side === "right" ? anchor.right + gap : anchor.left - gap - width;
      top = (anchor.top + anchor.bottom) / 2 - height / 2;
    }
    left = Math.min(Math.max(left, margin), Math.max(margin, viewport.width - margin - width));
    top = Math.min(Math.max(top, margin), Math.max(margin, viewport.height - margin - height));
    return { left, top, maxWidth: availW, maxHeight: horizontalBar ? Math.max(space, 0) : availH, side };
  }
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
    const store = window.useAppStore?.getState() || { language: "en" };
    const lang = store.language || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  };
  let globalState = {
    slots: Array(8).fill().map(() => ({ state: "empty", type: null, content: null })),
    slotCount: 8,
    isCopyModeActive: false,
    isPasteModeActive: false,
    autoHideDuration: 5e3
  };
  try {
    const saved = localStorage.getItem("kobar-plugin-clipboard-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.slotCount) {
        globalState.slotCount = parsed.slotCount;
        globalState.slots = Array(parsed.slotCount).fill().map(() => ({ state: "empty", type: null, content: null }));
      }
      if (parsed.autoHideDuration !== void 0) {
        globalState.autoHideDuration = parsed.autoHideDuration;
      }
    }
  } catch (e) {
  }
  let listeners = /* @__PURE__ */ new Set();
  const notify = () => listeners.forEach((l) => l());
  const usePluginStore = () => {
    const [state, setState] = react.useState(globalState);
    react.useEffect(() => {
      const listener = () => setState({ ...globalState });
      listeners.add(listener);
      return () => listeners.delete(listener);
    }, []);
    return state;
  };
  const setSlotCount = (count) => {
    if (count > globalState.slots.length) {
      const addedSlots = Array(count - globalState.slots.length).fill().map(() => ({ state: "empty", type: null, content: null }));
      globalState.slots = [...globalState.slots, ...addedSlots];
    } else if (count < globalState.slots.length) {
      globalState.slots = globalState.slots.slice(0, count);
    }
    globalState.slotCount = count;
    localStorage.setItem("kobar-plugin-clipboard-settings", JSON.stringify({
      slotCount: count,
      autoHideDuration: globalState.autoHideDuration
    }));
    notify();
  };
  const setAutoHideDuration = (ms) => {
    globalState.autoHideDuration = ms;
    localStorage.setItem("kobar-plugin-clipboard-settings", JSON.stringify({
      slotCount: globalState.slotCount,
      autoHideDuration: ms
    }));
    notify();
  };
  const toggleCopyMode = () => {
    lastPasted = null;
    if (globalState.isCopyModeActive) {
      globalState.slots = globalState.slots.map((s) => s.state === "listening" ? { ...s, state: "empty" } : s);
      globalState.isCopyModeActive = false;
      window.api?.stopClipboardListener?.();
    } else {
      globalState.slots = globalState.slots.map((s) => s.state === "selected" ? { ...s, state: "filled" } : s);
      const firstEmpty = globalState.slots.findIndex((s) => s.state === "empty");
      if (firstEmpty !== -1) {
        globalState.slots = [...globalState.slots];
        globalState.slots[firstEmpty] = { ...globalState.slots[firstEmpty], state: "listening" };
        globalState.isCopyModeActive = true;
        globalState.isPasteModeActive = false;
        window.api?.startClipboardListener?.();
      }
    }
    notify();
  };
  const togglePasteMode = () => {
    lastPasted = null;
    if (globalState.isPasteModeActive) {
      globalState.slots = globalState.slots.map((s) => s.state === "selected" ? { ...s, state: "filled" } : s);
      globalState.isPasteModeActive = false;
      window.api?.setGlobalPasteMode?.(false);
    } else {
      globalState.slots = globalState.slots.map((s) => s.state === "listening" ? { ...s, state: "empty" } : s);
      const firstFilled = globalState.slots.findIndex((s) => s.state === "filled");
      if (firstFilled !== -1) {
        globalState.slots = [...globalState.slots];
        globalState.slots[firstFilled] = { ...globalState.slots[firstFilled], state: "selected" };
        globalState.isPasteModeActive = true;
        globalState.isCopyModeActive = false;
        window.api?.stopClipboardListener?.();
        window.api?.setGlobalPasteMode?.(true);
      }
    }
    notify();
  };
  const addClipboardItem = (type, content) => {
    if (!globalState.isCopyModeActive) return;
    const listeningIndex = globalState.slots.findIndex((s) => s.state === "listening");
    if (listeningIndex === -1) return;
    let newSlots = [...globalState.slots];
    newSlots[listeningIndex] = { state: "filled", type, content };
    const nextEmptyIndex = newSlots.findIndex((s, i) => i > listeningIndex && s.state === "empty");
    if (nextEmptyIndex !== -1) {
      newSlots[nextEmptyIndex] = { ...newSlots[nextEmptyIndex], state: "listening" };
    } else {
      globalState.isCopyModeActive = false;
      window.api?.stopClipboardListener?.();
    }
    globalState.slots = newSlots;
    notify();
  };
  window.KoBarClipboardAPI = {
    forceAddClipboardItem: (type, content) => {
      let newSlots = [...globalState.slots];
      const listeningIndex = newSlots.findIndex((s) => s.state === "listening");
      const targetIndex = listeningIndex !== -1 ? listeningIndex : newSlots.findIndex((s) => s.state === "empty");
      if (targetIndex !== -1) {
        newSlots[targetIndex] = { state: "filled", type, content };
        if (globalState.isCopyModeActive && listeningIndex !== -1) {
          const nextEmptyIndex = newSlots.findIndex((s, i) => i > targetIndex && s.state === "empty");
          if (nextEmptyIndex !== -1) {
            newSlots[nextEmptyIndex] = { ...newSlots[nextEmptyIndex], state: "listening" };
          } else {
            globalState.isCopyModeActive = false;
            window.api?.stopClipboardListener?.();
          }
        }
      } else {
        newSlots.shift();
        newSlots.push({ state: "filled", type, content });
      }
      globalState.slots = newSlots;
      notify();
    }
  };
  const pasteNextItem = () => {
    if (!globalState.isPasteModeActive) return;
    const selectedIndex = globalState.slots.findIndex((s) => s.state === "selected");
    if (selectedIndex === -1) return;
    let newSlots = [...globalState.slots];
    const item = { ...newSlots[selectedIndex] };
    newSlots[selectedIndex] = { state: "empty", type: null, content: null };
    const nextFilledIndex = newSlots.findIndex((s, i) => i > selectedIndex && s.state === "filled");
    if (nextFilledIndex !== -1) {
      newSlots[nextFilledIndex] = { ...newSlots[nextFilledIndex], state: "selected" };
    } else {
      globalState.isPasteModeActive = false;
      window.api?.setGlobalPasteMode?.(false);
    }
    globalState.slots = newSlots;
    notify();
    return item;
  };
  let lastPasted = null;
  const RESTORE_WINDOW_MS = 1e4;
  const restoreLastPasted = () => {
    const pending = lastPasted;
    lastPasted = null;
    if (!pending || Date.now() - pending.at > RESTORE_WINDOW_MS) return;
    const current = globalState.slots[pending.index];
    if (!current || current.state !== "empty") return;
    const resumePaste = !globalState.isCopyModeActive;
    let newSlots = globalState.slots.map((s) => s.state === "selected" ? { ...s, state: "filled" } : s);
    newSlots[pending.index] = { ...pending.slot, state: resumePaste ? "selected" : "filled" };
    globalState.slots = newSlots;
    if (resumePaste && !globalState.isPasteModeActive) {
      globalState.isPasteModeActive = true;
      window.api?.setGlobalPasteMode?.(true);
    }
    notify();
  };
  const clearSlot = (index) => {
    if (globalState.slots[index].state === "filled") {
      globalState.slots = [...globalState.slots];
      globalState.slots[index] = { state: "empty", type: null, content: null };
      notify();
    }
  };
  const resetAll = () => {
    lastPasted = null;
    globalState.slots = Array(globalState.slotCount).fill().map(() => ({ state: "empty", type: null, content: null }));
    globalState.isCopyModeActive = false;
    globalState.isPasteModeActive = false;
    window.api?.stopClipboardListener?.();
    window.api?.setGlobalPasteMode?.(false);
    notify();
  };
  const setListeningSlot = (index) => {
    if (!globalState.isCopyModeActive || globalState.slots[index].state !== "empty") return;
    let newSlots = globalState.slots.map((s) => s.state === "listening" ? { ...s, state: "empty" } : s);
    newSlots[index] = { ...newSlots[index], state: "listening" };
    globalState.slots = newSlots;
    notify();
  };
  const setSelectedSlot = (index) => {
    if (!globalState.isPasteModeActive || globalState.slots[index].state !== "filled") return;
    let newSlots = globalState.slots.map((s) => s.state === "selected" ? { ...s, state: "filled" } : s);
    newSlots[index] = { ...newSlots[index], state: "selected" };
    globalState.slots = newSlots;
    notify();
  };
  function getSlotDotStyle(state, size = 12) {
    const base = { display: "block", boxSizing: "border-box", width: size, height: size, flex: "none", borderRadius: "50%", borderStyle: "solid", borderWidth: 2, transition: "all 0.2s ease-in-out" };
    switch (state) {
      case "listening":
        return { ...base, borderColor: "#3b82f6", background: "rgba(59,130,246,0.45)" };
      case "filled":
        return { ...base, borderColor: "#22c55e", background: "#22c55e" };
      case "selected":
        return { ...base, borderColor: "#22c55e", background: "#22c55e", boxShadow: "0 0 0 2px var(--theme-primary, #3b82f6)" };
      default:
        return { ...base, borderColor: "#4b5563", background: "transparent" };
    }
  }
  const TooltipButton = ({ onClick, onDoubleClick, className, style, label, children }) => {
    return /* @__PURE__ */ window.React.createElement(
      "button",
      {
        onClick,
        onDoubleClick,
        title: label,
        className
      },
      children
    );
  };
  const DENSITY_LANES = { compact: 2, normal: 3, comfortable: 4 };
  const SLOT_GAP = 3;
  const SLOT_CELL_MAX = 16;
  const SLOT_CELL_MIN = 9;
  function densityOf(store) {
    if (DENSITY_LANES[store.density]) return store.density;
    const w = Number(store.sidebarWidth);
    if (!Number.isFinite(w)) return "normal";
    return w < 44 ? "compact" : w > 52 ? "comfortable" : "normal";
  }
  function slotGridGeometry({ orientation, density, sidebarWidth, iconScale }, slotCount) {
    const zoom = Number(iconScale) > 0 ? Number(iconScale) : 1;
    const thickness = Number(sidebarWidth) > 0 ? Number(sidebarWidth) : 48;
    const across = (thickness - 10) / zoom;
    let lanes = DENSITY_LANES[density] || 3;
    let cell = Math.min(SLOT_CELL_MAX, Math.floor((across - (lanes - 1) * SLOT_GAP) / lanes));
    while (lanes > 2 && cell < SLOT_CELL_MIN) {
      lanes -= 1;
      cell = Math.min(SLOT_CELL_MAX, Math.floor((across - (lanes - 1) * SLOT_GAP) / lanes));
    }
    cell = Math.max(SLOT_CELL_MIN, cell);
    const count = Math.max(1, slotCount);
    const lines = Math.ceil(count / lanes);
    const acrossPx = lanes * cell + (lanes - 1) * SLOT_GAP;
    const alongPx = lines * cell + (lines - 1) * SLOT_GAP;
    const dot = Math.max(7, Math.min(12, cell - 3));
    const horizontal = orientation === "horizontal";
    const style = horizontal ? { display: "grid", gridAutoFlow: "column", gridTemplateRows: `repeat(${lanes}, ${cell}px)`, gridAutoColumns: `${cell}px`, gap: SLOT_GAP, width: alongPx, height: acrossPx } : { display: "grid", gridAutoFlow: "row", gridTemplateColumns: `repeat(${lanes}, ${cell}px)`, gridAutoRows: `${cell}px`, gap: SLOT_GAP, width: acrossPx, height: alongPx };
    return { cell, dot, lanes, style: { ...style, flex: "none", position: "relative" } };
  }
  const pickAppState = (store) => ({
    orientation: store.orientation,
    design: store.design,
    edgePosition: store.edgePosition,
    sidebarWidth: store.sidebarWidth,
    iconScale: store.iconScale,
    density: densityOf(store)
  });
  const sameAppState = (a, b) => a.orientation === b.orientation && a.design === b.design && a.edgePosition === b.edgePosition && a.sidebarWidth === b.sidebarWidth && a.iconScale === b.iconScale && a.density === b.density;
  const InlineClipboardUI = () => {
    const { slots, isCopyModeActive, isPasteModeActive, autoHideDuration } = usePluginStore();
    const [appState, setAppState] = react.useState(() => pickAppState(window.useAppStore?.getState() || {}));
    react.useEffect(() => {
      if (!window.useAppStore) return void 0;
      return window.useAppStore.subscribe((state) => {
        const next = pickAppState(state);
        setAppState((prev) => sameAppState(prev, next) ? prev : next);
      });
    }, []);
    const { orientation, design, edgePosition } = appState;
    const grid = slotGridGeometry(appState, slots.length);
    const [activePreviewSlot, setActivePreviewSlot] = react.useState(null);
    const [previewRect, setPreviewRect] = react.useState(null);
    const bubbleRef = react.useRef(null);
    const [bubblePos, setBubblePos] = react.useState(null);
    react.useLayoutEffect(() => {
      const el = bubbleRef.current;
      if (activePreviewSlot === null || !previewRect || !el) {
        setBubblePos(null);
        return void 0;
      }
      const place = () => {
        const box = el.firstElementChild || el;
        const pos = computeBubblePosition({
          anchor: previewRect,
          size: { width: box.offsetWidth, height: box.offsetHeight },
          viewport: { width: window.innerWidth, height: window.innerHeight },
          orientation,
          edgePosition,
          margin: 8,
          gap: 12
        });
        setBubblePos((prev) => prev && prev.left === pos.left && prev.top === pos.top && prev.maxWidth === pos.maxWidth && prev.maxHeight === pos.maxHeight ? prev : pos);
      };
      place();
      window.addEventListener("resize", place);
      let ro = null;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(place);
        ro.observe(el.firstElementChild || el);
      }
      return () => {
        window.removeEventListener("resize", place);
        if (ro) ro.disconnect();
      };
    }, [activePreviewSlot, previewRect, orientation, edgePosition, slots]);
    react.useEffect(() => startClipboardEngine({ publishTile: false }), []);
    const handleSlotClick = (e, index, state) => {
      e.preventDefault();
      if (!isCopyModeActive && (state === "filled" || state === "selected")) {
        if (activePreviewSlot === index) {
          setActivePreviewSlot(null);
          setPreviewRect(null);
        } else {
          setPreviewRect(e.currentTarget.getBoundingClientRect());
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
      if (isCopyModeActive && state === "empty") {
        setListeningSlot(index);
      }
    };
    react.useEffect(() => {
      if (activePreviewSlot !== null) {
        let timer = null;
        if (autoHideDuration > 0) {
          timer = setTimeout(() => {
            setActivePreviewSlot(null);
            setPreviewRect(null);
          }, autoHideDuration);
        }
        const handleOutsideClick = (e) => {
          const portal = document.getElementById("clipboard-preview-portal");
          if (portal && portal.contains(e.target)) return;
          setActivePreviewSlot(null);
          setPreviewRect(null);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          if (timer) clearTimeout(timer);
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }
    }, [activePreviewSlot, autoHideDuration]);
    const truncateContent = (content, limit = 150) => {
      if (typeof content !== "string") return "";
      if (content.length <= limit) return content;
      return content.substring(0, limit) + "...";
    };
    const renderPreviewPortal = () => {
      if (activePreviewSlot === null || !previewRect) return null;
      const slotData = slots[activePreviewSlot];
      if (!slotData?.content) return null;
      return reactDom.createPortal(
        /* @__PURE__ */ window.React.createElement(
          "div",
          {
            id: "clipboard-preview-portal",
            className: "fixed z-[999999] animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-auto",
            ref: bubbleRef,
            style: bubblePos ? { left: `${bubblePos.left}px`, top: `${bubblePos.top}px`, maxWidth: `${bubblePos.maxWidth}px`, maxHeight: `${bubblePos.maxHeight}px`, display: "flex" } : { left: "0px", top: "0px", visibility: "hidden" }
          },
          /* @__PURE__ */ window.React.createElement("div", { className: "bg-black/90 backdrop-blur-3xl text-white text-xs p-3 rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 w-64 max-w-xs break-words flex flex-col gap-2 min-h-0 overflow-hidden", style: { maxHeight: bubblePos ? `${bubblePos.maxHeight}px` : void 0 } }, /* @__PURE__ */ window.React.createElement("div", { className: "flex justify-between items-center border-b border-white/10 pb-1" }, /* @__PURE__ */ window.React.createElement("span", { className: "font-bold text-slate-300" }, "Preview"), /* @__PURE__ */ window.React.createElement(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setActivePreviewSlot(null);
                setPreviewRect(null);
              },
              className: "text-slate-400 hover:text-white transition-colors cursor-pointer"
            },
            /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined text-[16px]" }, "close")
          )), /* @__PURE__ */ window.React.createElement("div", { className: "overflow-y-auto max-h-32 min-h-0 custom-scrollbar pr-1 select-text" }, slotData.type === "image" ? /* @__PURE__ */ window.React.createElement("span", { className: "italic opacity-50" }, t("imagePreview")) : truncateContent(slotData.content, 500)))
        ),
        document.body
      );
    };
    return /* @__PURE__ */ window.React.createElement("div", { className: `flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} items-center justify-center gap-1 relative no-drag-region`, style: { flex: "none" } }, /* @__PURE__ */ window.React.createElement(
      TooltipButton,
      {
        onClick: toggleCopyMode,
        onDoubleClick: resetAll,
        className: "flex items-center justify-center rounded-md transition-colors text-slate-400 hover:text-white hover:bg-white/10",
        style: { width: "var(--kb-bar-item, 36px)", height: "var(--kb-bar-item, 36px)" },
        label: isCopyModeActive ? t("stopCopyMode") : t("startCopyMode")
      },
      /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: { fontSize: "var(--kb-bar-icon, 20px)" } }, "content_copy")
    ), /* @__PURE__ */ window.React.createElement("div", { style: grid.style, "data-cbm-slot-grid": "", "data-lanes": grid.lanes, onClick: (e) => e.stopPropagation() }, slots.map((slot, index) => {
      const dot = getSlotDotStyle(slot.state, grid.dot);
      return /* @__PURE__ */ window.React.createElement(
        "span",
        {
          key: index,
          role: "radio",
          "aria-checked": slot.state !== "empty",
          title: slot.content ? slot.type === "image" ? t("imagePreview") : truncateContent(slot.content, 100) : t("emptySlotTip"),
          className: `relative flex items-center justify-center cursor-pointer transition-transform ${activePreviewSlot === index ? "scale-125 z-10" : "hover:scale-110"}`,
          style: { width: grid.cell, height: grid.cell, opacity: !isCopyModeActive && !isPasteModeActive && slot.state === "empty" ? 0.5 : 1 },
          onClick: (e) => handleSlotClick(e, index, slot.state),
          onDoubleClick: (e) => {
            e.preventDefault();
            clearSlot(index);
          }
        },
        /* @__PURE__ */ window.React.createElement("span", { style: dot })
      );
    })), /* @__PURE__ */ window.React.createElement(
      TooltipButton,
      {
        onClick: togglePasteMode,
        onDoubleClick: resetAll,
        className: "flex items-center justify-center rounded-md transition-colors text-slate-400 hover:text-white hover:bg-white/10",
        style: { width: "var(--kb-bar-item, 36px)", height: "var(--kb-bar-item, 36px)" },
        label: isPasteModeActive ? t("stopPasteMode") : t("startPasteMode")
      },
      /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: { fontSize: "var(--kb-bar-icon, 20px)" } }, "content_paste")
    ), renderPreviewPortal());
  };
  const SettingsPanelUI = () => {
    const { slotCount, autoHideDuration } = usePluginStore();
    return /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-col gap-4 text-white" }, /* @__PURE__ */ window.React.createElement("h3", { className: "text-lg font-bold border-b border-white/10 pb-2" }, t("copyAndPaste"), " ", t("settings")), /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ window.React.createElement("label", { className: "text-sm text-slate-300" }, t("numberOfSlots")), /* @__PURE__ */ window.React.createElement(
      "input",
      {
        type: "range",
        min: "4",
        max: "20",
        step: "1",
        value: slotCount,
        onChange: (e) => setSlotCount(Number(e.target.value)),
        className: "w-full accent-[var(--theme-primary)]"
      }
    ), /* @__PURE__ */ window.React.createElement("div", { className: "text-xs text-slate-500 flex justify-between" }, /* @__PURE__ */ window.React.createElement("span", null, "4"), /* @__PURE__ */ window.React.createElement("span", null, slotCount), /* @__PURE__ */ window.React.createElement("span", null, "20")), /* @__PURE__ */ window.React.createElement("p", { className: "text-[11px] text-slate-500 mt-1" }, t("slotsMinMaxInfo"))), /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-col gap-2 mt-2" }, /* @__PURE__ */ window.React.createElement("label", { className: "text-sm text-slate-300" }, "Tooltip Auto-Hide Duration"), /* @__PURE__ */ window.React.createElement(
      "select",
      {
        className: "bg-black/40 border border-white/10 rounded p-1 text-sm text-white focus:outline-none focus:border-[var(--theme-primary)]",
        value: autoHideDuration,
        onChange: (e) => setAutoHideDuration(Number(e.target.value))
      },
      /* @__PURE__ */ window.React.createElement("option", { value: 1e3 }, "1 Second"),
      /* @__PURE__ */ window.React.createElement("option", { value: 2e3 }, "2 Seconds"),
      /* @__PURE__ */ window.React.createElement("option", { value: 3e3 }, "3 Seconds"),
      /* @__PURE__ */ window.React.createElement("option", { value: 5e3 }, "5 Seconds"),
      /* @__PURE__ */ window.React.createElement("option", { value: 1e4 }, "10 Seconds"),
      /* @__PURE__ */ window.React.createElement("option", { value: 0 }, "Never Hide")
    )));
  };
  const ICON_FONT = "'Material Symbols Rounded', 'Material Symbols Outlined'";
  const iconStyle = (fill, size) => ({
    fontFamily: ICON_FONT,
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400`,
    fontSize: size
  });
  const CLIPBOARD_BTN_ID = "kobar-clipboard-manager-inline";
  const CLIPBOARD_PANEL_ID = "kobar-clipboard-manager-panel";
  const TILE_MAX_SLOTS = 12;
  const TILE_STRINGS = {
    en: { clear: "Clear", tile: "Clipboard Manager — {f} of {n} slots filled", tileCapped: "Clipboard Manager — {f} of {n} slots filled (first {n} of {all} shown)", close: "Close", search: "Search", noMatch: "No matching items", resetAll: "Clear all", slot: "Slot", hintIdle: "Copy several things, then paste them in order.", hintCopy: "Listening. Copy something and it fills slot {n}.", hintPaste: "Paste mode. Each paste inserts the next item, starting at slot {n}.", next: "Next" },
    tr: { clear: "Temizle", tile: "Pano yöneticisi — {n} yuvadan {f} dolu", tileCapped: "Pano yöneticisi — ilk {n} yuvadan {f} dolu (toplam {all} yuva)", close: "Kapat", search: "Ara", noMatch: "Eşleşen öğe yok", resetAll: "Tümünü temizle", slot: "Yuva", hintIdle: "Birkaç şey kopyalayın, sonra sırayla yapıştırın.", hintCopy: "Dinleniyor. Kopyaladığınız şey {n}. yuvaya girer.", hintPaste: "Yapıştırma modu. Her yapıştırma sıradaki öğeyi ekler, {n}. yuvadan başlar.", next: "Sıradaki" },
    de: { clear: "Leeren", tile: "Zwischenablage — {f} von {n} Plätzen belegt", tileCapped: "Zwischenablage — {f} von den ersten {n} Plätzen belegt (insgesamt {all})", close: "Schließen", search: "Suchen", noMatch: "Keine passenden Einträge", resetAll: "Alle leeren", slot: "Platz", hintIdle: "Mehrere Dinge kopieren, dann der Reihe nach einfügen.", hintCopy: "Hört zu. Kopiertes füllt Platz {n}.", hintPaste: "Einfügemodus. Jedes Einfügen setzt das nächste Element ein, ab Platz {n}.", next: "Nächstes" },
    fr: { clear: "Effacer", tile: "Presse-papiers — {f} emplacements sur {n} remplis", tileCapped: "Presse-papiers — {f} sur les {n} premiers emplacements remplis (total {all})", close: "Fermer", search: "Rechercher", noMatch: "Aucun élément correspondant", resetAll: "Tout effacer", slot: "Emplacement", hintIdle: "Copiez plusieurs éléments, puis collez-les dans l'ordre.", hintCopy: "À l'écoute. Ce que vous copiez remplit l'emplacement {n}.", hintPaste: "Mode collage. Chaque collage insère l'élément suivant, à partir de l'emplacement {n}.", next: "Suivant" },
    es: { clear: "Borrar", tile: "Portapapeles — {f} de {n} ranuras llenas", tileCapped: "Portapapeles — {f} de las primeras {n} ranuras llenas (total {all})", close: "Cerrar", search: "Buscar", noMatch: "Sin elementos coincidentes", resetAll: "Borrar todo", slot: "Ranura", hintIdle: "Copie varias cosas y péguelas en orden.", hintCopy: "Escuchando. Lo que copie llena la ranura {n}.", hintPaste: "Modo pegar. Cada pegado inserta el siguiente elemento, desde la ranura {n}.", next: "Siguiente" },
    ru: { clear: "Очистить", tile: "Буфер обмена — заполнено {f} из {n} ячеек", tileCapped: "Буфер обмена — заполнено {f} из первых {n} ячеек (всего {all})", close: "Закрыть", search: "Поиск", noMatch: "Ничего не найдено", resetAll: "Очистить всё", slot: "Ячейка", hintIdle: "Скопируйте несколько элементов, затем вставьте их по порядку.", hintCopy: "Слушаю. Скопированное попадёт в ячейку {n}.", hintPaste: "Режим вставки. Каждая вставка добавляет следующий элемент, начиная с ячейки {n}.", next: "Далее" },
    ja: { clear: "クリア", tile: "クリップボード — {n} スロット中 {f} 使用中", tileCapped: "クリップボード — 最初の {n} スロット中 {f} 使用中（全 {all}）", close: "閉じる", search: "検索", noMatch: "一致する項目なし", resetAll: "すべてクリア", slot: "スロット", hintIdle: "複数をコピーして、順番に貼り付けます。", hintCopy: "待機中。コピーするとスロット {n} に入ります。", hintPaste: "貼り付けモード。スロット {n} から順に貼り付けます。", next: "次" },
    zh: { clear: "清除", tile: "剪贴板 — {n} 个插槽中已用 {f} 个", tileCapped: "剪贴板 — 前 {n} 个插槽中已用 {f} 个（共 {all} 个）", close: "关闭", search: "搜索", noMatch: "没有匹配项", resetAll: "全部清除", slot: "插槽", hintIdle: "先复制多项内容，再按顺序粘贴。", hintCopy: "正在监听。复制的内容将放入插槽 {n}。", hintPaste: "粘贴模式。每次粘贴都会插入下一项，从插槽 {n} 开始。", next: "下一个" },
    ar: { clear: "مسح", tile: "مدير الحافظة — {f} من {n} خانات ممتلئة", tileCapped: "مدير الحافظة — {f} من أول {n} خانات ممتلئة (الإجمالي {all})", close: "إغلاق", search: "بحث", noMatch: "لا توجد عناصر مطابقة", resetAll: "مسح الكل", slot: "خانة", hintIdle: "انسخ عدة عناصر ثم الصقها بالترتيب.", hintCopy: "جارٍ الاستماع. ما تنسخه يملأ الخانة {n}.", hintPaste: "وضع اللصق. كل لصق يدرج العنصر التالي بدءًا من الخانة {n}.", next: "التالي" },
    hi: { clear: "साफ़ करें", tile: "क्लिपबोर्ड — {n} में से {f} स्लॉट भरे", tileCapped: "क्लिपबोर्ड — पहले {n} में से {f} स्लॉट भरे (कुल {all})", close: "बंद करें", search: "खोजें", noMatch: "कोई मेल खाता आइटम नहीं", resetAll: "सब साफ़ करें", slot: "स्लॉट", hintIdle: "कई चीज़ें कॉपी करें, फिर क्रम से पेस्ट करें।", hintCopy: "सुन रहा है। कॉपी की गई चीज़ स्लॉट {n} में जाएगी।", hintPaste: "पेस्ट मोड। हर पेस्ट अगला आइटम डालता है, स्लॉट {n} से शुरू।", next: "अगला" }
  };
  let tileLocale = null;
  const curLang = () => tileLocale || window.useAppStore?.getState?.().language || "en";
  const tt = (key, vars) => {
    const dict = TILE_STRINGS[curLang()] || TILE_STRINGS.en;
    let out = dict[key] || TILE_STRINGS.en[key] || key;
    if (vars) {
      let fmt;
      try {
        fmt = new Intl.NumberFormat(curLang());
      } catch (e) {
        fmt = new Intl.NumberFormat("en");
      }
      Object.keys(vars).forEach((k) => {
        out = out.split("{" + k + "}").join(fmt.format(vars[k]));
      });
    }
    return out;
  };
  const tileExt = () => {
    const ext = window.KoBarExtensions;
    return typeof ext?.setBarItemState === "function" ? ext : null;
  };
  const publishClipboardTile = () => {
    const ext = tileExt();
    if (!ext) return;
    try {
      const all = globalState.slots.length;
      const shown = globalState.slots.slice(0, TILE_MAX_SLOTS);
      const total = shown.length;
      const filled = shown.filter((s) => s.state === "filled" || s.state === "selected").length;
      let next = shown.findIndex((s) => s.state === "listening");
      if (next === -1) next = shown.findIndex((s) => s.state === "empty");
      const slots = { filled, total };
      if (next !== -1) slots.next = next;
      ext.setBarItemState(CLIPBOARD_BTN_ID, {
        label: all > total ? tt("tileCapped", { f: filled, n: total, all }) : tt("tile", { f: filled, n: total }),
        value: filled + "/" + total,
        slots,
        icon: "content_paste"
      });
    } catch (e) {
    }
  };
  const startClipboardEngine = ({ publishTile }) => {
    if (window.__kobarClipboardEngineStop) {
      try {
        window.__kobarClipboardEngineStop();
      } catch (e) {
      }
    }
    let cleanupUpdate = null;
    let cleanupPaste = null;
    let cleanupError = null;
    let pasteAttached = false;
    let lastPasteTime = 0;
    const hostSerialises = (window.api?.globalPasteVersion ?? 1) >= 2;
    if (window.api?.onClipboardUpdate) {
      cleanupUpdate = window.api.onClipboardUpdate((data) => {
        addClipboardItem(data.type, data.content);
      });
    }
    if (window.api?.onClipboardPasteError) {
      cleanupError = window.api.onClipboardPasteError(() => {
        restoreLastPasted();
      });
    }
    const onRequestNextPaste = () => {
      const now = Date.now();
      if (!hostSerialises && now - lastPasteTime < 300) return;
      lastPasteTime = now;
      const selectedIndex = globalState.slots.findIndex((s) => s.state === "selected");
      const index = selectedIndex !== -1 ? selectedIndex : globalState.slots.findIndex((s) => s.state === "filled");
      const targetSlot = index !== -1 ? globalState.slots[index] : null;
      if (targetSlot && targetSlot.content && targetSlot.type) {
        if (selectedIndex === -1) setSelectedSlot(index);
        lastPasted = { index, slot: { state: "filled", type: targetSlot.type, content: targetSlot.content }, at: now };
        window.api?.executeGlobalPaste({ type: targetSlot.type, content: targetSlot.content });
        pasteNextItem();
      }
    };
    const sync = () => {
      const wantPaste = globalState.isPasteModeActive && !!window.api?.onRequestNextPaste;
      if (wantPaste && !pasteAttached) {
        lastPasteTime = 0;
        cleanupPaste = window.api.onRequestNextPaste(onRequestNextPaste);
        pasteAttached = true;
      } else if (!wantPaste && pasteAttached) {
        if (cleanupPaste) cleanupPaste();
        cleanupPaste = null;
        pasteAttached = false;
      }
      const hasPasteable = globalState.slots.some((s) => s.state === "filled" || s.state === "selected");
      if (globalState.isPasteModeActive && !hasPasteable) {
        window.api?.setGlobalPasteMode?.(false);
        globalState.isPasteModeActive = false;
        notify();
        return;
      }
      if (publishTile) publishClipboardTile();
    };
    listeners.add(sync);
    sync();
    const stop = () => {
      listeners.delete(sync);
      if (cleanupUpdate) cleanupUpdate();
      if (cleanupPaste) cleanupPaste();
      if (cleanupError) cleanupError();
      if (window.__kobarClipboardEngineStop === stop) window.__kobarClipboardEngineStop = null;
    };
    window.__kobarClipboardEngineStop = stop;
    return stop;
  };
  const SLOT_TYPE_ICON = { text: "notes", image: "image" };
  const ClipboardPanel = (props) => {
    const { onClose, anchorRect } = props;
    const store = window.useAppStore();
    const { slots, isCopyModeActive, isPasteModeActive } = usePluginStore();
    const [query, setQuery] = react.useState("");
    const popupRef = react.useRef(null);
    const lang = store.language;
    const tr = (key) => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    };
    const tl = (key) => {
      const dict = TILE_STRINGS[lang] || TILE_STRINGS.en;
      return dict[key] || TILE_STRINGS.en[key] || key;
    };
    react.useEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose && onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, []);
    const { edgePosition, screenBounds, orientation, sidebarPosition } = store;
    const smart = store.isPopupSmartPositioning;
    const smartRef = react.useRef(smart);
    react.useEffect(() => {
      smartRef.current = smart;
    }, [smart]);
    const POPUP_W = 340;
    const POPUP_H = 440;
    const place = (offX, offY) => {
      const sbX = (screenBounds?.x ?? 0) - window.screenX;
      const sbY = (screenBounds?.y ?? 0) - window.screenY;
      if (orientation === "horizontal") {
        const sw = screenBounds?.width ?? 1200;
        let left = anchorRect.left - offX + anchorRect.width / 2 - POPUP_W / 2;
        const maxLeft = sbX + (sw - offX) - POPUP_W - 20;
        const minLeft = sbX - offX + 20;
        return Math.min(Math.max(left, minLeft), maxLeft);
      }
      const sh = screenBounds?.height ?? 800;
      let top = anchorRect.top - offY - 20 + anchorRect.height / 2 - POPUP_H / 2;
      const maxTop = sbY + (sh - offY) - POPUP_H - 20;
      const minTop = sbY - offY + 20;
      return Math.min(Math.max(top, minTop), maxTop);
    };
    const getPopupStyle = () => {
      if (!anchorRect) return { display: "none" };
      const style = {
        position: "absolute",
        zIndex: 99999,
        width: POPUP_W,
        padding: 20,
        backgroundColor: "var(--kb-bg-shell, var(--theme-bg-dark, #1b1e27))",
        border: "1px solid var(--kb-stroke-subtle, var(--theme-border, rgba(255,255,255,0.1)))",
        borderRadius: 32,
        boxShadow: "var(--kb-shadow-e3, 0 12px 32px rgba(0,0,0,0.45))",
        color: "var(--kb-fg-1, #f2f3f7)",
        willChange: "transform, opacity"
      };
      const offX = sidebarPosition ? sidebarPosition.x : 0;
      const offY = sidebarPosition ? sidebarPosition.y : 0;
      if (orientation === "horizontal") {
        if (!smart) {
          style.left = "50%";
          style.transform = "translateX(-50%)";
        } else style.left = place(offX, offY);
        if (edgePosition === "top") {
          style.top = "100%";
          style.marginTop = "12px";
        } else {
          style.bottom = "100%";
          style.marginBottom = "12px";
        }
      } else {
        if (!smart) {
          style.top = "50%";
          style.transform = "translateY(-50%)";
        } else style.top = place(offX, offY);
        if (edgePosition === "left") {
          style.left = "100%";
          style.marginLeft = "12px";
        } else {
          style.right = "100%";
          style.marginRight = "12px";
        }
      }
      return style;
    };
    react.useEffect(() => {
      const onDrag = (e) => {
        if (!popupRef.current || !anchorRect || !smartRef.current) return;
        const v = place(e.detail.x, e.detail.y);
        if (orientation === "horizontal") popupRef.current.style.left = `${v}px`;
        else popupRef.current.style.top = `${v}px`;
      };
      document.addEventListener("kobar-drag", onDrag);
      return () => document.removeEventListener("kobar-drag", onDrag);
    }, [anchorRect, screenBounds, orientation]);
    const surface = "var(--kb-bg-surface, var(--theme-surface, #242833))";
    const tileBg = "var(--kb-bg-tile, var(--theme-surface, #242833))";
    const insetBg = "var(--kb-bg-inset, rgba(255,255,255,0.06))";
    const accent = "var(--kb-accent, var(--theme-primary, #8b9cff))";
    const fg1 = "var(--kb-fg-1, #f2f3f7)";
    const fg2 = "var(--kb-fg-2, #b4b8c6)";
    const fg3 = "var(--kb-fg-3, #868b9b)";
    const tonal = { background: "var(--kb-bg-container, var(--theme-accent-glow, rgba(99,102,241,0.18)))", color: "var(--kb-on-container, var(--kb-fg-1, #f2f3f7))" };
    const filledStyle = { background: accent, color: "var(--kb-on-accent, #101218)" };
    const filledCount = slots.filter((s) => s.state === "filled" || s.state === "selected").length;
    const q = query.trim().toLowerCase();
    const items = slots.map((slot, index) => ({ slot, index })).filter(({ slot }) => {
      if (!q) return true;
      return typeof slot.content === "string" && slot.type !== "image" && slot.content.toLowerCase().includes(q);
    });
    const preview = (slot) => {
      if (!slot.content) return tr("emptySlotTip");
      if (slot.type === "image") return tr("imagePreview");
      const c = String(slot.content).replace(/\s+/g, " ");
      return c.length > 60 ? c.slice(0, 60) + "..." : c;
    };
    const onRowClick = (index, state) => {
      if (!isCopyModeActive && (state === "filled" || state === "selected")) {
        if (isPasteModeActive) {
          setSelectedSlot(index);
          const slotData = slots[index];
          if (slotData && slotData.content && slotData.type) {
            window.api?.writeToClipboard({ type: slotData.type, content: slotData.content });
          }
        }
        return;
      }
      if (isCopyModeActive && state === "empty") {
        setListeningSlot(index);
      }
    };
    const activeIdx = isCopyModeActive ? slots.findIndex((s) => s.state === "listening") : isPasteModeActive ? slots.findIndex((s) => s.state === "selected") : -1;
    const hint = isCopyModeActive && activeIdx !== -1 ? tt("hintCopy", { n: activeIdx + 1 }) : isPasteModeActive && activeIdx !== -1 ? tt("hintPaste", { n: activeIdx + 1 }) : tt("hintIdle");
    const modeBtn = (active, dim) => ({
      height: 44,
      borderRadius: 999,
      gap: 8,
      padding: "0 16px",
      fontSize: 14,
      fontWeight: 600,
      border: 0,
      cursor: "pointer",
      opacity: dim ? 0.55 : 1,
      ...active ? filledStyle : tonal
    });
    return /* @__PURE__ */ window.React.createElement("div", { ref: popupRef, className: "pointer-events-auto overflow-hidden flex flex-col", style: { ...getPopupStyle(), gap: 16 } }, /* @__PURE__ */ window.React.createElement("style", null, ".kb-clip-btn:focus-visible,.kb-clip-row:focus-visible{outline:2px solid var(--kb-accent, #8b9cff);outline-offset:2px}"), /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center", style: { gap: 12 } }, /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center justify-center shrink-0", style: { width: 44, height: 44, borderRadius: 16, ...tonal, color: accent } }, /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(true, 24) }, "content_paste")), /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 min-w-0 drag-region" }, /* @__PURE__ */ window.React.createElement("div", { style: { fontFamily: "var(--kb-font-display, inherit)", fontSize: 19, fontWeight: 600, lineHeight: 1.2 } }, tr("copyAndPaste"))), /* @__PURE__ */ window.React.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": tl("close"),
        title: tl("close"),
        className: "kb-clip-btn flex items-center justify-center shrink-0 no-drag-region",
        style: { width: 36, height: 36, borderRadius: 999, border: 0, cursor: "pointer", ...tonal }
      },
      /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(false, 20) }, "close")
    )), /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-col no-drag-region", style: { gap: 12, background: surface, borderRadius: 24, padding: 16 } }, /* @__PURE__ */ window.React.createElement("div", { className: "flex items-baseline", style: { gap: 8 } }, /* @__PURE__ */ window.React.createElement("span", { style: { fontFamily: "var(--kb-font-display, inherit)", fontSize: 28, fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" } }, filledCount), /* @__PURE__ */ window.React.createElement("span", { style: { fontSize: 14, color: fg2, fontVariantNumeric: "tabular-nums" } }, "/ ", slots.length)), /* @__PURE__ */ window.React.createElement("div", { className: "flex", style: { gap: 3 }, "aria-hidden": "true" }, slots.map((s, i) => {
      const on = s.state === "filled" || s.state === "selected";
      return /* @__PURE__ */ window.React.createElement("div", { key: i, style: { flex: 1, height: 6, borderRadius: 3, background: on ? accent : s.state === "listening" ? "var(--kb-accent-soft, rgba(139,156,255,0.5))" : insetBg, opacity: s.state === "listening" ? 0.9 : 1 } });
    })), /* @__PURE__ */ window.React.createElement("div", { style: { fontSize: 13, color: fg2, lineHeight: 1.4, minHeight: 36 }, "aria-live": "polite" }, hint), /* @__PURE__ */ window.React.createElement("div", { className: "flex", style: { gap: 8 } }, /* @__PURE__ */ window.React.createElement("button", { onClick: toggleCopyMode, "aria-pressed": isCopyModeActive, className: "kb-clip-btn flex-1 flex items-center justify-center", style: modeBtn(isCopyModeActive, false) }, /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(isCopyModeActive, 20) }, isCopyModeActive ? "stop_circle" : "content_copy"), isCopyModeActive ? tr("stopCopyMode") : tr("copy")), /* @__PURE__ */ window.React.createElement("button", { onClick: togglePasteMode, "aria-pressed": isPasteModeActive, className: "kb-clip-btn flex-1 flex items-center justify-center", style: modeBtn(isPasteModeActive, !isPasteModeActive && filledCount === 0) }, /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(isPasteModeActive, 20) }, isPasteModeActive ? "stop_circle" : "content_paste"), isPasteModeActive ? tr("stopPasteMode") : tr("paste")))), slots.length > 7 && /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center no-drag-region", style: { height: 40, borderRadius: 999, background: insetBg, padding: "0 14px", gap: 8 } }, /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: { ...iconStyle(false, 20), color: fg3 } }, "search"), /* @__PURE__ */ window.React.createElement(
      "input",
      {
        type: "text",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: tl("search"),
        "aria-label": tl("search"),
        className: "flex-1 min-w-0 border-none outline-none text-sm",
        style: { background: "transparent", color: fg1 }
      }
    )), /* @__PURE__ */ window.React.createElement("div", { className: "overflow-y-auto custom-scrollbar flex flex-col no-drag-region", style: { gap: 6, maxHeight: 260 } }, items.length === 0 && /* @__PURE__ */ window.React.createElement("div", { className: "text-center text-sm", style: { color: fg2, margin: "16px 0" } }, tl("noMatch")), items.map(({ slot, index }) => {
      const selected = slot.state === "selected";
      const listening = slot.state === "listening";
      const filled = slot.state === "filled" || selected;
      const icon = filled ? SLOT_TYPE_ICON[slot.type] || "notes" : listening ? "hearing" : null;
      const clickable = isCopyModeActive && slot.state === "empty" || isPasteModeActive && slot.state === "filled";
      return /* @__PURE__ */ window.React.createElement(
        "div",
        {
          key: index,
          onClick: () => onRowClick(index, slot.state),
          className: "flex items-center",
          style: {
            flexShrink: 0,
            gap: 12,
            minHeight: filled || listening ? 52 : 36,
            padding: "0 8px",
            borderRadius: 16,
            background: filled || listening ? tileBg : "transparent",
            outline: selected || listening ? `2px solid ${accent}` : "none",
            outlineOffset: -2,
            cursor: clickable ? "pointer" : "default"
          }
        },
        /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center justify-center shrink-0", style: { width: 28, height: 28, borderRadius: 10, fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums", ...filled ? tonal : { background: insetBg, color: fg3 } }, title: `${tl("slot")} ${index + 1}` }, index + 1),
        /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 min-w-0 flex items-center", style: { gap: 8 } }, icon && /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined shrink-0", style: { ...iconStyle(selected, 18), color: listening ? accent : fg2 } }, icon), /* @__PURE__ */ window.React.createElement("div", { className: "truncate", style: { fontSize: 13, color: filled ? fg1 : fg3, fontStyle: slot.type === "image" ? "italic" : "normal" } }, preview(slot))),
        (selected || listening) && /* @__PURE__ */ window.React.createElement("span", { style: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, ...filledStyle } }, tl("next")),
        slot.state === "filled" && /* @__PURE__ */ window.React.createElement(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              clearSlot(index);
            },
            "aria-label": tl("clear"),
            title: tl("clear"),
            className: "kb-clip-btn flex items-center justify-center shrink-0",
            style: { width: 32, height: 32, borderRadius: 999, border: 0, cursor: "pointer", background: insetBg, color: fg2 }
          },
          /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(false, 18) }, "delete")
        )
      );
    })), /* @__PURE__ */ window.React.createElement("button", { onClick: resetAll, className: "kb-clip-btn flex items-center justify-center no-drag-region", style: { height: 36, borderRadius: 999, gap: 6, fontSize: 13, fontWeight: 600, color: accent, background: "transparent", border: 0, cursor: "pointer" } }, /* @__PURE__ */ window.React.createElement("span", { className: "material-symbols-outlined", style: iconStyle(false, 18) }, "delete_sweep"), tl("resetAll")));
  };
  if (window.KoBarExtensions?.buttons) {
    window.KoBarExtensions.buttons = window.KoBarExtensions.buttons.filter((b) => b.id !== "kobar-clipboard-manager-btn" && b.id !== CLIPBOARD_BTN_ID);
  }
  if (window.KoBarExtensions?.panels?.delete) {
    window.KoBarExtensions.panels.delete("kobar-clipboard-manager-panel");
  }
  const HAS_TILE_API = typeof window.KoBarExtensions?.setBarItemState === "function";
  if (HAS_TILE_API && window.KoBarExtensions?.registerSidebarButton) {
    window.KoBarExtensions.registerSidebarButton({
      id: CLIPBOARD_BTN_ID,
      icon: "content_paste",
      label: "Clipboard Manager",
      tile: { template: "meter", sensitive: true },
      onClick: (e, anchorRect) => {
        const st = window.useAppStore.getState();
        const isOpen = st.activeExtensionPanelId === CLIPBOARD_PANEL_ID;
        st.closeAllUtilityPopups();
        if (!isOpen) {
          window.useAppStore.setState({ activeExtensionPanelId: CLIPBOARD_PANEL_ID, activeExtensionAnchorRect: anchorRect });
        } else {
          window.useAppStore.setState({ activeExtensionPanelId: null, activeExtensionAnchorRect: null });
        }
      }
    });
    window.KoBarExtensions.registerPanel(CLIPBOARD_PANEL_ID, {
      id: CLIPBOARD_PANEL_ID,
      render: (props) => window.React.createElement(ClipboardPanel, props)
    });
    startClipboardEngine({ publishTile: true });
    if (typeof window.KoBarExtensions.onBarItemChange === "function") {
      try {
        window.KoBarExtensions.onBarItemChange(CLIPBOARD_BTN_ID, (c) => {
          if (c && c.locale && c.locale !== tileLocale) {
            tileLocale = c.locale;
            publishClipboardTile();
          }
        });
      } catch (e) {
      }
    }
  } else if (window.KoBarExtensions?.registerInlineWidget) {
    window.KoBarExtensions.registerInlineWidget("kobar-clipboard-manager-inline", {
      id: "kobar-clipboard-manager-inline",
      render: () => window.React.createElement(InlineClipboardUI)
    });
  }
  if (window.KoBarExtensions?.registerSettingsPanel) {
    window.KoBarExtensions.registerSettingsPanel("com.kobar.clipboardmanager", {
      id: "com.kobar.clipboardmanager",
      render: () => window.React.createElement(SettingsPanelUI)
    });
  }
})(window.React, window.ReactDOM);
