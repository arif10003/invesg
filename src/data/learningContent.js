// Paired resources keep the new sections ready for locale routing without changing existing URLs.
export const pair = (en, id) => ({ en, id });
export const ui = {
  academy: pair('invesg Academy', 'invesg Academy'), join: pair('Join Us', 'Bergabung'),
  programs: pair('Our Learning Programs', 'Program Pembelajaran Kami'),
  proposal: pair('Request a Training Proposal', 'Minta Proposal Pelatihan'),
  explore: pair('Explore Programs', 'Jelajahi Program'), all: pair('View All Programs', 'Lihat Semua Program'),
  inquire: pair('Inquire About This Program', 'Tanyakan Program Ini'),
  conversation: pair('Start a Conversation', 'Mulai Percakapan'),
  learn: pair('Learn More', 'Pelajari Lebih Lanjut'), overview: pair('Program Overview', 'Gambaran Program'),
  audience: pair('Who This Program Is For', 'Untuk Siapa Program Ini'), outcomes: pair('Key Learning Outcomes', 'Tujuan Pembelajaran Utama'),
  topics: pair('Indicative Topics', 'Topik Indikatif'), delivery: pair('Learning Format & Delivery', 'Format & Pelaksanaan Pembelajaran'),
  related: pair('Related Programs', 'Program Terkait'),
  indicative: pair('Indicative offering · Available for inquiry', 'Penawaran indikatif · Dapat ditanyakan'),
  tailored: pair('To be tailored to organizational needs.', 'Disesuaikan dengan kebutuhan organisasi.'),
  catalogNote: pair('These are indicative learning offerings, not scheduled public classes. Content, duration, delivery, and availability are discussed during inquiry.', 'Program ini merupakan penawaran pembelajaran indikatif, bukan kelas publik terjadwal. Konten, durasi, pelaksanaan, dan ketersediaan dibahas saat konsultasi.'),
  search: pair('Search programs, topics, or audiences', 'Cari program, topik, atau peserta'),
  allCategories: pair('All Programs', 'Semua Program'),
  noResults: pair('No programs match your search.', 'Tidak ada program yang sesuai pencarian Anda.'),
  reset: pair('Clear search and filters', 'Hapus pencarian dan filter'),
  results: pair('programs found', 'program ditemukan'),
  back: pair('Back to Programs', 'Kembali ke Program'),
  approach: pair('Our Learning Approach', 'Pendekatan Pembelajaran Kami'),
  corporate: pair('Corporate & Institutional Training', 'Pelatihan Korporasi & Institusi'),
  lab: pair('invesg Learning Lab', 'invesg Learning Lab'),
  research: pair('Research & Editorial Learning Program', 'Program Pembelajaran Riset & Editorial'),
  exploreLab: pair('Explore Learning Lab', 'Jelajahi Learning Lab'),
  exploreProgram: pair('Explore the Program', 'Jelajahi Program'),
  application: pair('View Application Status', 'Lihat Status Pendaftaran'),
  contact: pair('Contact INVESG', 'Hubungi INVESG'),
  signature: pair('Beyond Compliance. Understanding Uncertainty. Creating Sustainable Value.', 'Melampaui Kepatuhan. Memahami Ketidakpastian. Menciptakan Nilai Berkelanjutan.'),
};

export const categories = [
  { id: 'professional', title: pair('Professional Training', 'Pelatihan Profesional'), text: pair('Practical learning for real-world sustainability challenges.', 'Pembelajaran praktis untuk tantangan keberlanjutan nyata.'), icon: 'book' },
  { id: 'institutional', title: pair('Institutional Capacity Building', 'Pengembangan Kapasitas Institusi'), text: pair('Contextual programs for organizations and institutions.', 'Program sesuai konteks untuk organisasi dan institusi.'), icon: 'building' },
  { id: 'workshop', title: pair('Applied Workshops', 'Lokakarya Terapan'), text: pair('Interactive, case-based, and action-oriented experiences.', 'Pengalaman interaktif berbasis kasus dan berorientasi tindakan.'), icon: 'users' },
  { id: 'executive', title: pair('Executive & Strategic Learning', 'Pembelajaran Eksekutif & Strategis'), text: pair('Leadership perspectives for long-term sustainable value.', 'Perspektif kepemimpinan untuk nilai berkelanjutan jangka panjang.'), icon: 'leaf' },
];

