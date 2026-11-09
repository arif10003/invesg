import { pair } from './learningContent.js';

// Opening is not confirmed. Change status only after launch terms are approved.
export const learningLab = {
  status: 'coming-soon',
  applicationUrl: null,
  applicationEmail: 'the.invesg@gmail.com',
  applicationSubject: 'Research & Editorial Learning Program – Full Name',
};
export const labSpecifications = [
  { title: pair('3 Months', '3 Bulan'), text: pair('Program duration', 'Durasi program'), icon: 'calendar' },
  { title: pair('3 Participants', '3 Peserta'), text: pair('Per cohort', 'Per angkatan'), icon: 'users' },
  { title: pair('Fully Remote', 'Sepenuhnya Daring'), text: pair('Online learning and collaboration', 'Pembelajaran dan kolaborasi daring'), icon: 'globe' },
  { title: pair('Flexible Schedule', 'Jadwal Fleksibel'), text: pair('No daily attendance requirement', 'Tanpa kewajiban kehadiran harian'), icon: 'calendar' },
  { title: pair('Editorial Mentoring', 'Pendampingan Editorial'), text: pair('Regular online mentoring and constructive feedback', 'Pendampingan daring berkala dan umpan balik konstruktif'), icon: 'users' },
  { title: pair('Output-Based Learning', 'Pembelajaran Berbasis Karya'), text: pair('Individual and collaborative experiential learning', 'Pembelajaran berbasis pengalaman secara individu dan kolaboratif'), icon: 'book' },
];
export const applicationCopy = {
  'coming-soon': { title: pair('Applications Coming Soon', 'Pendaftaran Segera Dibuka'), text: pair('The cohort opening is not yet confirmed. Explore the program and prepare your materials; application timing and participant terms will be shared before applications are invited.', 'Pembukaan angkatan belum dikonfirmasi. Jelajahi program dan siapkan dokumen Anda; waktu pendaftaran dan ketentuan peserta akan disampaikan sebelum pendaftaran dibuka.') },
  open: { title: pair('Applications Open', 'Pendaftaran Dibuka'), text: pair('Review the confirmed cohort requirements and program terms before applying.', 'Tinjau persyaratan angkatan dan ketentuan program yang terkonfirmasi sebelum mendaftar.') },
  closed: { title: pair('Applications Closed', 'Pendaftaran Ditutup'), text: pair('Applications are not currently being accepted. Please check back for future cohort announcements.', 'Pendaftaran saat ini tidak diterima. Silakan kunjungi kembali untuk pengumuman angkatan mendatang.') },
};
export const applicationLabels = {
  apply: pair('Apply to the Program', 'Daftar ke Program'),
  unavailable: pair('The application destination has not yet been configured. Contact INVESG for confirmed information.', 'Tujuan pendaftaran belum dikonfigurasi. Hubungi INVESG untuk informasi terkonfirmasi.'),
  updates: pair('Questions About Learning Lab?', 'Pertanyaan tentang Learning Lab?'),
  updateText: pair('Ask us about the program by email, or return here for confirmed application information.', 'Tanyakan program melalui email, atau kunjungi kembali halaman ini untuk informasi pendaftaran yang terkonfirmasi.'),
};

export function getLearningLabEmail(config = learningLab, application = false) {
  const email = config.applicationEmail;
  if (typeof email !== 'string' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return null;
  const subject = application ? (config.applicationSubject || learningLab.applicationSubject) : 'Learning Lab inquiry – Full Name';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
function resolveApplicationUrl(value) {
  if (typeof value !== 'string' || value !== value.trim() || /[\\\u0000-\u0020\u007f]/.test(value)) return null;
  const origin = 'https://invesg.co';
  try {
    const url = new URL(value, origin);
    if (url.username || url.password) return null;
    if (value.startsWith('/') && !value.startsWith('//') && url.origin === origin) {
      return url.pathname + url.search + url.hash;
    }
    if (/^https:\/\//i.test(value) && url.protocol === 'https:' && url.hostname) return url.href;
  } catch { /* A malformed destination must not enable an application CTA. */ }
  return null;
}

export function getApplicationState(config = learningLab) {
  const status = Object.hasOwn(applicationCopy, config.status) ? config.status : 'coming-soon';
  const applicationUrl = resolveApplicationUrl(config.applicationUrl);
  return {
    status,
    copy: applicationCopy[status],
    applicationUrl: status === 'open' ? (applicationUrl || getLearningLabEmail(config, true)) : null,
    inquiryUrl: getLearningLabEmail(config),
    applicationEmail: getLearningLabEmail(config) ? config.applicationEmail : null,
    applicationSubject: config.applicationSubject || learningLab.applicationSubject,
  };
}
