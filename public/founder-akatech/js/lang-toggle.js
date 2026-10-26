// js/lang-toggle.js — sélecteur de langue (FR · EN · ZH · ES · AR · PT), même principe que AKATech Studio
// (components/layout/LanguageToggle.jsx) : le site reste écrit en français ; le cookie `googtrans` + le script
// Google Translate traduisent la page à la volée dans le navigateur. Aucun dictionnaire à maintenir.
// Usage : window.PF_LANG.html() renvoie le sélecteur ; il se branche tout seul (délégation d'événements).
(() => {
'use strict'
const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'pt', label: 'PT', name: 'Português' },
]

const readLang = () => {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/fr\/([\w-]+)/)
  return m && LANGS.some((l) => l.code === m[1]) ? m[1] : 'fr'
}

function setCookie(value) {
  const host = location.hostname
  const expires = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const base = `googtrans=${value}; path=/${expires}`
  document.cookie = base
  document.cookie = `${base}; domain=${host}`
  if (host.split('.').length > 1) document.cookie = `${base}; domain=.${host}`
}

// Google Translate déplace des nœuds du DOM : on évite les erreurs removeChild / insertBefore des autres scripts.
function patchDom() {
  if (window.__pfGtPatched) return
  window.__pfGtPatched = true
  const removeChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) { return child.parentNode !== this ? child : removeChild.apply(this, arguments) }
  const insertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (node, ref) { return ref && ref.parentNode !== this ? node : insertBefore.apply(this, arguments) }
}

function loadGoogleTranslate() {
  if (window.__pfGtLoading) return
  window.__pfGtLoading = true
  patchDom()
  const style = document.createElement('style')
  style.textContent = `
    .goog-te-banner-frame, iframe.skiptranslate, #goog-gt-tt, .goog-tooltip, .goog-te-balloon-frame { display: none !important; }
    body { top: 0 !important; }
    .goog-text-highlight { background: none !important; box-shadow: none !important; }
    #pf-gt-holder { display: none; }`
  document.head.appendChild(style)
  const holder = document.createElement('div'); holder.id = 'pf-gt-holder'; document.body.appendChild(holder)
  window.pfGoogleTranslateInit = () => new window.google.translate.TranslateElement(
    { pageLanguage: 'fr', includedLanguages: LANGS.map((l) => l.code).join(','), autoDisplay: false }, 'pf-gt-holder')
  const script = document.createElement('script')
  script.src = 'https://translate.google.com/translate_a/element.js?cb=pfGoogleTranslateInit'
  script.async = true
  document.body.appendChild(script)
}

const html = () => `<div class="aka-language-toggle notranslate" translate="no" title="Langue / Language"><select aria-label="Langue / Language">${
  LANGS.map((l) => `<option value="${l.code}">${l.label}</option>`).join('')}</select></div>`

// Un seul écouteur pour tous les sélecteurs (barre du haut + menu)
document.addEventListener('change', (e) => {
  const sel = e.target.closest?.('.aka-language-toggle select'); if (!sel) return
  const next = sel.value
  setCookie(next === 'fr' ? '' : `/fr/${next}`)
  location.reload()
})

/** À appeler une fois les sélecteurs insérés dans la page : aligne leur valeur sur la langue courante. */
function sync() {
  const current = readLang()
  document.querySelectorAll('.aka-language-toggle select').forEach((s) => { s.value = current })
  if (current !== 'fr' && location.protocol !== 'file:') loadGoogleTranslate()
}

window.PF_LANG = { LANGS, html, sync, readLang }
})()