export const audiences = [
  pair('Companies and corporate sustainability teams', 'Perusahaan dan tim keberlanjutan korporasi'),
  pair('Executives and decision-makers', 'Eksekutif dan pengambil keputusan'),
  pair('Government institutions and local governments', 'Institusi pemerintah dan pemerintah daerah'),
  pair('NGOs and civil society organizations', 'LSM dan organisasi masyarakat sipil'),
  pair('Development agencies and international organizations', 'Lembaga pembangunan dan organisasi internasional'),
  pair('Individual professionals', 'Profesional individu'),
];

export const methodology = [
  { title: pair('Understand the Context', 'Pahami Konteks'), text: pair('Begin with your questions, organizational needs, and the decisions that matter.', 'Mulai dari pertanyaan, kebutuhan organisasi, dan keputusan yang penting bagi Anda.'), icon: 'search' },
  { title: pair('Connect Knowledge', 'Hubungkan Pengetahuan'), text: pair('Connect evidence across environmental, social, governance, and economic perspectives.', 'Hubungkan bukti dari perspektif lingkungan, sosial, tata kelola, dan ekonomi.'), icon: 'network' },
  { title: pair('Engage and Apply', 'Terlibat dan Terapkan'), text: pair('Explore real-world cases, uncertainty, and trade-offs through practical exercises.', 'Jelajahi kasus nyata, ketidakpastian, dan pilihan sulit melalui latihan praktis.'), icon: 'book' },
  { title: pair('Reflect and Develop', 'Refleksikan dan Kembangkan'), text: pair('Review learning and discuss how insights can inform action in your context.', 'Tinjau pembelajaran dan bahas bagaimana wawasan mendukung tindakan sesuai konteks Anda.'), icon: 'leaf' },
];

export const principles = [
  { title: pair('Evidence-Based Learning', 'Pembelajaran Berbasis Bukti'), text: pair('Evaluate credible sources, distinguish evidence from assumptions, and acknowledge the limits of what is known.', 'Evaluasi sumber tepercaya, bedakan bukti dari asumsi, dan akui keterbatasan pengetahuan.'), icon: 'search' },
  { title: pair('Systems Thinking', 'Pemikiran Sistem'), text: pair('Trace connections and feedback across people, nature, organizations, and the economy.', 'Telusuri hubungan dan umpan balik antara manusia, alam, organisasi, dan ekonomi.'), icon: 'network' },
  { title: pair('Contextual Relevance', 'Relevansi Kontekstual'), text: pair('Relate ideas to the sector, priorities, and constraints of the people learning.', 'Hubungkan gagasan dengan sektor, prioritas, dan keterbatasan peserta.'), icon: 'building' },
  { title: pair('Interactive Learning', 'Pembelajaran Interaktif'), text: pair('Make space for questions, dialogue, different perspectives, and collaborative exploration.', 'Sediakan ruang untuk pertanyaan, dialog, perspektif beragam, dan eksplorasi bersama.'), icon: 'users' },
  { title: pair('Real-World Applications', 'Penerapan di Dunia Nyata'), text: pair('Use cases and decision exercises to connect knowledge with practical choices under uncertainty.', 'Gunakan kasus dan latihan keputusan untuk menghubungkan pengetahuan dengan pilihan praktis dalam ketidakpastian.'), icon: 'book' },
  { title: pair('Reflection and Application', 'Refleksi dan Penerapan'), text: pair('Consider what changed in your understanding and identify realistic next steps.', 'Pertimbangkan perubahan pemahaman Anda dan tentukan langkah berikutnya yang realistis.'), icon: 'leaf' },
];

