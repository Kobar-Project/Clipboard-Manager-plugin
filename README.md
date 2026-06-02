<div align="center">
  <img src="https://github.com/Kobar-Project/KoBar/raw/master/build/icon.png" alt="KoBar Logo" width="120"/>
  <h1>Clipboard Manager - KoBar Plugin</h1>
  <p><em>Your sequential, multi-slot clipboard tool for an efficient workflow.</em></p>
  
  [![KoBar Ecosystem](https://img.shields.io/badge/KoBar-Ecosystem-f4a125?style=for-the-badge&logo=electron&logoColor=white)](https://github.com/Kobar-Project)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

KoBar is a versatile platform designed to host a rich ecosystem of plugins, seamlessly integrating powerful tools directly into your daily workflow. As a core extension for this ecosystem, the **Clipboard Manager** (Copy & Paste) transforms KoBar into a highly efficient sequential, multi-slot clipboard tool.

## What is Clipboard Manager?

The Clipboard Manager is a powerful, built-in utility for KoBar that brings a visual, sequential clipboard system to your desktop. Instead of a standard clipboard history that just stores your last copied item, this plugin provides configurable "slots" (from 4 up to 20). It allows you to enter a **Copy Mode** to sequentially store multiple copied items (text, images, etc.) into these slots, and a **Paste Mode** to paste them back in exact order without needing to switch windows or use complex shortcuts. It deeply integrates with KoBar's UI, adapting to horizontal and vertical layouts automatically.

## Key Features

- **Sequential Multi-Slot System:** Configure between 4 to 20 clipboard slots. Visually see which slots are empty, listening, filled, or selected for pasting.
- **Dedicated Copy & Paste Modes:** 
  - **Copy Mode:** Automatically catches your clipboard copies (via `window.api.onClipboardUpdate`) and sequentially fills up your available slots.
  - **Paste Mode:** Automatically queues the filled slots for pasting (via `window.api.onRequestNextPaste`) in the order they were copied.
- **Rich Content Support:** Stores and previews both text (truncated dynamically) and image content. 
- **Smart Previews:** Click on a filled slot to open a non-obtrusive, floating preview portal that reveals the exact content you're about to paste. The tooltip auto-hides based on your custom duration settings.
- **Deep KoBar Integration:**
  - Plugs right into KoBar's global theming and orientation system (horizontal or vertical designs).
  - Uses native Electron APIs for seamless system clipboard monitoring and global paste execution without unsafe methods.
- **Multilingual Support:** Built-in localization for 10 languages including English, Turkish, German, French, Spanish, Japanese, Russian, Arabic, Chinese, and Hindi.

## Configuration & Usage

1. **Installation:** Ensure the `Clipboard Manager` (Copy & Paste) plugin is enabled in your KoBar plugin settings.
2. **Setup:** Access the KoBar Settings panel to adjust the number of slots (4-20) and configure the tooltip auto-hide duration (1s to Never Hide).
3. **Copying:** 
   - Click the "Copy" icon in the KoBar UI to start **Copy Mode**. 
   - Start copying text or images from any application. The slots will visually fill up one by one.
4. **Pasting:**
   - Click the "Paste" icon to enter **Paste Mode**.
   - Focus on your target application and trigger pastes sequentially; the plugin manages the queue automatically.
5. **Resetting:** Double-click either the Copy or Paste buttons to instantly reset and clear all slots.

---

## ✉️ Contact

For support or inquiries, you can contact us at [hello@kobar.org](mailto:hello@kobar.org).

[KoBar.org](https://kobar.org)

---

## 💛 Sponsors & Backers

If you find KoBar useful and want to support its ongoing development, consider backing the project through any of the platforms below:

<p align="center">
  <a href="https://www.patreon.com/kobarproject" target="_blank">
    <img src="https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white" alt="Become a Patron" />
  </a>
  <a href="https://opencollective.com/kobar" target="_blank">
    <img src="https://img.shields.io/badge/Open_Collective-7FADF2?style=for-the-badge&logo=open-collective&logoColor=white" alt="Open Collective" />
  </a>
</p>