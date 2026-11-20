Implemented multilingual support (EN/JA/ZH/KO/FR/ES) across the guest manual site.

What changed
- Added global language infrastructure:
  - assets/i18n.js: Injects a language switcher, persists selection (localStorage), detects browser language, and syncs chat UI on the top page.
  - assets/i18n.css: Styles for the switcher and class-based visibility rules (.lang-en/ja/zh/ko/fr/es).

- Top page (index.html):
  - Added i18n script include.
  - Localized Wi‑Fi labels and hint.
  - Extended all menu section titles and button labels to 6 languages using language-specific spans (kept existing pl-en/pl-ja; mapped to .lang-en/.lang-ja).
  - Chat language now follows the selected language.

- Subpages updated to show the global switcher and class-based texts (titles, key labels, and important body text):
  - access/, nearby-shops/: replaced per-page i18n with class-based text blocks; removed inline translation scripts; kept content and images.
  - wifi/, manual/: localized page titles and core guidance text (no codes added), and included the global script.
  - house-rules/, equipment/, laundry/, trash/, emergency/, circuit-breaker/, airport/, nearby/, transportation/: localized page titles (and brief body/back labels where applicable) and included the global script.

Notes
- All URLs remain unchanged; no assets were renamed.
- Images and links were preserved exactly.
- The Wi‑Fi SSID/password on the Wi‑Fi page remain as originally shown (allowed per brief).
- No access codes or door codes were introduced anywhere; key-related pages contain guidance text only.

Known follow-ups (optional)
- Some pages (e.g., taxi/, gas-reset/, how-to-open/, parking/) originally had their own language bars and inline translation logic. The core site-wide i18n is now available; these pages can be migrated to the class-based scheme in a later pass to fully unify the implementation.
