/*!
 * Kone AI Publisher Special Offers Widget v1.0.1 - IAB & SafeFrame Compliant
 */

(function (global, factory) {
  global.KoneWidget = factory(global);
}(typeof window !== 'undefined' ? window : this, function (global) {
  'use strict';

  var API_ENDPOINT = 'https://go.kone.vc/monetize/konevc';
  var ICON_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMCIgZmlsbD0iI0U2NTEyNyIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjE3IiB5PSIxNSIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjIxIiB5PSIxNSIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==';

  var DEFAULT_CHIPS = [
    { label: '🤖 Top AI tools',     question: 'Recommend top AI tools for development' },
    { label: '💰 Best deals today', question: 'What are the best online deals today?' },
    { label: '✈️ Cheap travel',    question: 'What are cheap travel destinations right now?' },
    { label: '📱 Budget phones',    question: 'What are the best budget smartphones right now?' },
  ];

  var DEFAULT_GREETING =
    "Hi! 👋 I'm your free personal AI assistant.\n\n" +
    "I can help you find the best deals, products and recommendations.\n\n" +
    "Tap a quick question or ask for hot deals!";

  function handleExit(url) {
    var targetURL = url || window.clickTag; 
    if (targetURL) {
      window.open(targetURL, '_blank', 'noopener,noreferrer');
    }
  }

  function getSafeFrameExt() {
    return global.$sf && global.$sf.ext ? global.$sf.ext : null;
  }

  function getGeomSize(geom, key) {
    var obj = geom && geom[key];
    return {
      w: Number(obj && (obj.w || obj.width)) || 0,
      h: Number(obj && (obj.h || obj.height)) || 0
    };
  }

  function getGeomRect(geom, key) {
    var obj = geom && geom[key];
    return {
      l: Number(obj && (obj.l || obj.left)) || 0,
      t: Number(obj && (obj.t || obj.top)) || 0,
      w: Number(obj && (obj.w || obj.width)) || 0,
      h: Number(obj && (obj.h || obj.height)) || 0
    };
  }

  function hasGeomPosition(geom, key) {
    var obj = geom && geom[key];
    return !!obj && ('l' in obj || 'left' in obj || 't' in obj || 'top' in obj);
  }

  function notifyParent(action) {
    if (global.parent === global) return;

    try {
      global.parent.postMessage({
        source: 'kone-widget',
        action: action
      }, '*');
    } catch (e) {}
  }
  
  /* ── STYLES [cite: 266, 311] ── */
  var CSS = [
    '* { box-sizing: border-box; }',
    '#kone-widget-root{--kone-acc:#E65127;--kone-bg:#0d0d10;--kone-s1:#141418;--kone-s2:#1c1c22;--kone-s3:#252528;--kone-bd:#28282f;--kone-tx:#eeedf2;--kone-tx2:#9896a8;--kone-green:#3ecf72; --kone-link:#ff7b7b; --kone-role:#a5d8ff; font-family:"Segoe UI",system-ui,-apple-system,sans-serif;width:100%;height:100%;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 0%,#272129 0,#0d0d10 44%,#0d0d10 100%);}',
    'html.kone-expanded body{background:transparent;}',
    'html.kone-expanded #ad-container{border:0;}',
    '#kone-widget-root.kone-expanded{background:transparent;pointer-events:none;}',
    '#kone-widget-root.kone-expanded #kone-launcher{display:none;}',
    '#kone-widget-root.kone-expanded #kone-popup{pointer-events:auto;}',
    '#kone-launcher{width:100%;height:100%;display:flex;flex-direction:column;padding:18px 16px 16px;}',
    '#kone-launcher-top{display:flex;align-items:center;gap:12px;}',
    '#kone-launcher-copy{margin-top:24px;color:var(--kone-tx);}',
    '#kone-launcher-copy h1{font-size:24px;line-height:1.12;margin:0 0 10px;font-weight:800;letter-spacing:0;}',
    '#kone-launcher-copy p{font-size:13px;line-height:1.5;margin:0;color:var(--kone-tx2);}',
    '#kone-launcher-actions{margin-top:auto;display:flex;flex-direction:column;gap:12px;}',
    '#kone-popup{position:fixed;left:50vw;top:50vh;width:50vw;height:50vh;z-index:3;display:none;flex-direction:column;background:var(--kone-bg);border:1px solid var(--kone-bd);border-radius:8px;box-shadow:0 14px 36px rgba(0,0,0,0.55);overflow:hidden;transform:translate(-50%,-50%);}',
    '#kone-popup.kone-open{display:flex;}',
    '#kone-header{display:flex;align-items:center;padding:12px;background:var(--kone-s1);border-bottom:1px solid var(--kone-bd);gap:12px;}',
    '.kone-avatar{width:40px;height:40px;border-radius:10px;flex-shrink:0;}',
    '.kone-title-wrap{display:flex;flex-direction:column;flex:1;}',
    '.kone-title{color:#fff;font-weight:700;font-size:16px;line-height:1.2;}',
    '.kone-status{display:flex;align-items:center;gap:6px;color:var(--kone-tx2);font-size:12px;margin-top:2px;}',
    '#kone-close{width:30px;height:30px;border:1px solid var(--kone-bd);border-radius:50%;background:var(--kone-s2);color:var(--kone-tx2);cursor:pointer;font-size:20px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;}',
    '#kone-close:hover{color:#fff;border-color:var(--kone-acc);}',
    '.kone-dot{width:8px;height:8px;background:var(--kone-green);border-radius:50%;animation:koneBlink 2s infinite ease-in-out;}',
    '@keyframes koneBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.8)}}',
    '#kone-panel{width:100%;height:100%;display:flex;flex-direction:column;min-height:0;}',
    '#kone-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:12px;}',
    '.kone-msg-text{font-size:13px;line-height:1.5;color:var(--kone-tx);white-space:pre-wrap;word-break:break-word;}',
    '.kone-role-label{color:var(--kone-role); font-weight:700; margin-right:4px;}',
    '.kone-msg-text a{color:var(--kone-link); text-decoration:none; font-weight:600;}',
    '.kone-msg-text a:hover{text-decoration:underline;}',
    '.kone-msg-text strong { color: #fff; }',
    '.kone-chips{display:flex;flex-direction:column;gap:6px;padding:0;overflow-y:auto; transition: opacity 0.2s;}',
    '.kone-chip{background:var(--kone-s2);border:1px solid var(--kone-bd);color:var(--kone-tx2); font-size:12px;padding:9px 12px;border-radius:10px;cursor:pointer; display:flex;align-items:center;gap:9px;font-family:inherit;text-align:left; transition:background .13s,border-color .13s;}',
    '.kone-chip:hover{background:var(--kone-s3);border-color:var(--kone-acc);color:var(--kone-tx);}',
    '.kone-typing-wrap{display:flex; align-items:center; gap:6px; padding:4px 0; color:var(--kone-tx2); font-size:12px; font-style:italic;}',
    '.kone-typing-dots{display:flex; gap:3px;}',
    '.kone-typing-dot{width:4px; height:4px; background:var(--kone-tx2); border-radius:50%; animation:koneTyping 1.4s infinite;}',
    '@keyframes koneTyping{0%,100%{opacity:0.2;} 50%{opacity:1;}}',
    '#kone-input-area{padding:12px;background:transparent;width:100%;display:flex;flex-direction:column;gap:14px;}',
    '.kone-pill-wrap{background:#fff;border-radius:30px;display:flex;align-items:center;padding:4px 4px 4px 16px;gap:8px;width:100%;box-shadow: 0 2px 8px rgba(0,0,0,0.4);}',
    '.kone-input{flex:1;border:none;background:transparent;outline:none;font-size:14px;color:#333;padding:8px 0;width:100%;font-family:inherit;min-width:0;}',
    '.kone-send{background:var(--kone-acc);border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '.kone-send svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}',
    '@media (max-width: 399px){#kone-popup #kone-header{padding:8px;gap:7px;}#kone-popup .kone-avatar{width:28px;height:28px;border-radius:8px;}#kone-popup .kone-title{font-size:12px;}#kone-popup .kone-status{font-size:10px;gap:4px;}#kone-popup #kone-close{width:24px;height:24px;font-size:17px;}#kone-popup .kone-dot{width:6px;height:6px;}#kone-popup #kone-msgs{padding:8px;gap:8px;}#kone-popup .kone-msg-text{font-size:11px;line-height:1.4;}#kone-popup #kone-input-area{padding:8px;}#kone-popup .kone-pill-wrap{padding:3px 3px 3px 9px;gap:4px;}#kone-popup .kone-input{font-size:11px;padding:5px 0;}#kone-popup .kone-send{width:26px;height:26px;}}'
  ].join('');

  function KoneWidget(options) {
    this._isLoading = false;
    this._isOpen = false;
    this._isExpanded = false;
    this._responseId = null;
    this.quickChips  = DEFAULT_CHIPS;
  }

  KoneWidget.prototype.init = function () {
    var self = this;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = document.getElementById('kone-widget-root');
    this._root = root;
    root.innerHTML = this._buildTemplate(self);

    this._popup = document.getElementById('kone-popup');
    this._msgs = document.getElementById('kone-msgs');
    this._launcherInp = document.getElementById('kone-launcher-inp');
    this._popupInp = document.getElementById('kone-popup-inp');
    this._launcherSendBtn = document.getElementById('kone-launcher-send');
    this._popupSendBtn = document.getElementById('kone-popup-send');
    this._closeBtn = document.getElementById('kone-close');

    this._launcherSendBtn.addEventListener('click', function() { self._handleLauncherSend(); });
    this._popupSendBtn.addEventListener('click', function() { self._handlePopupSend(); });
    this._closeBtn.addEventListener('click', function() { self._closePopup(); });
    this._launcherInp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self._handleLauncherSend(); }
    });
    this._popupInp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); self._handlePopupSend(); }
    });

    root.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        handleExit(e.target.getAttribute('href'));
      }
    });

    document.querySelectorAll('#kone-widget-root .kone-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-q');
        if (!q || self._isLoading) return;
        self._openPopup();
        self._doSend(q);
      });
    });

    return this;
  };

  KoneWidget.prototype._buildTemplate = function (cfg) {
    var chipsHTML = cfg.quickChips.map(function (c) {
      return '<button class="kone-chip" data-q="' + esc(c.question) + '">' +
        '<span class="kone-chip-icon">' + c.label.split(' ')[0] + '</span>' +
        '<span>' + esc(c.label.replace(/^\S+\s/, '')) + '</span>' +
        '</button>';
    }).join('');

    return '<div id="kone-launcher">' +
      '<div id="kone-launcher-top">' +
        '<img class="kone-avatar" src="' + ICON_BASE64 + '" alt="" />' +
        '<div class="kone-title-wrap">' +
          '<div class="kone-title">AI Hot Dealer</div>' +
          '<div class="kone-status"><span class="kone-dot"></span>online</div>' +
        '</div>' +
      '</div>' +
      '<div id="kone-launcher-copy">' +
        '<h1>Find better offers with AI</h1>' +
        '<p>Ask for deals, product picks, travel ideas, and quick recommendations.</p>' +
      '</div>' +
      '<div id="kone-launcher-actions">' +
        '<div class="kone-chips">' + chipsHTML + '</div>' +
        '<div class="kone-pill-wrap">' +
          '<input id="kone-launcher-inp" class="kone-input" placeholder="Ask your question" maxlength="512" />' +
          '<button id="kone-launcher-send" class="kone-send" title="Go">' +
            '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="kone-popup" aria-hidden="true">' +
    '<div id="kone-panel">' +
      '<div id="kone-header">' +
        '<img class="kone-avatar" src="' + ICON_BASE64 + '" alt="" />' +
        '<div class="kone-title-wrap">' +
          '<div class="kone-title">AI Hot Dealer</div>' +
          '<div class="kone-status"><span class="kone-dot"></span>online</div>' +
        '</div>' +
        '<button id="kone-close" type="button" title="Close" aria-label="Close">×</button>' +
      '</div>' +
      '<div id="kone-msgs" role="log" aria-live="polite">' +
        '<div id="kone-land" class="kone-msg-text">' + DEFAULT_GREETING + '</div>' +
      '</div>' +
      '<div id="kone-input-area">' +
        '<div class="kone-pill-wrap">' +
          '<input id="kone-popup-inp" class="kone-input" placeholder="Ask follow-up" maxlength="512" />' +
          '<button id="kone-popup-send" class="kone-send" title="Go">' +
            '<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>';
  };

  KoneWidget.prototype._openPopup = function () {
    if (this._isOpen) return;
    this._isOpen = true;
    this._setExpandedView(true);
    notifyParent('open');
    this._expandCreative();
    this._popup.className = 'kone-open';
    this._popup.setAttribute('aria-hidden', 'false');
    var self = this;
    global.setTimeout(function () { self._popupInp.focus(); }, 0);
  };

  KoneWidget.prototype._closePopup = function () {
    this._isOpen = false;
    this._popup.className = '';
    this._popup.setAttribute('aria-hidden', 'true');
    this._collapseCreative();
    notifyParent('close');
    this._setExpandedView(false);
  };

  KoneWidget.prototype._setExpandedView = function (isExpanded) {
    var method = isExpanded ? 'add' : 'remove';
    if (document.documentElement.classList) {
      document.documentElement.classList[method]('kone-expanded');
    }
    if (this._root && this._root.classList) {
      this._root.classList[method]('kone-expanded');
    }
  };

  KoneWidget.prototype._expandCreative = function () {
    var ext = getSafeFrameExt();
    if (!ext || typeof ext.expand !== 'function') return;

    try {
      if (typeof ext.supports === 'function' && !ext.supports('exp-ovr') && !ext.supports('exp-push')) return;

      var geom = typeof ext.geom === 'function' ? ext.geom() : null;
      var win = getGeomSize(geom, 'win');
      var self = getGeomRect(geom, 'self');
      var targetW = win.w || global.innerWidth || 300;
      var targetH = win.h || global.innerHeight || 600;
      var currentW = self.w || global.innerWidth || 300;
      var currentH = self.h || global.innerHeight || 600;
      var hasPosition = hasGeomPosition(geom, 'self');
      var left = hasPosition ? self.l : Math.floor(Math.max(0, targetW - currentW) / 2);
      var top = hasPosition ? self.t : Math.floor(Math.max(0, targetH - currentH) / 2);
      var right = hasPosition ? targetW - self.l - currentW : Math.ceil(Math.max(0, targetW - currentW) / 2);
      var bottom = hasPosition ? targetH - self.t - currentH : Math.ceil(Math.max(0, targetH - currentH) / 2);

      ext.expand({
        l: Math.max(0, Math.floor(left)),
        r: Math.max(0, Math.ceil(right)),
        t: Math.max(0, Math.floor(top)),
        b: Math.max(0, Math.ceil(bottom)),
        push: false
      });
      this._isExpanded = true;
    } catch (e) {}
  };

  KoneWidget.prototype._collapseCreative = function () {
    var ext = getSafeFrameExt();
    if (!this._isExpanded || !ext || typeof ext.collapse !== 'function') return;

    try {
      ext.collapse();
      this._isExpanded = false;
    } catch (e) {}
  };

  KoneWidget.prototype._handleLauncherSend = function () {
    var text = this._launcherInp.value.trim();
    if (!text || this._isLoading) return;
    this._launcherInp.value = '';
    this._openPopup();
    this._doSend(text);
  };

  KoneWidget.prototype._handlePopupSend = function () {
    var text = this._popupInp.value.trim();
    if (!text || this._isLoading) return;
    this._popupInp.value = '';
    this._openPopup();
    this._doSend(text);
  };

  KoneWidget.prototype._doSend = async function (prompt) {
    this._isLoading = true;
    this._appendMsg('u', prompt);
    
    var typingEl = this._addTypingIndicator();

    var payload = { prompt: prompt };
    if (this._responseId) payload.response_id = this._responseId;

    try {
      var res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Request failed');
      var data = await res.json();
      
      this._removeTypingIndicator(typingEl);
      if (data.response_id) this._responseId = data.response_id;
      this._appendMsg('a', data.response || "I'm sorry, but I couldn't find special offers. Please try other products or services.");
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
    o = o.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    o = o.replace(/\n/g, '<br>');
    return o;
  }

  return { create: function(opt) { return new KoneWidget(opt).init(); } };
}));
