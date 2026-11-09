import { pair } from './learningContent.js';

// Licensed illustrative stock photography, not photographs of INVESG clients or staff.
// Files are hosted locally. See docs/learning-photography.md for provenance and placement.
const photo = (section, name, id, sourceSlug, photographer, en, idAlt, position = '50% 50%') => ({
  src: `/assets/learning/${section}/${name}-1280.webp`,
  srcSet: `/assets/learning/${section}/${name}-640.webp 640w, /assets/learning/${section}/${name}-1280.webp 1280w`,
  width: 1280, height: ({ '7693697': 1920, '24705694': 720, '33853877': 720, '30824856': 1738, '9708018': 850, '7652252': 1920, '7777672': 854 })[id] || 853, position,
  alt: pair(en, idAlt), photographer, pexelsId: id,
  source: `https://www.pexels.com/photo/${sourceSlug}-${id}/`,
  license: 'https://www.pexels.com/license/',
  licenseChecked: '2026-10-28',
});

export const learningImages = {
  academyWorkshop: photo('academy', 'workshop', '5324977', 'coworkers-discussing-project-during-meeting-in-office', 'Anna Shvets', 'A facilitator works through a flipchart with a small group of colleagues in a naturally lit room.', 'Fasilitator membahas bagan di papan bersama sekelompok rekan dalam ruangan bercahaya alami.', '65% 45%'),
  academyFacilitation: photo('academy', 'facilitation', '7156118', 'a-woman-discussing-in-front', 'Gustavo Fring', 'A facilitator explains ideas on a flipchart in a bright workspace.', 'Fasilitator menjelaskan gagasan pada papan dalam ruang kerja yang terang.', '55% 45%'),
  academyScenario: photo('academy', 'scenario', '7710049', 'photo-of-a-woman-pointing-at-a-whiteboard-with-sticky-notes', 'Alena Darmel', 'Participants discuss ideas around a whiteboard with sticky notes and notebooks.', 'Peserta membahas gagasan di sekitar papan dengan catatan tempel dan buku catatan.', '52% 55%'),
  academyInstitutional: photo('academy', 'institutional', '10375899', 'man-and-two-women-sitting-at-table-at-office', 'RDNE Stock project', 'Three professionals discuss documents and a laptop around a meeting table.', 'Tiga profesional membahas dokumen dan laptop di meja pertemuan.', '62% 48%'),
  academyAnalysis: photo('academy', 'analysis', '7693697', 'woman-pointing-on-laptop-screen', 'Yan Krukau', 'Colleagues compare charts and information on a laptop during a working discussion.', 'Rekan kerja membandingkan grafik dan informasi pada laptop dalam diskusi kerja.', '50% 70%'),
  academyClimate: photo('academy', 'climate-risk', '24705694', 'aerial-view-of-a-flooded-city-street', 'Radoslaw Sikorski', 'Aerial view of an urban intersection and emergency response after flooding.', 'Tampak udara persimpangan kota dan penanganan darurat setelah banjir.', '50% 55%'),
  academyReporting: photo('academy', 'reporting', '7691715', 'men-and-woman-hands-on-table-with-papers-and-charts', 'Yan Krukau', 'Hands review printed charts and data beside digital devices on a worktable.', 'Tangan meninjau grafik cetak dan data di samping perangkat digital di meja kerja.'),
  academyWater: photo('academy', 'water', '33853877', 'scenic-reservoir-and-dam-surrounded-by-lush-hills', 'York Peuckert', 'A reservoir and curved dam illustrate the connection between water infrastructure and its watershed.', 'Waduk dan bendungan melengkung menggambarkan hubungan infrastruktur air dan daerah tangkapannya.', '50% 60%'),
  academyEnvironment: photo('academy', 'environment', '30824856', 'hydrology-fieldwork-in-leningrad-oblast-swamp', 'Alexey K.', 'Researchers collect hydrology measurements during fieldwork in a wetland.', 'Peneliti mengumpulkan pengukuran hidrologi saat kerja lapangan di lahan basah.'),
  academyFinance: photo('academy', 'finance', '4254161', 'electricians-inspecting-the-solar-panels', 'Gustavo Fring', 'A technician and an inspector review a solar installation with project documents.', 'Teknisi dan pemeriksa meninjau instalasi surya beserta dokumen proyek.'),
  academySystems: photo('academy', 'systems', '9708018', 'aerial-photography-of-a-river-in-the-middle-of-the-forest', 'Tom Fisk', 'A winding river crosses a forested landscape, showing connected land and water systems.', 'Sungai berkelok melintasi hutan, memperlihatkan keterhubungan sistem daratan dan air.'),
  academyEvaluation: photo('academy', 'evaluation', '7876672', 'three-men-discussing-a-finance-report', 'Kaboompics', 'A small team compares printed reports and charts during a review meeting.', 'Tim kecil membandingkan laporan cetak dan grafik dalam pertemuan evaluasi.'),
  joinPeople: photo('join', 'people', '6457572', 'multiethnic-students-using-laptop-while-studying', 'Alexander Suhorucov', 'Four young adults gather around a laptop in a bright, informal workspace.', 'Empat dewasa muda berkumpul di sekitar laptop dalam ruang kerja informal yang terang.', '52% 45%'),
  joinCareers: photo('join', 'careers', '7652252', 'young-coworkers-sitting-and-planning-in-front-of-a-laptop', 'Thirdman', 'Two colleagues exchange ideas while planning work on a laptop.', 'Dua rekan bertukar gagasan saat merencanakan pekerjaan dengan laptop.', '50% 30%'),
  joinCollaboration: photo('join', 'team', '9432945', 'desk-laptop-working-men', 'Monstera Production', 'A group discusses a laptop and printed charts together around a table.', 'Sekelompok orang membahas laptop dan grafik cetak bersama di sekitar meja.', '50% 48%'),
  joinLab: photo('join', 'lab', '7777672', 'people-using-laptop', 'Mikhail Nilov', 'Two young adults work with laptops, books, and notes at a shared study table.', 'Dua dewasa muda bekerja dengan laptop, buku, dan catatan di meja belajar bersama.', '50% 45%'),
  joinResearch: photo('join', 'research', '8199246', 'person-in-blue-sweater-using-a-laptop', 'Yan Krukau', 'A researcher works on a laptop beside open books and written notes.', 'Peneliti bekerja dengan laptop di samping buku terbuka dan catatan tertulis.'),
  joinWriting: photo('join', 'writing', '6084124', 'muslim-female-student-writing-notes-in-notebook-while-using-laptop', 'Keira Burton', 'A young adult writes research notes beside a laptop in natural light.', 'Dewasa muda menulis catatan riset di samping laptop dalam cahaya alami.', '50% 55%'),
};

export const programPhotoKeys = {
  'esg-as-a-lens': 'academyAnalysis',
  'esg-for-decision-makers': 'academyInstitutional',
  'sustainability-strategy': 'academyScenario',
  'climate-risk-resilience': 'academyClimate',
  'sustainability-reporting': 'academyReporting',
  'water-security': 'academyWater',
  'environmental-management': 'academyEnvironment',
  'climate-finance': 'academyFinance',
  'systems-thinking': 'academySystems',
  'monitoring-evaluation-learning': 'academyEvaluation',
};
