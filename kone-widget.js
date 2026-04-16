/*!
 * Kone AI Publisher Widget v1.0.0
 * https://kone.vc
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.KoneWidget = factory());
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CONSTANTS
  ───────────────────────────────────────────── */
  var API_ENDPOINT = 'https://go.kone.vc/mcp/chat';
  var KONE_APPS    = 'https://kone.vc/apps.html';

  var DEFAULT_CHIPS = [
    { label: '👟 Cheap shoes UK',   question: 'Where can I buy cheap shoes in the UK?' },
    { label: '🤖 Top AI tools',     question: 'Recommend top AI tools for 2025' },
    { label: '💰 Best deals today', question: 'What are the best online deals today?' },
    { label: '✈️ Cheap travel',    question: 'What are cheap travel destinations right now?' },
    { label: '📱 Budget phones',    question: 'What are the best budget smartphones in 2025?' },
  ];

  var DEFAULT_GREETING =
    "Hi! 👋 I'm your free personal AI assistant.\n\n" +
    "I can help you find the best deals, products, and recommendations — " +
    "or answer any question you have.\n\n" +
    "Tap a quick question or ask anything!";

  /* ─────────────────────────────────────────────
     STYLES
  ───────────────────────────────────────────── */
  var CSS = [
    '#kone-widget-root{--kone-acc:{{ACC}};--kone-acc2:{{ACC2}};',
    '--kone-bg:#0d0d10;--kone-s1:#141418;--kone-s2:#1c1c22;--kone-s3:#252528;',
    '--kone-bd:#28282f;--kone-bd2:#333340;--kone-tx:#eeedf2;--kone-tx2:#9896a8;',
    '--kone-tx3:#55535f;--kone-green:#3ecf72;',
    'font-family:"Segoe UI",system-ui,-apple-system,sans-serif;',
    '-webkit-font-smoothing:antialiased}',

    /* Trigger button */
    '#kone-trigger{position:fixed;bottom:24px;right:24px;z-index:2147483647;',
    'display:flex;align-items:center;gap:10px;',
    'background:var(--kone-acc);color:#fff;border:none;border-radius:50px;',
    'padding:13px 20px 13px 16px;cursor:pointer;',
    'box-shadow:0 4px 24px rgba(0,0,0,.4);',
    'font-size:14px;font-weight:600;letter-spacing:.01em;white-space:nowrap;',
    'font-family:inherit;',
    'transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,opacity .2s}',
    '#kone-trigger:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 8px 32px rgba(0,0,0,.5)}',
    '#kone-trigger:active{transform:scale(.97)}',
    '#kone-trigger.kone-hidden{opacity:0;pointer-events:none;transform:translateY(16px) scale(.9)}',

    /* Pulse */
    '.kone-pulse-wrap{position:absolute;top:7px;right:7px;width:10px;height:10px}',
    '.kone-pulse-dot{width:10px;height:10px;background:var(--kone-green);border-radius:50%;position:absolute;inset:0}',
    '.kone-pulse-ring{position:absolute;inset:-3px;border-radius:50%;background:rgba(62,207,114,.3);animation:koneRing 2.5s ease-out infinite}',
    '@keyframes koneRing{0%{transform:scale(.5);opacity:1}100%{transform:scale(2.2);opacity:0}}',

    /* Panel */
    '#kone-panel{position:fixed;bottom:90px;right:24px;z-index:2147483647;',
    'width:370px;height:560px;',
    'background:var(--kone-bg);border:1px solid var(--kone-bd);border-radius:14px;',
    'display:flex;flex-direction:column;overflow:hidden;',
    'box-shadow:0 24px 64px rgba(0,0,0,.8),inset 0 0 0 1px rgba(255,255,255,.04);',
    'transform-origin:bottom right;',
    'opacity:0;pointer-events:none;transform:scale(.92) translateY(16px);',
    'transition:opacity .22s ease,transform .22s cubic-bezier(.34,1.56,.64,1)}',
    '#kone-panel.kone-open{opacity:1;pointer-events:auto;transform:scale(1) translateY(0)}',

    /* Header */
    '#kone-header{display:flex;align-items:center;justify-content:space-between;',
    'padding:13px 14px;border-bottom:1px solid var(--kone-bd);',
    'background:var(--kone-s1);flex-shrink:0}',
    '.kone-h-left{display:flex;align-items:center;gap:10px}',
    '.kone-h-av{width:32px;height:32px;background:var(--kone-acc);border-radius:8px;',
    'display:flex;align-items:center;justify-content:center;',
    'font-size:11px;font-weight:800;color:#fff;flex-shrink:0}',
    '.kone-h-name{font-size:13px;font-weight:600;color:var(--kone-tx);line-height:1}',
    '.kone-h-status{font-size:10px;color:var(--kone-tx3);display:flex;align-items:center;gap:4px;margin-top:2px}',
    '.kone-sdot{width:5px;height:5px;background:var(--kone-green);border-radius:50%;animation:koneBlink 3s ease-in-out infinite}',
    '@keyframes koneBlink{0%,80%,100%{opacity:1}40%{opacity:.3}}',
    '.kone-h-right{display:flex;gap:3px}',
    '.kone-icon-btn{background:none;border:none;color:var(--kone-tx2);cursor:pointer;',
    'width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;',
    'transition:background .15s,color .15s}',
    '.kone-icon-btn:hover{background:var(--kone-s2);color:var(--kone-tx)}',

    /* Screens */
    '.kone-screen{display:none;flex-direction:column;flex:1;min-height:0;overflow:hidden}',
    '.kone-screen.kone-active{display:flex}',

    /* Landing */
    '.kone-hero{padding:18px 14px 12px;flex-shrink:0}',
    '.kone-hero-title{font-size:15px;font-weight:700;color:var(--kone-tx);margin-bottom:4px;line-height:1.3}',
    '.kone-hero-sub{font-size:12px;color:var(--kone-tx3);line-height:1.5}',
    '.kone-section-lbl{font-size:10px;font-weight:700;color:var(--kone-tx3);',
    'letter-spacing:.08em;text-transform:uppercase;padding:0 14px 8px;flex-shrink:0}',
    '.kone-chips{display:flex;flex-direction:column;gap:6px;padding:0 14px;flex:1;overflow-y:auto}',
    '.kone-chips::-webkit-scrollbar{width:2px}',
    '.kone-chips::-webkit-scrollbar-thumb{background:var(--kone-bd2);border-radius:2px}',
    '.kone-chip{background:var(--kone-s2);border:1px solid var(--kone-bd);color:var(--kone-tx2);',
    'font-size:12px;padding:9px 12px;border-radius:10px;cursor:pointer;',
    'display:flex;align-items:center;gap:9px;font-family:inherit;text-align:left;',
    'transition:background .13s,border-color .13s,color .13s,transform .1s}',
    '.kone-chip:hover{background:var(--kone-s3);border-color:var(--kone-acc);color:var(--kone-tx);transform:translateX(2px)}',
    '.kone-chip-icon{font-size:14px;flex-shrink:0;line-height:1}',
    '.kone-cta-area{padding:12px 14px 10px;flex-shrink:0;display:flex;flex-direction:column;gap:7px}',
    '.kone-cta-btn{padding:11px 16px;background:var(--kone-acc);border:none;border-radius:10px;',
    'color:#fff;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;gap:8px;',
    'transition:opacity .13s;box-shadow:0 4px 14px rgba(0,0,0,.3)}',
    '.kone-cta-btn:hover{opacity:.88}',
    '.kone-footer-link{display:block;text-align:center;font-size:10.5px;color:var(--kone-tx3);',
    'text-decoration:none;padding:4px 0 8px;transition:color .13s}',
    '.kone-footer-link:hover{color:var(--kone-acc2)}',

    /* Messages */
    '#kone-msgs{flex:1;overflow-y:auto;padding:12px 12px 8px;',
    'display:flex;flex-direction:column;gap:7px;scroll-behavior:smooth}',
    '#kone-msgs::-webkit-scrollbar{width:3px}',
    '#kone-msgs::-webkit-scrollbar-thumb{background:var(--kone-bd2);border-radius:3px}',
    '.kone-msg{display:flex;gap:8px;align-items:flex-start;animation:koneUp .18s ease both}',
    '@keyframes koneUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}',
    '.kone-msg-av{width:24px;height:24px;border-radius:6px;flex-shrink:0;',
    'display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;margin-top:2px}',
    '.kone-msg-av.a{background:var(--kone-acc);color:#fff}',
    '.kone-msg-av.u{background:var(--kone-s3);color:var(--kone-tx2);border:1px solid var(--kone-bd2)}',
    '.kone-msg-body{flex:1;min-width:0}',
    '.kone-msg-name{font-size:10px;font-weight:700;color:var(--kone-tx3);margin-bottom:3px;',
    'text-transform:uppercase;letter-spacing:.04em}',
    '.kone-msg-text{font-size:13px;line-height:1.65;color:var(--kone-tx);white-space:pre-wrap;word-break:break-word}',
    '.kone-msg-text a{color:var(--kone-acc2);text-decoration:none}',
    '.kone-msg-text a:hover{text-decoration:underline}',
    '.kone-msg-text strong{font-weight:600;color:#fff}',

    /* Typing */
    '.kone-typing{display:flex;gap:4px;padding:4px 0;align-items:center}',
    '.kone-tdot{width:5px;height:5px;background:var(--kone-tx3);border-radius:50%;animation:konePulse 1.3s ease-in-out infinite}',
    '.kone-tdot:nth-child(2){animation-delay:.18s}.kone-tdot:nth-child(3){animation-delay:.36s}',
    '@keyframes konePulse{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}',

    /* Input */
    '#kone-input-area{padding:9px 12px 11px;border-top:1px solid var(--kone-bd);',
    'background:var(--kone-s1);flex-shrink:0}',
    '.kone-input-wrap{position:relative}',
    '#kone-inp{width:100%;background:var(--kone-s2);border:1px solid var(--kone-bd2);border-radius:10px;',
    'padding:10px 44px 10px 13px;color:var(--kone-tx);font-family:inherit;font-size:13px;line-height:1.4;',
    'resize:none;outline:none;min-height:42px;max-height:120px;overflow-y:auto;',
    'transition:border-color .13s}',
    '#kone-inp::placeholder{color:var(--kone-tx3)}',
    '#kone-inp:focus{border-color:var(--kone-acc)}',
    '#kone-send{position:absolute;right:8px;bottom:8px;width:28px;height:28px;',
    'background:var(--kone-acc);border:none;border-radius:7px;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;color:#fff;',
    'transition:opacity .13s}',
    '#kone-send:hover{opacity:.85}',
    '#kone-send:active{transform:scale(.92)}',
    '#kone-send:disabled{opacity:.3;cursor:not-allowed}',
    '.kone-hint{font-size:10px;color:var(--kone-tx3);text-align:center;margin-top:6px;letter-spacing:.02em}',

    /* Mobile */
    '@media(max-width:480px){',
    '#kone-panel{width:calc(100vw - 16px);right:8px;bottom:76px;',
    'height:calc(100dvh - 96px);max-height:580px;border-radius:16px}',
    '#kone-trigger{right:14px;bottom:14px}}',
  ].join('');

  /* ─────────────────────────────────────────────
     HTML TEMPLATE
  ───────────────────────────────────────────── */
  function buildHTML(cfg) {
    var chipsHTML = cfg.quickChips.map(function (c) {
      return '<button class="kone-chip" data-q="' + esc(c.question) + '">' +
        '<span class="kone-chip-icon">' + c.label.split(' ')[0] + '</span>' +
        '<span>' + esc(c.label.replace(/^\S+\s/, '')) + '</span>' +
        '</button>';
    }).join('');

    return '' +
      '<div id="kone-widget-root">' +

      /* Trigger */
      '<button id="kone-trigger" aria-label="Open AI Assistant">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        'Ask AI' +
        '<span class="kone-pulse-wrap"><span class="kone-pulse-dot"></span><span class="kone-pulse-ring"></span></span>' +
      '</button>' +

      /* Panel */
      '<div id="kone-panel" role="dialog" aria-label="AI Assistant" aria-hidden="true">' +

        /* Header */
        '<div id="kone-header">' +
          '<div class="kone-h-left">' +
            '<div class="kone-h-av">AI</div>' +
            '<div>' +
              '<div class="kone-h-name">AI Assistant</div>' +
              '<div class="kone-h-status"><span class="kone-sdot"></span>online</div>' +
            '</div>' +
          '</div>' +
          '<div class="kone-h-right">' +
            '<button class="kone-icon-btn" id="kone-reset" title="New conversation">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>' +
            '</button>' +
            '<button class="kone-icon-btn" id="kone-close" title="Close">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +

        /* Landing screen */
        '<div class="kone-screen kone-active" id="kone-land">' +
          '<div class="kone-hero">' +
            '<div class="kone-hero-title">Your free personal AI assistant</div>' +
            '<div class="kone-hero-sub">Ask anything — deals, tech, travel, health, finance and more</div>' +
          '</div>' +
          '<div class="kone-section-lbl">Try asking</div>' +
          '<div class="kone-chips">' + chipsHTML + '</div>' +
          '<div class="kone-cta-area">' +
            '<button class="kone-cta-btn" id="kone-open-chat">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
              'Ask your own question' +
            '</button>' +
            '<a class="kone-footer-link" href="' + KONE_APPS + '" target="_blank" rel="noopener">More AI agents \u2197</a>' +
          '</div>' +
        '</div>' +

        /* Chat screen */
        '<div class="kone-screen" id="kone-chat">' +
          '<div id="kone-msgs" role="log" aria-live="polite"></div>' +
          '<div id="kone-input-area">' +
            '<div class="kone-input-wrap">' +
              '<textarea id="kone-inp" placeholder="Ask me anything\u2026" rows="1" maxlength="512" aria-label="Your message"></textarea>' +
              '<button id="kone-send" aria-label="Send">' +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                  '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>' +
              '</button>' +
            '</div>' +
            '<p class="kone-hint">Your free personal AI assistant &middot; <a class="kone-footer-link" style="display:inline;padding:0" href="' + KONE_APPS + '" target="_blank" rel="noopener">More AI agents \u2197</a></p>' +
          '</div>' +
        '</div>' +

      '</div>' + /* /panel */
      '</div>';  /* /root */
  }

  /* ─────────────────────────────────────────────
     MAIN CLASS
  ───────────────────────────────────────────── */
  function KoneWidget(options) {
    if (!options || !options.apiKey) throw new Error('[KoneWidget] apiKey is required');

    this.apiKey      = options.apiKey;
    this.siteUrl     = options.siteUrl     || window.location.origin;
    this.greeting    = options.greeting    || DEFAULT_GREETING;
    this.accentColor = options.accentColor || '#5b6ef5';
    this.accentColor2 = options.accentColor2 || '#7b8fff';
    this.quickChips  = options.quickChips  || DEFAULT_CHIPS;

    this._responseId = null;
    this._isLoading  = false;
    this._isOpen     = false;
    this._greeted    = false;
  }

  KoneWidget.prototype.init = function () {
    var self = this;

    /* Inject CSS */
    if (!document.getElementById('kone-widget-css')) {
      var style = document.createElement('style');
      style.id = 'kone-widget-css';
      style.textContent = CSS
        .replace(/\{\{ACC\}\}/g,  self.accentColor)
        .replace(/\{\{ACC2\}\}/g, self.accentColor2);
      document.head.appendChild(style);
    }

    /* Inject HTML */
    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildHTML(self);
    document.body.appendChild(wrapper);

    /* Cache elements */
    self._trigger  = document.getElementById('kone-trigger');
    self._panel    = document.getElementById('kone-panel');
    self._land     = document.getElementById('kone-land');
    self._chat     = document.getElementById('kone-chat');
    self._msgs     = document.getElementById('kone-msgs');
    self._inp      = document.getElementById('kone-inp');
    self._sendBtn  = document.getElementById('kone-send');

    /* Events */
    self._trigger.addEventListener('click', function () { self.open(); });
    document.getElementById('kone-close').addEventListener('click', function () { self.close(); });
    document.getElementById('kone-reset').addEventListener('click', function () { self._reset(); });
    document.getElementById('kone-open-chat').addEventListener('click', function () { self._showChat(); });
    self._sendBtn.addEventListener('click', function () { self._sendFromInput(); });

    self._inp.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    self._inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self._sendFromInput(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self._isOpen) self.close();
    });

    /* Chip clicks */
    document.querySelectorAll('#kone-widget-root .kone-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-q');
        if (!q) return;
        self._showChat();
        setTimeout(function () { self._doSend(q); }, 160);
      });
    });

    return self;
  };

  /* ── Open / Close ── */
  KoneWidget.prototype.open = function () {
    this._isOpen = true;
    this._panel.classList.add('kone-open');
    this._panel.setAttribute('aria-hidden', 'false');
    this._trigger.classList.add('kone-hidden');
    var self = this;
    setTimeout(function () { self._inp.focus(); }, 220);
  };

  KoneWidget.prototype.close = function () {
    this._isOpen = false;
    this._panel.classList.remove('kone-open');
    this._panel.setAttribute('aria-hidden', 'true');
    this._trigger.classList.remove('kone-hidden');
  };

  /* ── Screen switching ── */
  KoneWidget.prototype._showChat = function () {
    this._land.classList.remove('kone-active');
    this._chat.classList.add('kone-active');
    if (!this._greeted) {
      this._greeted = true;
      this._appendMsg('a', this.greeting);
    }
    var self = this;
    setTimeout(function () { self._inp.focus(); }, 80);
  };

  KoneWidget.prototype._showLand = function () {
    this._chat.classList.remove('kone-active');
    this._land.classList.add('kone-active');
  };

  KoneWidget.prototype._reset = function () {
    if (this._isLoading) return;
    this._responseId = null;
    this._greeted    = false;
    this._msgs.innerHTML = '';
    this._showChat();
  };

  /* ── Send ── */
  KoneWidget.prototype._sendFromInput = function () {
    var text = this._inp.value.trim();
    if (!text || text.length > 512) return;
    this._inp.value = '';
    this._inp.style.height = 'auto';
    this._doSend(text);
  };

  KoneWidget.prototype._doSend = async function (prompt) {
    if (this._isLoading) return;
    this._isLoading = true;
    this._sendBtn.disabled = true;

    if (!this._chat.classList.contains('kone-active')) this._showChat();
    this._appendMsg('u', prompt);
    var typingEl = this._showTyping();

    var payload = { url: this.siteUrl, prompt: prompt, api_key: this.apiKey };
    if (this._responseId) payload.response_id = this._responseId;

    try {
      var res = await fetch(API_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      this._removeEl(typingEl);

      if (!res.ok) {
        var errText = '';
        try { errText = await res.text(); } catch (e) {}
        this._appendMsg('a', '\u26a0\ufe0f Error ' + res.status + '. Please try again.' + (errText ? '\n' + errText.slice(0, 100) : ''));
      } else {
        var data = null;
        try { data = await res.json(); } catch (e) {}
        if (data && typeof data === 'object') {
          if (data.response_id) this._responseId = String(data.response_id);
          var msg = data.message || data.response || data.text || data.content || JSON.stringify(data);
          this._appendMsg('a', msg);
        } else {
          var raw = '';
          try { raw = await res.text(); } catch (e) {}
          this._appendMsg('a', raw || 'Empty response. Please try again.');
        }
      }
    } catch (err) {
      this._removeEl(typingEl);
      this._appendMsg('a', '\u26a0\ufe0f Connection error.\n' + err.message);
    }

    this._isLoading = false;
    this._sendBtn.disabled = false;
    this._inp.focus();
  };

  /* ── DOM helpers ── */
  KoneWidget.prototype._appendMsg = function (role, text) {
    var isA = role === 'a';
    var row  = document.createElement('div');
    row.className = 'kone-msg';
    row.innerHTML =
      '<div class="kone-msg-av ' + role + '">' + (isA ? 'AI' : 'U') + '</div>' +
      '<div class="kone-msg-body">' +
        '<div class="kone-msg-name">' + (isA ? 'AI Assistant' : 'You') + '</div>' +
        '<div class="kone-msg-text">' + (isA ? fmt(text) : esc(text)) + '</div>' +
      '</div>';
    this._msgs.appendChild(row);
    this._msgs.scrollTop = this._msgs.scrollHeight;
  };

  KoneWidget.prototype._showTyping = function () {
    var row = document.createElement('div');
    row.className = 'kone-msg';
    row.innerHTML =
      '<div class="kone-msg-av a">AI</div>' +
      '<div class="kone-msg-body">' +
        '<div class="kone-msg-name">AI Assistant</div>' +
        '<div class="kone-typing"><div class="kone-tdot"></div><div class="kone-tdot"></div><div class="kone-tdot"></div></div>' +
      '</div>';
    this._msgs.appendChild(row);
    this._msgs.scrollTop = this._msgs.scrollHeight;
    return row;
  };

  KoneWidget.prototype._removeEl = function (el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  };

  /* ─────────────────────────────────────────────
     TEXT HELPERS
  ───────────────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmt(s) {
    var o = esc(s);
    o = o.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    o = o.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    o = o.replace(/`([^`]+)`/g,
      '<code style="font-family:monospace;background:var(--kone-s2);padding:1px 5px;border-radius:4px;font-size:.85em">$1</code>');
    o = o.replace(/^[-*] (.+)$/gm,
      '<span style="display:flex;gap:6px;margin:1px 0"><span style="color:var(--kone-acc2);flex-shrink:0">\u2013</span><span>$1</span></span>');
    o = o.replace(/\n/g, '<br>');
    return o;
  }

  /* ─────────────────────────────────────────────
     FACTORY
  ───────────────────────────────────────────── */
  function create(options) {
    return new KoneWidget(options).init();
  }

  return { create: create, KoneWidget: KoneWidget };
}));