export const pageContent = {
  academy: {
    title: pair('Building Capabilities for Sustainable Value.', 'Membangun Kapabilitas untuk Nilai Berkelanjutan.'),
    description: pair('Professional training and institutional capacity building that translate sustainability knowledge into practical capabilities, better decisions, and organizational action.', 'Pelatihan profesional dan pengembangan kapasitas institusi yang menerjemahkan pengetahuan keberlanjutan menjadi kapabilitas praktis, keputusan lebih baik, dan tindakan organisasi.'),
    why: pair('From Knowledge to Better Decisions.', 'Dari Pengetahuan Menuju Keputusan yang Lebih Baik.'),
    whyText: pair('We help individuals and organizations develop the knowledge, skills, and perspectives needed to navigate a complex and interconnected world, and create sustainable value.', 'Kami membantu individu dan organisasi mengembangkan pengetahuan, keterampilan, dan perspektif untuk menavigasi dunia yang kompleks dan saling terhubung serta menciptakan nilai berkelanjutan.'),
    featured: pair('Develop Practical Skills for a Changing World.', 'Kembangkan Keterampilan Praktis untuk Dunia yang Berubah.'),
    tailoredTitle: pair('Tailored Learning for Real Impact.', 'Pembelajaran yang Disesuaikan untuk Dampak Nyata.'),
    tailoredText: pair('Explore customized training for companies, government institutions, and other organizations, shaped around your context, priorities, and goals.', 'Jelajahi pelatihan khusus untuk perusahaan, institusi pemerintah, dan organisasi lainnya, sesuai konteks, prioritas, dan tujuan Anda.'),
    final: pair('Let’s Design a Learning Experience for Your Organization.', 'Mari Rancang Pengalaman Pembelajaran untuk Organisasi Anda.'),
  },
  catalog: { title: ui.programs, description: pair('Practical, relevant, and future-oriented learning for individuals and organizations.', 'Pembelajaran praktis, relevan, dan berorientasi masa depan untuk individu dan organisasi.') },
  corporate: {
    title: ui.corporate,
    description: pair('Customized learning programs designed to build capabilities, strengthen decision-making, and support organizational sustainability goals.', 'Program pembelajaran khusus untuk membangun kapabilitas, memperkuat pengambilan keputusan, dan mendukung tujuan keberlanjutan organisasi.'),
    why: pair('Designed for Your Organization’s Needs.', 'Dirancang untuk Kebutuhan Organisasi Anda.'),
    whyText: pair('Different organizations face different decisions. Capacity building is more useful when it reflects your sector, people, and practical constraints. We work with your team to define the learning need before proposing a program.', 'Setiap organisasi menghadapi keputusan berbeda. Pengembangan kapasitas lebih bermanfaat jika mencerminkan sektor, sumber daya manusia, dan kendala praktis Anda. Kami bekerja dengan tim Anda untuk menentukan kebutuhan pembelajaran sebelum mengusulkan program.'),
    focus: pair('Potential Training Focus Areas', 'Potensi Area Fokus Pelatihan'),
    process: pair('A Collaborative Design Process', 'Proses Perancangan Kolaboratif'),
    processSteps: [
      pair('Understand organizational needs', 'Pahami kebutuhan organisasi'), pair('Co-design learning objectives and content', 'Rancang tujuan dan konten pembelajaran bersama'), pair('Deliver practical learning experiences', 'Laksanakan pengalaman pembelajaran praktis'), pair('Support reflection and application', 'Dukung refleksi dan penerapan'),
    ],
    formats: pair('Flexible Formats. Relevant Learning.', 'Format Fleksibel. Pembelajaran Relevan.'),
    formatsText: pair('Workshops, facilitated discussions, case exercises, or a tailored learning series may be considered. In-person, online, or blended delivery, duration, and follow-up support are agreed during scoping, subject to availability.', 'Lokakarya, diskusi terfasilitasi, latihan kasus, atau rangkaian pembelajaran khusus dapat dipertimbangkan. Pelaksanaan tatap muka, daring, atau campuran, durasi, dan dukungan lanjutan disepakati saat penentuan lingkup, sesuai ketersediaan.'),
    capabilities: pair('Capabilities We Aim to Support', 'Kapabilitas yang Ingin Kami Dukung'),
    capabilityItems: [pair('A shared understanding of sustainability priorities', 'Pemahaman bersama tentang prioritas keberlanjutan'), pair('Stronger assessment of connected risks and opportunities', 'Penilaian lebih kuat atas risiko dan peluang yang saling terhubung'), pair('More informed dialogue across functions', 'Dialog lebih terinformasi lintas fungsi'), pair('Practical approaches to applying learning at work', 'Pendekatan praktis untuk menerapkan pembelajaran di tempat kerja')],
  },
  approach: { title: pair('Our Approach to Learning', 'Pendekatan Kami terhadap Pembelajaran'), description: pair('Practical. Connected. Action-Oriented.', 'Praktis. Terhubung. Berorientasi Tindakan.'), intro: pair('Learning Experience Designed for Real Impact.', 'Pengalaman Pembelajaran untuk Dampak Nyata.'), text: pair('Knowledge becomes useful when it helps people see the bigger picture and make thoughtful choices. We connect current evidence with systems thinking, explore uncertainty and trade-offs, and use dialogue and practical exercises to strengthen decision-making. ESG is a lens for understanding those connections.', 'Pengetahuan menjadi bermanfaat ketika membantu orang melihat gambaran besar dan membuat pilihan bijaksana. Kami menghubungkan bukti terkini dengan pemikiran sistem, mengeksplorasi ketidakpastian dan pilihan sulit, serta menggunakan dialog dan latihan praktis untuk memperkuat pengambilan keputusan. ESG merupakan lensa untuk memahami hubungan tersebut.') },
  join: {
    title: pair('Different Perspectives. A Shared Purpose.', 'Perspektif Beragam. Tujuan Bersama.'),
    description: pair('Explore opportunities to grow, contribute, and make an impact with invesg through careers, learning, collaboration, and our Learning Lab.', 'Jelajahi peluang untuk berkembang, berkontribusi, dan menciptakan dampak bersama invesg melalui karier, pembelajaran, kolaborasi, dan Learning Lab kami.'),
    intro: pair('Ideas, People, and Possibilities.', 'Gagasan, Manusia, dan Kemungkinan.'),
    text: pair('We value curiosity, integrity, collaboration, and a systems perspective. Whether you are an emerging talent, a professional, or an organization, there are different ways to get involved.', 'Kami menghargai rasa ingin tahu, integritas, kolaborasi, dan perspektif sistem. Baik Anda talenta baru, profesional, maupun organisasi, ada beragam cara untuk terlibat.'),
    growth: pair('Learn Together. Contribute Thoughtfully.', 'Belajar Bersama. Berkontribusi dengan Bijaksana.'),
    growthText: pair('Our work connects research, dialogue, and practical questions. We welcome different perspectives and encourage reflective learning. Explore the Learning Lab for mentored experience, or start a conversation about a shared knowledge initiative.', 'Pekerjaan kami menghubungkan riset, dialog, dan pertanyaan praktis. Kami menyambut perspektif beragam dan mendorong pembelajaran reflektif. Jelajahi Learning Lab untuk pengalaman dengan bimbingan, atau mulai percakapan tentang inisiatif pengetahuan bersama.'),
  },
  careers: {
    title: pair('Meaningful Work for a More Sustainable World.', 'Pekerjaan Bermakna untuk Dunia yang Lebih Berkelanjutan.'),
    description: pair('Connect knowledge, people, and action to address complex sustainability challenges.', 'Hubungkan pengetahuan, manusia, dan tindakan untuk menjawab tantangan keberlanjutan yang kompleks.'),
    values: pair('How We Work', 'Cara Kami Bekerja'), openings: pair('Current Opportunities', 'Peluang Saat Ini'),
    empty: pair('No open positions at the moment.', 'Belum ada posisi yang dibuka saat ini.'),
    emptyText: pair('Future opportunities will be listed here when confirmed. You can contact us with a general careers inquiry; this is not an active application process.', 'Peluang mendatang akan ditampilkan di sini setelah dikonfirmasi. Anda dapat menghubungi kami untuk pertanyaan umum tentang karier; ini bukan proses lamaran aktif.'),
  },
  collaboration: {
    title: pair('Stronger Perspectives Through Collaboration.', 'Perspektif Lebih Kuat Melalui Kolaborasi.'),
    description: pair('We work with diverse people and organizations to generate knowledge, explore solutions, and create greater impact.', 'Kami bekerja dengan beragam individu dan organisasi untuk menghasilkan pengetahuan, mengeksplorasi solusi, dan menciptakan dampak lebih besar.'),
    ways: pair('Ways to Collaborate', 'Cara Berkolaborasi'),
    intro: pair('Different Expertise. Shared Impact.', 'Keahlian Beragam. Dampak Bersama.'),
    text: pair('We welcome conversations with researchers, universities, professionals, NGOs, development organizations, and institutional partners. Share your question, the context, and what you would like to explore together.', 'Kami menyambut percakapan dengan peneliti, universitas, profesional, LSM, organisasi pembangunan, dan mitra institusi. Sampaikan pertanyaan, konteks, dan hal yang ingin Anda jelajahi bersama.'),
  },
  lab: {
    title: pair('Explore. Connect. Learn by Doing.', 'Jelajahi. Hubungkan. Belajar dengan Melakukan.'),
    description: pair('A mentorship-based learning space where emerging talents explore interconnected challenges, practice research and analytical writing, and develop their own perspectives and portfolios.', 'Ruang pembelajaran berbasis pendampingan bagi talenta baru untuk mengeksplorasi tantangan yang saling terhubung, berlatih riset dan penulisan analitis, serta mengembangkan perspektif dan portofolio mereka.'),
    intro: pair('A Space to Explore Your Perspective.', 'Ruang untuk Mengeksplorasi Perspektif Anda.'),
    text: pair('invesg Learning Lab is an experiential learning pathway within Join Us. Working through real questions helps participants connect ideas, test assumptions, and develop their judgment with feedback. Learning takes priority over content production. This is not a commercial Academy course, a guaranteed paid internship, an academic qualification, or a professional certification.', 'invesg Learning Lab merupakan jalur pembelajaran berbasis pengalaman di bagian Bergabung. Mengerjakan pertanyaan nyata membantu peserta menghubungkan gagasan, menguji asumsi, dan mengembangkan penilaian melalui umpan balik. Pembelajaran diutamakan di atas produksi konten. Program ini bukan kursus komersial Academy, jaminan magang berbayar, kualifikasi akademik, atau sertifikasi profesional.'),
    featured: pair('Learn Through Research and Writing.', 'Belajar Melalui Riset dan Penulisan.'),
    eligible: pair('For Emerging Talents, From Diverse Backgrounds.', 'Untuk Talenta Baru dari Beragam Latar Belakang.'),
  },
  research: {
    title: ui.research,
    description: pair('Develop research, analytical thinking, evidence-based writing, and editorial communication skills through supervised learning activities.', 'Kembangkan keterampilan riset, pemikiran analitis, penulisan berbasis bukti, dan komunikasi editorial melalui aktivitas pembelajaran dengan bimbingan.'),
    overview: pair('An Output-Based Learning Experience', 'Pengalaman Pembelajaran Berbasis Karya'),
    text: pair('Explore real-world sustainability, policy, and related questions through individual and collaborative research. A flexible, fully remote schedule supports output-based learning without a daily attendance requirement. Participants receive editorial mentoring and feedback as they develop their own perspectives.', 'Jelajahi pertanyaan keberlanjutan, kebijakan, dan isu terkait melalui riset individu dan kolaboratif. Jadwal fleksibel dan sepenuhnya daring mendukung pembelajaran berbasis karya tanpa kewajiban kehadiran harian. Peserta menerima pendampingan editorial dan umpan balik sambil mengembangkan perspektif mereka sendiri.'),
    structure: pair('Your Three-Month Learning Journey', 'Perjalanan Pembelajaran Tiga Bulan Anda'),
    outputs: pair('Six Individual Briefs. One Collaborative Article.', 'Enam Brief Individu. Satu Artikel Kolaboratif.'),
    outputsText: pair('Planned learning outputs per cohort include six individual INVESG Briefs and one collaborative article, with associated Instagram and LinkedIn content concepts. These are learning outputs, not guaranteed published articles.', 'Rencana karya pembelajaran per angkatan mencakup enam INVESG Brief individu dan satu artikel kolaboratif, beserta konsep konten Instagram dan LinkedIn. Ini merupakan karya pembelajaran, bukan jaminan artikel akan diterbitkan.'),
    editorial: pair('Mentorship, Authorship, and Publication', 'Pendampingan, Kepengarangan, dan Publikasi'),
    editorialText: pair('Mentoring supports source evaluation, research questions, evidence-based argument, accurate attribution, and editorial standards. Feedback and revision help participants develop portfolio work and reflect on their learning. Authorship recognition will reflect contributions and agreed program terms. Publication on INVESG Insights requires editorial approval and participant consent; participation does not guarantee publication.', 'Pendampingan mendukung evaluasi sumber, pertanyaan riset, argumen berbasis bukti, atribusi akurat, dan standar editorial. Umpan balik dan revisi membantu peserta mengembangkan portofolio dan merefleksikan pembelajaran. Pengakuan kepengarangan mencerminkan kontribusi serta ketentuan program yang disepakati. Publikasi di INVESG Insights memerlukan persetujuan editorial dan peserta; keikutsertaan tidak menjamin publikasi.'),
    terms: pair('Before recruitment, program terms, participant rights, compensation arrangements where applicable, and legal classification must be finalized. Participants are learners and must not substitute for paid operational staff.', 'Sebelum rekrutmen, ketentuan program, hak peserta, pengaturan kompensasi jika berlaku, dan klasifikasi hukum harus difinalisasi. Peserta adalah pembelajar dan tidak boleh menggantikan staf operasional berbayar.'),
    process: pair('Application Process', 'Proses Pendaftaran'),
    processText: pair('Check the application status page for announcements. When recruitment opens, confirmed requirements, selection steps, program terms, and a verified application destination will be provided before applications are accepted.', 'Periksa halaman status pendaftaran untuk pengumuman. Saat rekrutmen dibuka, persyaratan terkonfirmasi, tahapan seleksi, ketentuan program, dan tujuan pendaftaran terverifikasi akan tersedia sebelum pendaftaran diterima.'),
  },
};

