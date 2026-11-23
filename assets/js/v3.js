(function () {
'use strict';
if (window.__pc3Booted) return;
window.__pc3Booted = true;
document.documentElement.classList.add('pc2-js');
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
var hd = $('[data-hd]'), mn = $('#mn3'), mb = $('.hd3-menu'), mbt = mb && $('.hd3-menu-t', mb), lastFocus = null;
var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
function menuOpen() { return !!mn && mn.classList.contains('open'); }
function setMenu(open) {
if (!mn || !mb || menuOpen() === open) return;
document.body.classList.toggle('menu-open', open);
mn.classList.toggle('open', open);
mn.setAttribute('aria-hidden', String(!open));
if (open) mn.removeAttribute('inert'); else mn.setAttribute('inert', '');
mb.setAttribute('aria-expanded', String(open));
if (mbt) mbt.textContent = open ? 'Close' : 'Menu';
document.body.style.overflow = open ? 'hidden' : '';
$$('.mn3-big a, .mn3-side > div', mn).forEach(function (a, i) { a.style.transitionDelay = open && !reduce ? (0.25 + i * 0.045) + 's' : '0s'; });
if (open) {
lastFocus = document.activeElement;
if (hd) hd.classList.remove('hd3--hide');
var first = $('.mn3-big a', mn); if (first) first.focus({ preventScroll: true });
} else if (lastFocus && lastFocus.focus) {
lastFocus.focus({ preventScroll: true });
}
}
if (mn && mb) {
mb.addEventListener('click', function () { setMenu(!menuOpen()); });
mn.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', function (e) {
if (!menuOpen()) return;
if (e.key === 'Escape') { setMenu(false); return; }
if (e.key !== 'Tab') return;
var f = [mb].concat($$(FOCUSABLE, mn).filter(function (el) { return el.offsetParent !== null; }));
var first = f[0], last = f[f.length - 1];
if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
var wide = window.matchMedia('(min-width: 1241px)');
var onWide = function (m) { if (m.matches) setMenu(false); };
if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
}
var hv = $('[data-hero-video]'), vt = $('.hero3-vt');
var saveData = navigator.connection && navigator.connection.saveData;
if (hv && !reduce && !saveData) {
$$('source[data-src]', hv).forEach(function (s) { s.src = s.getAttribute('data-src'); });
hv.load();
hv.addEventListener('playing', function () { hv.classList.add('is-playing'); }, { once: true });
var pr = hv.play(); if (pr && pr.catch) pr.catch(function () {});
if (vt) {
vt.hidden = false;
vt.addEventListener('click', function () {
var paused = !hv.paused;
if (paused) hv.pause(); else hv.play();
vt.classList.toggle('is-paused', paused);
vt.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
});
}
}
var reveal = $$('[data-anim], .rv');
if ('IntersectionObserver' in window && !reduce) {
var watch = [];
var io = new IntersectionObserver(function (es) {
var n = 0;
es.forEach(function (en) {
if (!en.isIntersecting) return;
watch.forEach(function (w) {
if (w.t !== en.target) return;
w.el.style.transitionDelay = Math.min(n++, 5) * 0.09 + 's';
w.el.classList.add('on');
setTimeout(function () { w.el.style.transitionDelay = ''; }, 1800);   // hover effects shouldn't lag later
});
io.unobserve(en.target);
});
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
reveal.forEach(function (el) {
var t = el.getAttribute('data-anim') === 'wipe' ? el.parentElement : el;
watch.push({ el: el, t: t }); io.observe(t);
});
} else { reveal.forEach(function (el) { el.classList.add('on'); }); }
function count(el) {
var to = +el.getAttribute('data-count'), from = +(el.getAttribute('data-from') || 0), t0 = null, d = 1700;
function step(ts) {
if (!t0) t0 = ts;
var k = Math.min(1, (ts - t0) / d); k = 1 - Math.pow(1 - k, 4);
el.textContent = Math.round(from + (to - from) * k);
if (k < 1) requestAnimationFrame(step);
}
requestAnimationFrame(step);
}
if ('IntersectionObserver' in window && !reduce) {
var co = new IntersectionObserver(function (es) {
es.forEach(function (en) { if (en.isIntersecting) { count(en.target); co.unobserve(en.target); } });
}, { threshold: 0.6 });
$$('[data-count]').forEach(function (el) { co.observe(el); });
}
var par = $$('[data-parallax]');
var lines = $$('[data-progress]').map(function (l) { var w = l.closest('.sp3'); return { el: l, wrap: w, steps: $$('.sp3-i', w) }; });
var fl = $('.fl3'), hero = $('.hero3, .ph3');
var flHide = $$('.ct3, .ft3, form.form');   // the pill hides wherever an estimate form, the estimate section or the footer is on screen
var lastY = window.scrollY;
function frame() {
var y = window.scrollY, vh = window.innerHeight, w = [];
if (hd) {
var solid = y > 80, hide = y > 420 && y > lastY + 2 && !menuOpen() && !hd.contains(document.activeElement);
var show = y < lastY - 2 || y <= 420;
w.push(function () { hd.classList.toggle('hd3--solid', solid); if (hide) hd.classList.add('hd3--hide'); else if (show) hd.classList.remove('hd3--hide'); });
}
if (fl) {
var past = hero ? hero.getBoundingClientRect().bottom < vh * 0.35 : y > vh;
var nearEnd = flHide.some(function (el) { var r = el.getBoundingClientRect(); return r.top < vh * 0.92 && r.bottom > 0; });
w.push(function () { fl.classList.toggle('on', past && !nearEnd && !menuOpen()); });
}
lastY = y;
if (!reduce) {
par.forEach(function (el) {
var r = el.parentElement.getBoundingClientRect();
if (r.bottom < 0 || r.top > vh) return;
var s = +el.getAttribute('data-parallax') || 0.2, t = r.top * -s;
w.push(function () { el.style.transform = 'translate3d(0,' + t.toFixed(1) + 'px,0)'; });
});
lines.forEach(function (L) {
var wr = L.wrap.getBoundingClientRect();
if (wr.bottom < -vh || wr.top > vh * 2) return;
var lp = clamp01((vh * 0.7 - wr.top) / wr.height);
var on = L.steps.map(function (s) { return s.getBoundingClientRect().top < vh * 0.72; });
w.push(function () { L.el.style.setProperty('--p', (lp * 100).toFixed(2) + '%'); L.steps.forEach(function (s, i) { s.classList.toggle('on', on[i]); }); });
});
}
for (var i = 0; i < w.length; i++) w[i]();
}
var ticking = false;
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; frame(); }); } }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
frame();
if (reduce) { $$('.sp3-i').forEach(function (s) { s.classList.add('on'); }); lines.forEach(function (L) { L.el.style.setProperty('--p', '100%'); }); }
$$('[data-slider]').forEach(function (sl) {
var tr = $('.sl-track', sl), cs = $$('.sl-card', tr), cur = $('[data-cur]', sl), bar = $('[data-bar]', sl);
var prev = $('[data-prev]', sl), next = $('[data-next]', sl);
var behavior = reduce ? 'auto' : 'smooth';
if (!tr || !cs.length) return;
function stepW() { return cs[0].getBoundingClientRect().width + 16; }
function update() {
var max = tr.scrollWidth - tr.clientWidth, p = max > 0 ? tr.scrollLeft / max : 0;
if (bar) bar.style.setProperty('--sp', (100 / cs.length + p * (100 - 100 / cs.length)) + '%');
var idx = tr.scrollLeft >= max - 2 && max > 0 ? cs.length : Math.min(cs.length, Math.round(tr.scrollLeft / stepW()) + 1);
if (cur) cur.textContent = ('0' + Math.max(1, idx)).slice(-2);
if (prev) prev.disabled = tr.scrollLeft <= 2;
if (next) next.disabled = tr.scrollLeft >= max - 2;
}
if (prev) prev.addEventListener('click', function () { tr.scrollBy({ left: -stepW(), behavior: behavior }); });
if (next) next.addEventListener('click', function () { tr.scrollBy({ left: stepW(), behavior: behavior }); });
tr.addEventListener('keydown', function (e) {
if (e.target !== tr) return;
if (e.key === 'ArrowRight') { e.preventDefault(); tr.scrollBy({ left: stepW(), behavior: behavior }); }
if (e.key === 'ArrowLeft') { e.preventDefault(); tr.scrollBy({ left: -stepW(), behavior: behavior }); }
});
tr.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', update);
update();
var down = false, sx = 0, sl0 = 0, moved = false;
tr.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl0 = tr.scrollLeft; });
window.addEventListener('pointermove', function (e) {
if (!down) return;
var dx = e.clientX - sx;
if (!moved && Math.abs(dx) > 4) { moved = true; tr.classList.add('drag'); }
if (moved) tr.scrollLeft = sl0 - dx;
});
window.addEventListener('pointerup', function () { if (!down) return; down = false; tr.classList.remove('drag'); });
tr.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
$$('img, svg', tr).forEach(function (i) { i.setAttribute('draggable', 'false'); });
});
$$('.ar3-in, .areas').forEach(function (box) {
var current = null, track = $('.sl-track', box);
function mark(city, fromList) {
if (city === current) return;
current = city;
$$('[data-city]', box).forEach(function (el) { el.classList.toggle('is-active', !!city && el.getAttribute('data-city') === city); });
if (city && fromList && track) {
var card = $('.sl-card[data-city="' + city + '"]', track);
if (card) track.scrollTo({ left: card.offsetLeft - track.firstElementChild.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
}
}
['mouseover', 'focusin'].forEach(function (ev) {
box.addEventListener(ev, function (e) {
var el = e.target.closest && e.target.closest('[data-city]');
mark(el ? el.getAttribute('data-city') : null, !!(el && el.closest('.ar3-list')));
});
});
box.addEventListener('mouseleave', function () { mark(null); });
});
$$('[data-reviews]').forEach(function (rv) {
var sl = $$('.qt3-s', rv), dots = $$('.qt3-dots button', rv), stage = $('.qt3-stage', rv), pb = $('.qt3-pause', rv);
var i = 0, timer = null, paused = reduce, hovering = false;
function go(n) {
sl[i].classList.remove('on'); sl[i].setAttribute('aria-hidden', 'true');
dots[i].classList.remove('on'); dots[i].removeAttribute('aria-current');
i = (n + sl.length) % sl.length;
sl[i].classList.add('on'); sl[i].removeAttribute('aria-hidden');
dots[i].classList.add('on'); dots[i].setAttribute('aria-current', 'true');
}
function run() {
clearInterval(timer); timer = null;
var auto = !paused && !hovering;
if (auto) timer = setInterval(function () { go(i + 1); }, 7000);
stage.setAttribute('aria-live', auto ? 'off' : 'polite');   // announce only visitor-driven changes
}
function setPaused(v) {
paused = v;
if (pb) { pb.classList.toggle('is-paused', v); pb.setAttribute('aria-label', v ? 'Play automatic review rotation' : 'Pause automatic review rotation'); }
run();
}
dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); run(); }); });
var p = $('[data-rv-prev]', rv), nx = $('[data-rv-next]', rv);
if (p) p.addEventListener('click', function () { go(i - 1); run(); });
if (nx) nx.addEventListener('click', function () { go(i + 1); run(); });
if (pb) pb.addEventListener('click', function () { setPaused(!paused); });
rv.addEventListener('mouseenter', function () { hovering = true; run(); });
rv.addEventListener('mouseleave', function () { hovering = false; run(); });
rv.addEventListener('focusin', function () { hovering = true; run(); });
rv.addEventListener('focusout', function (e) { if (!rv.contains(e.relatedTarget)) { hovering = false; run(); } });
if (sl.length < 2) $$('.qt3-ctl', rv).forEach(function (c) { c.hidden = true; });
setPaused(paused);
});
$$('.acc-q').forEach(function (q) {
q.addEventListener('click', function () {
var it = q.closest('.acc-i'), open = !it.classList.contains('open');
it.classList.toggle('open', open); q.setAttribute('aria-expanded', String(open));
});
});
var MSG = { name: 'Please enter your name.', phone: 'Please enter a phone number we can reach you on.', email: 'Please enter a valid email address, like name@example.com.' };
function fieldError(input) {
var v = input.validity;
if (v.valid) return '';
if (input.name === 'phone' && !v.valueMissing) return 'Please enter a valid phone number.';
return MSG[input.name] || 'Please fill in this field.';
}
function showError(input, msg) {
var slot = document.getElementById(input.id + '-err');
if (slot) slot.textContent = msg;
if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
}
function mailtoFrom(form) {
var d = new FormData(form), out = [];
[['Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Project type', 'service'], ['Project city', 'city'],
['Planning stage', 'stage'], ['Sent from', 'page']].forEach(function (f) { if (d.get(f[1])) out.push(f[0] + ': ' + d.get(f[1])); });
if (d.get('message')) out.push('', d.get('message'));
return 'mailto:' + form.getAttribute('data-recipients') + '?subject=' + encodeURIComponent(d.get('_subject') || 'Website inquiry') +
'&body=' + encodeURIComponent(out.join('\n'));
}
$$('form.form').forEach(function (form) {
var ok = $('.form-ok', form), err = $('.form-err', form), btn = $('button[type="submit"]', form);
var phoneLink = $('a[href^="tel:"]'), recips = (form.getAttribute('data-recipients') || '').split(',');
$$('[required]', form).forEach(function (input) {
input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) showError(input, fieldError(input)); });
input.addEventListener('blur', function () { if (input.value) showError(input, fieldError(input)); });
});
function sent(text) { form.classList.remove('has-error'); form.classList.add('sent'); ok.textContent = text; form.reset(); ok.focus(); }
function fail() {
err.innerHTML = 'Sorry, your inquiry couldn’t be sent. Please try again, call <a href="' + (phoneLink ? phoneLink.getAttribute('href') : '#') + '">' +
(phoneLink ? phoneLink.textContent.trim() : '') + '</a>, or email <a href="mailto:' + recips[0] + '">' + recips[0] + '</a>.';
form.classList.add('has-error'); err.focus();
}
form.addEventListener('submit', function (e) {
e.preventDefault();
form.classList.remove('has-error');
var firstBad = null;
$$('[required]', form).forEach(function (input) { var m = fieldError(input); showError(input, m); if (m && !firstBad) firstBad = input; });
if (firstBad) { firstBad.focus(); return; }
var hp = $('[name="_gotcha"]', form);
if (hp && hp.value) { sent('Thanks, your inquiry has been sent.'); return; }   // bot: pretend success
var ep = form.getAttribute('data-endpoint');
if (!ep) {
window.location.href = mailtoFrom(form);
sent('Your email app should open with your inquiry addressed to Connor and Rob. Press send there to finish. If nothing opened, email ' + recips.join(' and ') + '.');
return;
}
btn.disabled = true; btn.setAttribute('aria-busy', 'true');
fetch(ep, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
.then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); sent('Thanks, your inquiry has been sent. Connor or Rob will be in touch during business hours.'); })
.catch(fail)
.then(function () { btn.disabled = false; btn.removeAttribute('aria-busy'); });
});
});
var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();