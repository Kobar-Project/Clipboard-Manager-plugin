# Changelog

## 1.0.6

- Slots now sit as one block between the Copy and Paste buttons: 2/3/4 rows by density in both vertical and horizontal bars, no overlap with other icons. On the new KoBar, rapid back-to-back Ctrl+V presses are no longer skipped; if a paste fails the item is put back. Hardened against a missing host store and a shorter paste debounce on older KoBar versions.
- The slot preview bubble now stays fully inside the screen: it flips to the other side and shifts at screen edges, and scrolls if it is larger than the window.