export const values = [
  { title: pair('Curiosity', 'Rasa Ingin Tahu'), text: pair('Ask thoughtful questions and remain open to new evidence.', 'Ajukan pertanyaan bijaksana dan terbuka terhadap bukti baru.'), icon: 'search' },
  { title: pair('Integrity', 'Integritas'), text: pair('Work carefully, acknowledge uncertainty, and credit contributions.', 'Bekerja dengan cermat, akui ketidakpastian, dan hargai kontribusi.'), icon: 'book' },
  { title: pair('Collaboration', 'Kolaborasi'), text: pair('Listen across disciplines and connect different perspectives.', 'Dengarkan lintas disiplin dan hubungkan perspektif yang berbeda.'), icon: 'users' },
  { title: pair('Systems Perspective', 'Perspektif Sistem'), text: pair('Consider relationships, consequences, and the wider context.', 'Pertimbangkan hubungan, konsekuensi, dan konteks yang lebih luas.'), icon: 'network' },
];

export const pathways = [
  { title: pair('invesg Learning Lab', 'invesg Learning Lab'), text: pair('Experiential learning, research mentoring, and portfolio development for emerging talents.', 'Pembelajaran berbasis pengalaman, pendampingan riset, dan pengembangan portofolio bagi talenta baru.'), cta: ui.exploreLab, href: '/join-us/learning-lab', icon: 'book', image: 'joinLab' },
  { title: pair('Collaborate With Us', 'Berkolaborasi dengan Kami'), text: pair('Explore collaboration with independent experts, researchers, consultants, and institutional collaborators.', 'Jelajahi kolaborasi dengan pakar independen, peneliti, konsultan, dan kolaborator institusi.'), cta: pair('Explore Collaboration', 'Jelajahi Kolaborasi'), href: '/join-us/collaboration', icon: 'network', image: 'joinCollaboration' },
  { title: pair('Career Opportunities', 'Peluang Karier'), text: pair('Explore professional employment opportunities within the invesg team.', 'Jelajahi peluang kerja profesional di tim invesg.'), cta: pair('View Opportunities', 'Lihat Peluang'), href: '/join-us/careers', icon: 'users', image: 'joinCareers' },
];

