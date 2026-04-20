/*!
 * Kone AI Publisher Widget v1.7.0 - IAB & SafeFrame Compliant
 * Optimized for Custom Branding
 */

(function (global, factory) {
  global.KoneWidget = factory();
}(this, function () {
  'use strict';

  var API_ENDPOINT = 'https://go.kone.vc/mcp/chat';
  var ICON_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMCIgZmlsbD0iI0U2NTEyNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjE3IiB5PSIxNSIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjIxIiB5PSIxNSIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==';

  /* ── IAB & SAFEFRAME HELPERS [cite: 437, 542] ── */

  function getContextUrl() {
    if (window.$sf && window.$sf.ext) {
      try { return window.$sf.ext.meta('host_url') || window.location.origin; } catch (e) {}
    }
    return window.location.origin;
  }

  function getContextTitle() {
    if (window.$sf && window.$sf.ext) {
      try { return window.$sf.ext.meta('host_title') || window.$sf.ext.meta('title') || "this website"; } catch (e) {}
    }
    return "this website";
  }

  function handleExit(url) {
    var targetURL = window.clickTag || url; // IAB clickTag standard 
    window.open(targetURL, '_blank', 'noopener,noreferrer');
  }

  /* ── STYLES [cite: 266, 311] ── */
  var CSS = [
    '* { box-sizing: border-box; }',
    '#kone-widget-root{--kone-acc:#E65127;--kone-bg:#0d0d10;--kone-s1:#141418;--kone-bd:#28282f;--kone-tx:#eeedf2;--kone-tx2:#9896a8;--kone-green:#3ecf72;',
    '--kone-link:#ff7b7b; --kone-role:#a5d8ff;', /* Custom colors for links and roles */
    'font-family:"Segoe UI",system-ui,-apple-system,sans-serif;width:300px;height:600px;overflow:hidden;position:relative;background:var(--kone-bg); border: 1px solid var(--kone-bd);}',
    
    '#kone-header{display:flex;align-items:center;padding:12px;background:var(--kone-s1);border-bottom:1px solid var(--kone-bd);gap:12px;}',
    '.kone-avatar{width:40px;height:40px;border-radius:10px;flex-shrink:0;}',
    '.kone-title-wrap{display:flex;flex-direction:column;flex:1;}',
    '.kone-title{color:#fff;font-weight:700;font-size:16px;line-height:1.2;}',
    '.kone-status{display:flex;align-items:center;gap:6px;color:var(--kone-tx2);font-size:12px;margin-top:2px;}',
    '.kone-dot{width:8px;height:8px;background:var(--kone-green);border-radius:50%;animation:koneBlink 2s infinite ease-in-out;}',
    '@keyframes koneBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.8)}}',
    
    '#kone-panel{width:100%;height:100%;display:flex;flex-direction:column;}',
    '#kone-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:12px;}',
    '.kone-msg-text{font-size:13px;line-height:1.5;color:var(--kone-tx);word-break:break-word;}',
    '.kone-role-label{color:var(--kone-role); font-weight:700; margin-right:4px;}', /* Role Label Style */
    '.kone-msg-text a{color:var(--kone-link); text-decoration:none; font-weight:600;}', /* Link Style */
    '.kone-msg-text a:hover{text-decoration:underline;}',
    '.kone-msg-text strong { color: #fff; }',

    /* TYPING INDICATOR  */
    '.kone-typing-wrap{display:flex; align-items:center; gap:6px; padding:4px 0; color:var(--kone-tx2); font-size:12px; font-style:italic;}',
    '.kone-typing-dots{display:flex; gap:3px;}',
    '.kone-typing-dot{width:4px; height:4px; background:var(--kone-tx2); border-radius:50%; animation:koneTyping 1.4s infinite;}',
    '.kone-typing-dot:nth-child(2){animation-delay:0.2s;}',
    '.kone-typing-dot:nth-child(3){animation-delay:0.4s;}',
    '@keyframes koneTyping{0%,100%{opacity:0.2;} 50%{opacity:1;}}',
    
    '#kone-input-area{padding:12px;background:transparent;width:300px;}',
    '.kone-pill-wrap{background:#fff;border-radius:30px;display:flex;align-items:center;padding:4px 4px 4px 16px;gap:8px;width:100%;box-shadow: 0 2px 8px rgba(0,0,0,0.4);}',
    '#kone-inp{flex:1;border:none;background:transparent;outline:none;font-size:14px;color:#333;padding:8px 0;width:100%;font-family:inherit;}',
    '#kone-send{background:var(--kone-acc);border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '#kone-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}'
  ].join('');

  function KoneWidget(options) {
    this.siteUrl = getContextUrl();
    this.siteTitle = getContextTitle(); 
    this._isLoading = false;
    this._responseId = null;
  }

  KoneWidget.prototype.init = function () {
    var self = this;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = document.getElementById('kone-widget-root');
    root.innerHTML = this._buildTemplate();

    this._msgs = document.getElementById('kone-msgs');
    this._inp = document.getElementById('kone-inp');
    this._sendBtn = document.getElementById('kone-send');
    this._land = document.getElementById('kone-land');

    this._sendBtn.addEventListener('click', function() { self._handleSend(); });
    this._inp.addEventListener('keydown', function(e) { 
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self._handleSend(); }
    });

    root.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        handleExit(e.target.getAttribute('href'));
      }
    });

    return this;
  };

  KoneWidget.prototype._buildTemplate = function () {
    var greeting = "Hello! 👋 I'm your AI consultant for <b>" + esc(this.siteTitle) + "</b>.<br/><br/>What would you like to explore today?";
    return '<div id="kone-panel">' +
      '<div id="kone-header">' +
        '<img class="kone-avatar" src="' + ICON_BASE64 + '" />' +
        '<div class="kone-title-wrap">' +
          '<div class="kone-title">AI Consultant</div>' +
          '<div class="kone-status"><span class="kone-dot"></span>online</div>' +
        '</div>' +
      '</div>' +
      '<div id="kone-msgs" role="log" aria-live="polite">' +
        '<div id="kone-land" class="kone-msg-text">' + greeting + '</div>' +
      '</div>' +
      '<div id="kone-input-area">' +
        '<div class="kone-pill-wrap">' +
          '<input id="kone-inp" placeholder="Ask your question" maxlength="512" />' +
          '<button id="kone-send" title="Go">' +
            '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  KoneWidget.prototype._handleSend = function () {
    var text = this._inp.value.trim();
    if (!text || this._isLoading) return;
    this._inp.value = '';
    if (this._land) { this._land.style.display = 'none'; this._land = null; }
    this._doSend(text);
  };

  KoneWidget.prototype._doSend = async function (prompt) {
    this._isLoading = true;
    this._appendMsg('u', prompt);
    
    // Add Typing Indicator
    var typingEl = this._addTypingIndicator();

    var payload = { prompt: prompt, url: this.siteUrl };
    if (this._responseId) payload.response_id = this._responseId;

    try {
      var res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await res.json();
      
      this._removeTypingIndicator(typingEl);
      if (data.response_id) this._responseId = data.response_id;
      this._appendMsg('a', data.response || "I'm sorry, I couldn't process that.");
    } catch (e) {
      this._removeTypingIndicator(typingEl);
      this._appendMsg('a', "Connection error.");
    }
    this._isLoading = false;
  };

  KoneWidget.prototype._appendMsg = function (role, text) {
    var isAI = (role === 'a');
    var label = isAI ? 'AI Consultant:' : 'You:';
    var content = isAI ? fmt(text) : esc(text);
    
    var msg = document.createElement('div');
    msg.className = 'kone-msg';
    msg.innerHTML = '<div class="kone-msg-text"><span class="kone-role-label">' + label + '</span>' + content + '</div>';
    this._msgs.appendChild(msg);
    this._msgs.scrollTop = this._msgs.scrollHeight;
  };

  KoneWidget.prototype._addTypingIndicator = function () {
    var wrap = document.createElement('div');
    wrap.className = 'kone-typing-wrap';
    wrap.innerHTML = 'typing <div class="kone-typing-dots"><div class="kone-typing-dot"></div><div class="kone-typing-dot"></div><div class="kone-typing-dot"></div></div>';
    this._msgs.appendChild(wrap);
    this._msgs.scrollTop = this._msgs.scrollHeight;
    return wrap;
  };

  KoneWidget.prototype._removeTypingIndicator = function (el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function fmt(s) {
    var o = esc(s);
    o = o.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    o = o.replace(/`(.*?)`/g, '<code>$1</code>');
    o = o.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
    o = o.replace(/\n/g, '<br>');
    return o;
  }

  return { create: function(opt) { return new KoneWidget(opt).init(); } };
}));