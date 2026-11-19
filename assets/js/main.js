(function () {
'use strict';
var drawer = document.getElementById('drawer');
var openBtn = document.querySelector('.menu-btn');
var closeBtn = document.querySelector('.drawer-close');
var lastFocus = null;
var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
function setDrawer(open) {
if (!drawer || drawer.classList.contains('open') === open) return;
drawer.classList.toggle('open', open);
drawer.setAttribute('aria-hidden', String(!open));
if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
document.body.style.overflow = open ? 'hidden' : '';
if (open) {
lastFocus = document.activeElement;
if (closeBtn) closeBtn.focus();
} else if (lastFocus && lastFocus.focus) {
lastFocus.focus();
}
}
if (drawer) {
drawer.setAttribute('inert', '');
if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
document.addEventListener('keydown', function (e) {
if (!drawer.classList.contains('open')) return;
if (e.key === 'Escape') { setDrawer(false); return; }
if (e.key !== 'Tab') return;
var f = Array.prototype.filter.call(drawer.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null; });
if (!f.length) return;
var first = f[0], last = f[f.length - 1];
if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
window.matchMedia('(min-width: 1181px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });
}
var hv = document.querySelector('[data-hero-video]');
if (hv) {
var toggle = document.querySelector('.video-toggle');
var saveData = navigator.connection && navigator.connection.saveData;
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!saveData && !reduceMotion) {
hv.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.getAttribute('data-src'); });
hv.load();
var p = hv.play();
if (p && p.catch) p.catch(function () {});
if (toggle) {
toggle.hidden = false;
var setBtn = function (paused) {
toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
toggle.firstElementChild.className = paused ? 'vt-play' : 'vt-pause';
};
toggle.addEventListener('click', function () {
if (hv.paused) { hv.play(); setBtn(false); } else { hv.pause(); setBtn(true); }
});
}
}
}
document.querySelectorAll('.areas').forEach(function (box) {
var current = null;
function mark(city) {
if (city === current) return;
current = city;
box.querySelectorAll('[data-city]').forEach(function (el) {
el.classList.toggle('is-active', !!city && el.getAttribute('data-city') === city);
});
}
['mouseover', 'focusin'].forEach(function (ev) {
box.addEventListener(ev, function (e) {
var el = e.target.closest && e.target.closest('[data-city]');
mark(el ? el.getAttribute('data-city') : null);
});
});
box.addEventListener('mouseleave', function () { mark(null); });
box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) mark(null); });
});
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasIO = 'IntersectionObserver' in window;
if (!reduce) {
document.querySelectorAll('main h1, main h2, .intro-quote').forEach(function (h) {
var i = 0;
(function walk(node) {
Array.prototype.slice.call(node.childNodes).forEach(function (c) {
if (c.nodeType === 3) {
var parts = c.textContent.split(/(\s+)/);
var frag = document.createDocumentFragment();
parts.forEach(function (t) {
if (!t) return;
if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
var w = document.createElement('span');
w.className = 'w';
w.style.setProperty('--wi', Math.min(i++, 24));
w.textContent = t;
frag.appendChild(w);
});
node.replaceChild(frag, c);
} else if (c.nodeType === 1 && !/^(svg|br)$/i.test(c.tagName)) {
walk(c);
}
});
})(h);
h.classList.add('split-h');
});
document.querySelectorAll('.hero h1, .page-hero h1').forEach(function (h) { h.style.setProperty('--wd', '180ms'); });
document.querySelectorAll('main .photo').forEach(function (ph) {
if (!ph.closest('.hero, .page-hero, .intro-photos')) ph.classList.add('reveal');
});
document.querySelectorAll('.map').forEach(function (m) {
m.querySelectorAll('.m-link, .m-pin').forEach(function (el, i) { el.style.transitionDelay = (250 + i * 70) + 'ms'; });
});
document.querySelectorAll('#drawer nav a, #drawer .btn, #drawer .contact-mini').forEach(function (a, i) {
a.style.setProperty('--di', Math.min(i, 18));
});
}
var targets = document.querySelectorAll('.rv, .split-h, .photo.reveal');
if (hasIO && !reduce) {
var io = new IntersectionObserver(function (entries) {
var n = 0;
entries.forEach(function (en) {
if (!en.isIntersecting) return;
var el = en.target;
var staggered = el.classList.contains('rv') || el.classList.contains('reveal');
if (staggered) el.style.transitionDelay = Math.min(n++, 6) * 90 + 'ms';
el.classList.add('in');
io.unobserve(el);
setTimeout(function () {
if (staggered) el.style.transitionDelay = '';
if (el.classList.contains('map')) el.querySelectorAll('.m-link, .m-pin').forEach(function (x) { x.style.transitionDelay = ''; });
}, 2200);
});
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
targets.forEach(function (el) { io.observe(el); });
} else {
targets.forEach(function (el) { el.classList.add('in'); });
}
var header = document.querySelector('.site-header');
var lastY = window.scrollY, ticking = false;
var par = [];
if (!reduce) {
document.querySelectorAll('.section-bg img').forEach(function (el) { par.push({ el: el, box: el.closest('section'), k: 0.12, max: 80 }); });
document.querySelectorAll('.page-hero .hero-bg').forEach(function (el) { par.push({ el: el, top: true, k: 0.22, max: 80 }); });
var hpMain = document.querySelector('.hero .hp-main'), hpInset = document.querySelector('.hero .hp-inset');
if (hpMain) par.push({ el: hpMain, top: true, k: -0.06, max: 50 });
if (hpInset) par.push({ el: hpInset, top: true, k: -0.14, max: 90 });
}
var stepLists = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll('.steps'));
function clamp(v, m) { return Math.max(-m, Math.min(m, v)); }
function frame() {
ticking = false;
var y = window.scrollY, vh = window.innerHeight;
if (header) {
header.classList.toggle('is-scrolled', y > 30);
var menuOpen = document.body.style.overflow === 'hidden';
if (!reduce && y > 500 && y > lastY + 4 && !menuOpen && !header.contains(document.activeElement)) header.classList.add('is-hidden');
else if (y < lastY - 4 || y <= 500) header.classList.remove('is-hidden');
lastY = y;
}
par.forEach(function (it) {
var v;
if (it.top) {
if (y > vh * 1.5) return;
v = y * it.k;
} else {
var r = it.box.getBoundingClientRect();
if (r.bottom < -200 || r.top > vh + 200) return;
v = -(r.top + r.height / 2 - vh / 2) * it.k;
}
it.el.style.translate = '0 ' + clamp(v, it.max).toFixed(1) + 'px';
});
stepLists.forEach(function (list) {
var r = list.getBoundingClientRect();
if (r.bottom < -vh || r.top > vh * 2) return;
var line = vh * 0.6;
list.style.setProperty('--p', Math.max(0, Math.min(1, (line - r.top) / r.height)).toFixed(3));
list.querySelectorAll('.step').forEach(function (s) { s.classList.toggle('is-active', s.getBoundingClientRect().top < line); });
});
}
function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
frame();
var MSG = {
name: 'Please enter your name.',
phone: 'Please enter a phone number we can reach you on.',
email: 'Please enter a valid email address, like name@example.com.'
};
function fieldError(input) {
var v = input.validity, key = input.name;
if (v.valid) return '';
if (key === 'phone' && !v.valueMissing) return 'Please enter a valid phone number.';
return MSG[key] || 'Please fill in this field.';
}
function showError(input, msg) {
var slot = document.getElementById(input.id + '-err');
if (slot) slot.textContent = msg;
if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
}
function validate(form) {
var firstBad = null;
form.querySelectorAll('[required]').forEach(function (input) {
var msg = fieldError(input);
showError(input, msg);
if (msg && !firstBad) firstBad = input;
});
if (firstBad) firstBad.focus();
return !firstBad;
}
function mailtoFrom(form) {
var d = new FormData(form), lines = [];
[['Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Project type', 'service'], ['Project city', 'city'],
['Planning stage', 'stage'], ['Sent from', 'page']].forEach(function (f) { if (d.get(f[1])) lines.push(f[0] + ': ' + d.get(f[1])); });
if (d.get('message')) lines.push('', d.get('message'));
return 'mailto:' + form.getAttribute('data-recipients') +
'?subject=' + encodeURIComponent(d.get('_subject') || 'Website inquiry') +
'&body=' + encodeURIComponent(lines.join('\n'));
}
document.querySelectorAll('form.form').forEach(function (form) {
var ok = form.querySelector('.form-ok');
var err = form.querySelector('.form-err');
var btn = form.querySelector('button[type="submit"]');
var phoneLink = document.querySelector('a[href^="tel:"]');
var phone = phoneLink ? phoneLink.textContent.trim() : '';
var recips = (form.getAttribute('data-recipients') || '').split(',');
form.querySelectorAll('[required]').forEach(function (input) {
input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) showError(input, fieldError(input)); });
input.addEventListener('blur', function () { if (input.value) showError(input, fieldError(input)); });
});
function fail() {
err.innerHTML = 'Sorry, your inquiry couldn’t be sent. Please try again, call <a href="' +
(phoneLink ? phoneLink.getAttribute('href') : '#') + '">' + phone + '</a>, or email <a href="mailto:' +
recips[0] + '">' + recips[0] + '</a>.';
form.classList.add('has-error');
err.focus();
}
function sent(text) {
form.classList.remove('has-error');
form.classList.add('sent');
ok.textContent = text;
form.reset();
ok.focus();
}
form.addEventListener('submit', function (e) {
e.preventDefault();
form.classList.remove('has-error');
if (!validate(form)) return;
var hp = form.querySelector('[name="_gotcha"]');
if (hp && hp.value) { sent('Thanks, your inquiry has been sent.'); return; } // bot: pretend success
var endpoint = form.getAttribute('data-endpoint');
if (!endpoint) {
window.location.href = mailtoFrom(form);
sent('Your email app should open with your inquiry addressed to Connor and Rob. Press send there to finish. If nothing opened, email ' + recips.join(' and ') + '.');
return;
}
btn.disabled = true; btn.setAttribute('aria-busy', 'true');
fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
.then(function (r) {
if (!r.ok) throw new Error('HTTP ' + r.status);
sent('Thanks, your inquiry has been sent. Connor or Rob will be in touch during business hours.');
})
.catch(fail)
.then(function () { btn.disabled = false; btn.removeAttribute('aria-busy'); });
});
});
var y = document.getElementById('yr');
if (y) y.textContent = new Date().getFullYear();
})();