export const collaborationWays = [
  { title: pair('Research Collaboration', 'Kolaborasi Riset'), text: pair('Explore shared questions, knowledge generation, and potential publications.', 'Jelajahi pertanyaan bersama, pengembangan pengetahuan, dan potensi publikasi.'), icon: 'book' },
  { title: pair('Projects and Initiatives', 'Proyek dan Inisiatif'), text: pair('Discuss thematic projects and initiatives around interconnected challenges.', 'Bahas proyek tematik dan inisiatif seputar tantangan yang saling terhubung.'), icon: 'users' },
  { title: pair('Knowledge Exchange', 'Pertukaran Pengetahuan'), text: pair('Share expertise, insights, and learning experiences across disciplines.', 'Bagikan keahlian, wawasan, dan pengalaman pembelajaran lintas disiplin.'), icon: 'network' },
];

export const labFeatures = [
  { title: pair('Research & Analytical Writing', 'Riset & Penulisan Analitis'), text: pair('Frame questions, examine evidence, and build clear arguments.', 'Rumuskan pertanyaan, kaji bukti, dan bangun argumen yang jelas.'), icon: 'search' },
  { title: pair('Editorial Mentorship', 'Pendampingan Editorial'), text: pair('Learn through guidance, constructive feedback, and revision.', 'Belajar melalui bimbingan, umpan balik konstruktif, dan revisi.'), icon: 'users' },
  { title: pair('Real-World Sustainability Topics', 'Topik Keberlanjutan Nyata'), text: pair('Explore connections across sustainability, policy, and society.', 'Jelajahi hubungan antara keberlanjutan, kebijakan, dan masyarakat.'), icon: 'leaf' },
  { title: pair('Portfolio Development', 'Pengembangan Portofolio'), text: pair('Develop a body of work that reflects your learning and perspective.', 'Kembangkan kumpulan karya yang mencerminkan pembelajaran dan perspektif Anda.'), icon: 'book' },
];

export const eligibility = [
  pair('Age 18 or above.', 'Berusia 18 tahun atau lebih.'),
  pair('Senior secondary or vocational school students aged 18+, university and diploma students.', 'Siswa SMA atau SMK berusia 18+, serta mahasiswa universitas dan diploma.'),
  pair('Recent graduates, gap-year learners, and other early-stage learners interested in research and analytical writing.', 'Lulusan baru, peserta gap year, dan pembelajar tahap awal lainnya yang tertarik pada riset dan penulisan analitis.'),
  pair('All educational disciplines are welcome.', 'Semua disiplin pendidikan dipersilakan.'),
];

export const journey = [
  { title: pair('Month 1 — Individual Research & Writing', 'Bulan 1 — Riset & Penulisan Individu'), text: pair('Each participant develops one INVESG Brief of approximately 400–800 words and associated Instagram and LinkedIn content concepts.', 'Setiap peserta mengembangkan satu INVESG Brief sekitar 400–800 kata beserta konsep konten Instagram dan LinkedIn.') },
  { title: pair('Month 2 — Independent Exploration', 'Bulan 2 — Eksplorasi Mandiri'), text: pair('Each participant develops a second INVESG Brief of approximately 400–800 words and associated Instagram and LinkedIn content concepts, applying feedback from the first month.', 'Setiap peserta mengembangkan INVESG Brief kedua sepanjang sekitar 400–800 kata beserta konsep konten Instagram dan LinkedIn, dengan menerapkan umpan balik bulan pertama.') },
  { title: pair('Month 3 — Collaborative Research & Writing', 'Bulan 3 — Riset & Penulisan Kolaboratif'), text: pair('The three participants collaboratively develop one research-based article and associated Instagram and LinkedIn content concepts.', 'Ketiga peserta bersama-sama mengembangkan satu artikel berbasis riset beserta konsep konten Instagram dan LinkedIn.') },
];
