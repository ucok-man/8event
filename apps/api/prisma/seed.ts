import { Role, TicketType } from '@prisma/client';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type TicketSeed = {
  type: TicketType;
  name: string;
  description: string;
  initialAmount: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  price: number | null;
};

type EventSeed = {
  id: string;
  name: string;
  bannerUrl: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  views?: number;
  isEventOnline: boolean;
  urlStreaming: string | null;
  placeName: string | null;
  placeCity: string | null;
  placeAddress: string | null;
  isPublished: boolean;
  organizerId: string;
  categoryId: string;
  tickets: TicketSeed[];
};

async function SEED_CATEGORY() {
  return await prisma.eventCategory.createMany({
    data: [
      { id: '151e2710-0f16-47a1-b1dc-5a894792bdc2', name: 'children_family' },
      { id: '037a46e9-67a8-4e1b-a22e-ca8280c2f187', name: 'business' },
      {
        id: 'b019bf35-c2be-408b-88e2-e57ad7dd3aa8',
        name: 'design_photo_video',
      },
      { id: '6f23afa2-a421-426d-a814-ee51502e8a37', name: 'fashion_beauty' },
      { id: 'e8906446-0c7f-44f7-9584-ed98c6b86888', name: 'film_cinema' },
      { id: '3cd5540c-d08e-415c-be60-1deef20892ac', name: 'game_esports' },
      { id: '377113c0-318d-4a2b-ab9b-2f2f2c5cab55', name: 'hobby_crafts' },
      { id: '58b059a6-0cf1-4406-9dab-5d7dbb790c58', name: 'investment_stocks' },
      {
        id: 'ed8e3534-4836-4946-ad8e-86627ecf8b95',
        name: 'career_self_development',
      },
      { id: '8d5d15ee-3b91-46b1-9b4c-aee9206db87e', name: 'religion' },
      { id: '0fda353f-1265-448e-a0fe-4827f940370a', name: 'health_fitness' },
      { id: '08a19e78-e985-415c-90e5-7bf711bb123a', name: 'finance' },
      { id: '6f9d4a6c-70d8-4d27-87e8-4c589a5b0082', name: 'environment' },
      { id: '421a51c0-f77d-4d86-9810-151c8e30d823', name: 'food_drinks' },
      { id: 'c14502f1-f690-4024-80de-6e1e540fbaed', name: 'marketing' },
      { id: '30e0d778-e66e-4250-92c2-c35ba1323eb0', name: 'music' },
      { id: '411708d2-c5ce-4b9b-8bf5-0c782cac11f8', name: 'sports' },
      { id: '83a02d08-d65a-4e2c-a43f-dd1695364bbb', name: 'automotive' },
      {
        id: 'f2177166-07ec-4169-9867-69d6ead067fb',
        name: 'science_technology',
      },
      { id: '426588c8-0ec9-4f1f-a8d0-1163a3d7cbb6', name: 'arts_culture' },
      {
        id: '5bf56ae0-74a4-4735-a7ff-a68d253cbaf1',
        name: 'social_law_politics',
      },
      { id: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', name: 'standup_comedy' },
      {
        id: '4699d695-e405-44c4-9e26-29e74e20ae65',
        name: 'education_scholarships',
      },
      { id: '09a2b96b-2292-4a93-aec6-a0c59a5cb24e', name: 'tech_startup' },
      { id: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', name: 'travel_holidays' },
      { id: '71896639-a9e4-4699-9a12-7cd139525cd9', name: 'others' },
    ],
  });
}

async function SEED_EVENTS_AND_TICKETS(organizerId: string) {
  const currentdate = new Date();

  const bulandepan = new Date(currentdate);
  bulandepan.setMonth(bulandepan.getMonth() + 1);

  const bulanDepanKurangSatuHari = new Date(bulandepan);
  bulanDepanKurangSatuHari.setDate(bulanDepanKurangSatuHari.getDate() - 1);

  const akhirBulanIni = new Date(
    currentdate.getFullYear(),
    currentdate.getMonth() + 1,
    0,
  );

  const satuHariSebelumAkhirBulanIni = new Date(akhirBulanIni);
  satuHariSebelumAkhirBulanIni.setDate(akhirBulanIni.getDate() - 1);

  const events: EventSeed[] = [
    /* ---------------------------------------------------------------- */
    /*                          FEATURED EVENTS                         */
    /* ---------------------------------------------------------------- */
    {
      id: 'a8abdbdb-4f08-4b3a-bf6b-1290d2690f07',
      name: 'Judika Special Valentine',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739473220/minpro-event-ticketing/event/banner/judika-event_fofwof.jpg',
      description: `
      <h2>VALENTINE BAPER SING ALONG</h2>
      <p>Scream your feelings from the top of your lungs! Whether your heart&rsquo;s shattered in pieces or bursting with the butterflies, there&rsquo;s no better way to sing it out than with&hellip;</p>
      <p><strong>Friday, February 14th 2025</strong><br /><em>RSVP NOW 0813-9998-8615</em></p>
      <p><strong>LOCATION:</strong><br />Basement Floor, Carstensz Mall<br />Jl. Jenderal Sudirman No.1, Cihuni, Kec. Pagedangan, Kabupaten Tangerang, Banten</p>
      <p>We&rsquo;re here to match your heart's desire with live music, DJ sets, and MC that ready to turn up the fun with you!<br />Bring your boo, crush, or situationship! everyone&rsquo;s welcome! See you very soon!&nbsp;</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '30e0d778-e66e-4250-92c2-c35ba1323eb0', // music
      isEventOnline: false,
      isPublished: true,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Banten',
      placeName: 'Dewa Sport Bar',
      urlStreaming: null,
      views: 100,
      tickets: [
        {
          type: 'PAID',
          name: 'VIP Pass',
          amount: 100,
          initialAmount: 100,
          price: 350_000,
          description: `- Tiket dapat digunakan untuk masuk ke event Judika pada tanggal yang tertera\n- FREE Heineken Beer/Whiskey Cola/Gin Tonic/Soft Drink`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'VIP Pass Low',
          amount: 100,
          initialAmount: 100,
          price: 10_000,
          description: `- Tiket dapat digunakan untuk masuk ke event Judika pada tanggal yang tertera\n- FREE Heineken Beer/Whiskey Cola/Gin Tonic/Soft Drink`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: 'b4d2b602-30f2-481f-8ba5-a4e674c5e6af',
      name: 'Hwang In Youp In Love Fan Meeting Tour',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739477596/minpro-event-ticketing/event/banner/hwang_in_youp_yhbkgp.jpg',
      description: `
      <p dir="ltr">Viu Scream Dates is an annual Viu festival event in Indonesia, bringing the Viu experience to live to our millions of Viu&rsquo;ers in Indonesia. The initial Viu Scream Dates was done in Bangkok, Thailand, in 2019 and was attended by thousands of Viu&rsquo;ers. The Viu Scream Dates 2023 will be the first Viu Scream Dates in Indonesia, where we will create the excitement by bringing the most favorite Korean, Thailand, Mandarin, &amp; Indonesian celebrities to life through music concerts, meet &amp; greets, photo signings, talk-shows, screenings, and fun games.&nbsp; &nbsp;</p>

      <p dir="ltr">Viu Scream Dates are proud to present&nbsp;<strong>Hwang In Youp In Love Fan Meeting 2025</strong>&nbsp;on 15 February 2025, 7pm at Kasablanka Hall, Kota Kasablanka Jakarta. Fans are invited to embark on an existing experience with the In Love Fan Meeting, where they can fully indulge in and appreciate the charms of Hwang In Youp.</p>

      <p dir="ltr"><img src="https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739478102/minpro-event-ticketing/event/asset/hwang_in_youp_asset_xbzux8.jpg" alt="" width="640" height="800" /></p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '30e0d778-e66e-4250-92c2-c35ba1323eb0', // music
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'The Kasablanka Hall',
      views: 90,
      tickets: [
        {
          type: 'PAID',
          name: 'Diamond',
          amount: 100,
          initialAmount: 100,
          price: 2_950_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Gold',
          amount: 100,
          initialAmount: 100,
          price: 2_350_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Silver',
          amount: 100,
          initialAmount: 100,
          price: 1_850_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: 'd863993d-a04a-46a3-b8ce-7875cfdb2b09',
      name: 'Mens Rea - Makassar',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739478341/minpro-event-ticketing/event/banner/Mens_Rea_agclyh.png',
      description: `
      <h2>Mens Rea adalah istilah hukum yang artinya "Niat Jahat"</h2>
      <p>Dalam persidangan seringkali yang harus dicari tahu adalah apakah ada niat jahat dalam tindakan seseorang.</p>
      <p>Dalam Stand-Up Comedy Special ke 10, Pandji Pragiwaksono ingin memberi pesan bahwa tidak ada niat jahat dari yang dia bawakan di atas panggung hanyalah komedi dengan tujuan membuat penonton tertawa.</p>
      <p>Namun pada saat yang bersamaan, di pertunjukan yang akan bertema politik ini Pandji akan mencari tahu adakah niat jahat di balik tindak- tanduk beberapa nama di dunia politik Indonesia.</p>
      <p>Mens Rea Tour akan mulai berjalan di tahun 2025 dengan mengunjungi 10 kota nasional &amp; 1 kota Jakarta.</p>
      <p><img src="https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739478504/minpro-event-ticketing/event/asset/Mens_Rea_Asset_wypgpd.png" alt="" width="920" height="518" /></p>
      <p>&nbsp;</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', // standup
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Makassar',
      placeName: 'Auditorium UC',
      views: 80,
      tickets: [
        {
          type: 'PAID',
          name: 'Diamond',
          amount: 100,
          initialAmount: 100,
          price: 600_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Gold',
          amount: 100,
          initialAmount: 100,
          price: 500_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Silver',
          amount: 100,
          initialAmount: 100,
          price: 300_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '73ae8478-88c9-4251-8fe9-d22f1127891e',
      name: 'SLINGSHOT FEST : BUT FIRST, LOVE',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739478961/minpro-event-ticketing/event/banner/sling_shot_yjlwi3.jpg',
      description: `
<h2><strong>SLINGSHOT FEST &bull; BUT FIRST, LOVE!</strong></h2>
<p>15 February 2025 || Jakarta Concert Hall</p>
<p>&nbsp;</p>
<p>We can&rsquo;t wait to gather with all of you in LOVE as we dive deeper into the Lord&rsquo;s command to LOVE God and others as ourselves. Together, we&rsquo;ll explore what it means to live out this calling.</p>
<p>&nbsp;</p>
<p>What&rsquo;s better than learning AND shopping? We&rsquo;ve got it all covered! Enjoy a vibrant market, and don&rsquo;t miss our powerful Worship Night experience, where you&rsquo;ll have the opportunity to spend time in God&rsquo;s presence, giving thanks and praise for all He has done.</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '037a46e9-67a8-4e1b-a22e-ca8280c2f187', // businnes
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Jakarta Concert hall, iNews Tower, Lt.14',
      views: 70,
      tickets: [
        {
          type: 'PAID',
          name: 'REGULAR TICKET',
          amount: 100,
          initialAmount: 100,
          price: 400_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'WORSHIP TICKET ONLY',
          amount: 100,
          initialAmount: 100,
          price: 250_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'CONFERENCE TICKET ONLY',
          amount: 100,
          initialAmount: 100,
          price: 250_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '9221519a-61f5-4e17-b8f8-0b13083d06d3',
      name: 'GMMTV Fan Day in JAKARTA 2025',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739479641/minpro-event-ticketing/event/banner/gmtv_fan_day_omonbn.jpg',
      description: `
<h2><strong>Get ready for an unforgettable experience!</strong></h2>
<p>This special&nbsp;<strong>FAN DAY</strong>&nbsp;brings you closer to&nbsp;<strong>Pond</strong>&nbsp;and&nbsp;<strong>Sea</strong>, the young talented stars who has captured your hearts with their charm.&nbsp;</p>
<p>Enjoy an intimate moment with your favorite star through Q&amp;A sessions, exclusive performances, and interactive activities specially designed for fans. Let's share the joy, and create cherished memories together.</p>
<p>Don&rsquo;t miss this heartwarming and exciting event. Be part of a special moment that will stay with you forever! ✨</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '377113c0-318d-4a2b-ab9b-2f2f2c5cab55', // hobby
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Jawa Barat',
      placeName: 'Bekasi Convention Center',
      views: 70,
      tickets: [
        {
          type: 'PAID',
          name: 'POND - PLATINUM (SEATING)',
          amount: 100,
          initialAmount: 100,
          price: 3_800_000,
          description: `- Soundcheck - Fan sign - Private Photo (1 : 1) - Hi-Touch - Signed Polaroid ( Random 20 ) - Special Message Postcard`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'POND - GOLD (SEATING)',
          amount: 100,
          initialAmount: 100,
          price: 3_300_000,
          description: `- Sound Check - Pre-signed Poster - Private Photo (1 : 1) - Hi-Touch - Signed Polaroid (Random 20) - Special Message Postcard`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'POND - SILVER (SEATING)',
          amount: 100,
          initialAmount: 100,
          price: 1_300_000,
          description: `- Pre-signed Poster - Group Photo (1:10) - Hi-Touch - Special Message Postcard`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '28ea2139-fc5e-4866-b998-dc4bd04d1a12',
      name: 'Jazz Aula Barat #8',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739480049/minpro-event-ticketing/event/banner/Jazz_Aula_ezx9xo.jpg',
      description: `
<p><strong>Jazz Aula Barat (JAB)</strong>&nbsp;merupakan acara annual yang diselenggarakan oleh<strong>&nbsp;ITBJazz</strong>&nbsp;yang kembali diadakan pada tahun ini di Aula Barat, Institut Teknologi Bandung. Berawal pada tahun 2013 tanggal 1 April, Jazz Aula Barat diadakan dan memberikan pengalaman mengesankan yang dihadiri oleh banyak pencinta musik. Jazz Aula Barat #8 ini bertujuan untuk menghadirkan keseruan dan pengalaman ini kembali seperti JAB pada awalnya .</p>
<p>&nbsp;</p>
<p>Tahun ini, Jazz Aula Barat akan menghadirkan bintang dan sensasi utama&nbsp;<strong>Ardhito Pramono</strong>&nbsp;pada tanggal 15 Februari 2025 pada pukul&nbsp;<strong>18:00 (Open Gate)&nbsp;</strong>di Aula Barat, Institut Teknologi Bandung. Selain itu, JAB juga akan menghadirkan musisi jazz ternama, seperti<strong>&nbsp;Oele Pattiselano</strong>,&nbsp;<strong>Tiyo Alibasjah</strong>,&nbsp;<strong>Nenden Shintawati</strong>, dan musisi-musisi lainnya. Jangan lewatkan kesempatan untuk menikmati malam penuh harmoni di Jazz Aula Barat #8. Saksikan penampilan spesial oleh musisi - musisi jazz ternama dalam suasana yang intim dan berkelas. Dapatkan tiketnya sekarang dan rasakan pengalaman jazz yang autentik di Aula Barat ITB.</p>
<p>&nbsp;</p>
<p>Contact person: Aliya (08122002890)</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '037a46e9-67a8-4e1b-a22e-ca8280c2f187', // businnes
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Jawa Barat',
      placeName: 'Aula Barat Institut Teknologi Bandung',
      views: 60,
      tickets: [
        {
          type: 'PAID',
          name: 'REGULER - UMUM',
          amount: 100,
          initialAmount: 100,
          price: 150_000,
          description: `Nomor kursi akan didapatkan saat registrasi sesuai ketersediaan.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'REGULER - MAHASISWA ITB',
          amount: 100,
          initialAmount: 100,
          price: 100_000,
          description: `Nomor kursi didapatkan sesuai ketersediaan setelah verifikasi KTM ITB saat registrasi.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'VIP',
          amount: 100,
          initialAmount: 100,
          price: 250_000,
          description: `Nomor kursi didapatkan saat registrasi sesuai ketersediaan.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '8689b66e-1001-48d1-8a1e-7ec639d0cfe2',
      name: 'Kontras by Abdur Arsyad - Jakarta',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739480332/minpro-event-ticketing/event/banner/kontras_abdur_k5fqxl.jpg',
      description: `
<p class="ql-align-justify">&ldquo;<strong>Kontras</strong>&rdquo; adalah sebuah pertunjukan stand-up comedy special ke-empat Abdur Arsyad yang mengangkat tema transportasi di Indonesia. Nama stand-up comedy special-nya kali ini diambil dari &ldquo;Konten Transportasi&rdquo; atau disingkat Kontras, di mana pada konten ini Abdur menampilkan perjalanan yang ia lakukan menggunakan beragam sarana transportasi terutama di wilayah Jakarta. Melalui &ldquo;Kontras&rdquo;, Abdur akan membahas seputar transportasi baik itu transportasi umum, pribadi, hingga perilaku pengguna transportasi.</p>
<p class="ql-align-justify">Kontras akan hadir ke-16 kota di Indonesia, yaitu Malang, Surabaya, Denpasar, Lampung, Banjarmasin, Pontianak, Yogyakarta, Semarang, Bogor, Lombok, Balikpapan, Bandung, Pekanbaru, Makassar, Batam dan Jakarta.</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', // standup
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Balai Sarbini',
      views: 50,
      tickets: [
        {
          type: 'PAID',
          name: 'Early Bird',
          amount: 100,
          initialAmount: 100,
          price: 250_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Normal',
          amount: 100,
          initialAmount: 100,
          price: 400_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'VIP',
          amount: 100,
          initialAmount: 100,
          price: 550_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '14003078-9bac-4d2d-ab08-85433d609ec6',
      name: 'MEDICORUN 2025',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739480635/minpro-event-ticketing/event/banner/medico_run_s3vm0o.jpg',
      description: `
<h2><strong>MOVE MORE, LIVE MORE!</strong></h2>
<p class="ql-align-justify">Siapa yang punya resolusi "new year, new me" di sini? Jangan biarin resolusimu cuman jadi janji manis sama diri sendiri! Mulai kecil-kecilan dulu dengan lari bersama MEDICORUN! Karena perubahan yang baik adalah perubahan yang dimulai. Selain meningkatkan kesehatan fisik, MEDICORUN juga menghadirkan bazar, hadiah menarik, serta penampilan dari bintang tamu spesial! Buruan gabung di MEDICORUN untuk capai resolusi tahun barumu! Ajak keluarga dan teman- temanmu untuk ikut serta dan ciptakan momen tak terlupakan bersama! Ini waktumu untuk mulai!</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: '411708d2-c5ce-4b9b-8bf5-0c782cac11f8', // sports
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Semarang',
      placeName: 'Balai Kota Semarang',
      views: 50,
      tickets: [
        {
          type: 'PAID',
          name: 'MEDICORUN 2025',
          amount: 100,
          initialAmount: 100,
          price: 250_000,
          description: `RACE PACK includes: Jersey, Medals, Bib number, Snack & Souvenirs`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*                          Healings Events                         */
    /* ---------------------------------------------------------------- */
    {
      id: 'c4acb897-e877-4392-8083-882c3c780e71',
      name: 'Waterbom Bali',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739494928/minpro-event-ticketing/event/banner/water_boom_bali_achsx0.jpg',
      description: `
<p><strong>Mari beristirahat dari rutinitas sehari-hari Anda dan bermain di Waterbom Bali!</strong> Coba berbagai seluncuran yang memenuhi standar keselamatan internasional dan wahana-wahana air kelas dunia dikelilingi pemandangan hijau yang indah. Taman di sini didesain sedemikian rupa sehingga mencerminkan keindahan alam Bali.</p>
<p><strong>Dengan luas sekitar 3,8 hektar, Waterbom Bali menawarkan pengalaman-pengalaman yang seru</strong> dan tak terlupakan untuk segala usia. Jika Anda tipe yang gemar menguji nyali, Anda harus mencoba The Climax, salah satu seluncuran tertinggi di Asia! Dengan berbagai wahana air lainnya seperti Boomerang, Superbowl, Phyton, Open Green Viper Slide, dan masih banyak lainnya. Anda juga bisa menaklukkan ombak buatan dengan berselancar di Flow Rider. Benar-benar tempat wisata yang tepat untuk Anda yang ingin bersenang-senang bersama keluarga, dan tentunya lupakan segala kesibukan Anda.</p>
<ol>
<li>Rasakan jantung Anda berdebar saat mencoba perosotan kelas dunia seperti Green Vipers</li>
<li>Coba taklukkan ombak di Flow Rider</li>
<li>Adu cepat dengan orang terdekat Anda sambil meluncur turun di Twin Racers</li>
<li>Biarkan si kecil bersenang-senang di Kiddy Slide</li>
<li>Akhiri hari Anda dengan bersantai sambil menyusuri Lazy River</li>
</ol>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Bali',
      placeName: 'LOKET.COM, Bali',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: '[Adult] Single Day Pass - All Market',
          amount: 100,
          initialAmount: 100,
          price: 500_000,
          description: `Single Day Pass - All Market Adult Individu Tickets`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: '[Child] Single Day Pass - All Market',
          amount: 100,
          initialAmount: 100,
          price: 350_000,
          description: `Single Day Pass - All Market Child Individu Tickets`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: '[Family] Single Day Pass - All Market',
          amount: 100,
          initialAmount: 100,
          price: 1_500_000,
          description: `Single Day Pass - All Market Family Individu Tickets`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '77c50e74-e3c1-444f-9755-bc425a3e01a9',
      name: 'TAMAN PANTAI - ANCOL',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739495426/minpro-event-ticketing/event/banner/taman_ancol_rv7psd.jpg',
      description: `
<h2><strong>Syarat dan Ketentuan</strong></h2>
<ol>
<li>E-ticket hanya berlaku pada tanggal kunjungan yang dipilih pada saat pembelian (tidak dapat digunakan pada tanggal lainnya).</li>
<li>Jam operasional Ancol Taman Impian :<br />Senin - Minggu dan Libur Nasional<br />- Pintu gerbang utama : Pkl 05.00 s.d 23.00 WIB<br />- Kawasan taman &amp; pantai : Pkl 06.00 s.d 24.00 WIB</li>
<li>E-ticket berlaku untuk 1 Orang (1x kunjungan).</li>
<li>E-ticket belum termasuk tiket kendaraan.</li>
<li>E-ticket berlaku untuk 1 kali pemakaian.</li>
<li>Anak usia 2 tahun keatas sudah dikenakan biaya tiket Ancol penuh.</li>
<li>E-ticket yang sudah dibeli tidak dapat dikembalikan (non-refundable).</li>
<li>Kegiatan pengambilan foto dan video komersil (Foto Produk, Foto Prewedding, Foto Buku Tahunan Sekolah, Syuting Film, Syuting Sinetron, Syuting Video Musik, dan sebagainya) dikenakan biaya sewa lokasi.</li>
<li>Dilarang merusak fasilitas umum area ancol</li>
<li>Dilarang membawa alat musik dan sound system, tanpa seijin Pihak Management Ancol.</li>
<li>Dilarang berjualan di area Ancol Taman Impian, tanpa seijin Pihak Management Ancol.</li>
<li>Dilarang membawa hewan peliharaan ke kawasanAncol Taman Impian.</li>
<li>Dilarang menggunakan confetti</li>
<li>Dilarang membloking area tertentu untuk kegiatan, tanpa seijin Pihak Management Ancol</li>
</ol>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Taman Impian',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Tiket Orang Masuk Ancol',
          amount: 100,
          initialAmount: 100,
          price: 35_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Paket Ber-4',
          amount: 100,
          initialAmount: 100,
          price: 130_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '03f8a535-1ca4-4490-b7aa-297b7176c223',
      name: 'DUFAN ANCOL',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739495908/minpro-event-ticketing/event/banner/dufan_ancol_g3lbov.jpg',
      description: `<p>Dunia Fantasi atau yang lebih populer dengan sebutan Dufan, pertama kali dibuka untuk umum pada 29 Agustus 1985 dan merupakan theme park pertama yang dikembangkan oleh Perseroan dan telah memiliki sertifikat ISO 9001:2015 sejak Februari 2017.<br /><br />Selain menjadi pusat hiburan outdoor, Dufan juga merupakan kawasan edutainment fisikia terbesar di Indonesia yang memanjakan pengunjung dengan Fantasi Keliling Dunia, melalui wahana permainan berteknologi tinggi, yang terbagi dalam 9 (Sembilan) kawasan yaitu Indonesia, Jakarta, Asia, Eropa, Amerika, Yunani, Hikayat, Kalila dan Fantasy Lights.<br /><br />Fasilitas umum untuk pengunjung :&nbsp; Free Wifi, Charger Point, Toilet bersih disetiap kawasan dan wahana, Baby Care Room, Mushola dan Masjid, P3K &amp; Ambulance.</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Dunia Fantasi, Dufan',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Dufan Ancol [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 275_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Paket Ber-3 Dufan [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 160_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '619c07f5-faa9-4ea6-ba8f-010614dfead1',
      name: 'JAKARTA BIRD LAND ANCOL',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739496237/minpro-event-ticketing/event/banner/bird_land_ancol_kpk0bi.png',
      description: `
<p>Jakarta Bird Land adalah taman bermain sekaligus tempat konservasi yang memiliki berbagai jenis spesies burung di Indonesia maupun mancanegara dimana keluarga Indonesia dapat memperoleh edukasi, interaksi hingga pengalaman baru dengan berbagai jenis spesies burung.<br /><br />Jakarta Bird Land menawarkan berbagai interaksi mulai dari Bird Feeding, Direct Touch, dsb hingga interaksi baru seperti Free Range Bird, Lake For Show, Waterfall, Escalator hingga Thematic Hardscape yang tidak ada di taman burung manapun di Indonesia.</p>
<p>Selain menjadi taman wisata edukasi,&nbsp;Jakarta Bird Land juga menjadi pusat konservasi yang menyelamatkan berbagai spesies burung yang terancam punah melalui pusat Breeding &amp; Research yang fokus dalam merawat spesies-spesies burung di Indonesia &amp; Mancanegara.<br /><br />Berikut beberapa Area yang bisa kamu kunjungi saat berada di Jakarta Bird Land:</p>
<p>1. Area Makau dan Kakaktua</p>
<p>2. Area Hornbill Family</p>
<p>3. Area Para Pemangsa</p>
<p>4. Area Burung Perairan (Water Bird)</p>
<p>5. Kandang Burung</p>
<p>6. Mini Show&nbsp;</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Dunia Fantasi, Dufan',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Bird Land Ancol [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 60_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Paket Ber-3 Bird Land [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 30_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '89444960-a101-4565-9652-9f3d435a9411',
      name: 'SAMUDRA ANCOL',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739496653/minpro-event-ticketing/event/banner/samudra_ancol_zoabiv.png',
      description: `
<p>Ocean Dream Samudra ini diresmikan pada juni 1974 oleh Gubernur Ali Sadikin sebagai perwujudan cita-citanya tentang perlunya sarana rekreasi yang mengenalkan kepada masyarakat tentang laut beserta potensinya.<br />Ocean Dream Samudra&nbsp;merupakan Edutainment Theme Park bernuansa konservasi alam yang memberikan pengalaman untuk mengenal lebih dekat dan menyayangi aneka satwa.<br />Ocean Dream Samudra merupakan unit&nbsp;oceanarium terbesar&nbsp;yang terdiri dari pentas lumba-lumba, pentas singa laut, pentas aneka satwa, peragaan satwa, akuarium ikan laut dan tawar&nbsp; serta taman yang merupakan habitat beraneka macam burung. Terobosan Ancol ini menjadi pusat studi konservasi ex-situ lumba-lumba (dolphinarium) karena memiliki konsep dan manajemen lumba-lumba yang paling lengkap, meliputi berbagai unsur yang saling mendukung seperti kolam penampungan lumba-lumba, water treatment, trainer/keeper, pengadaan ikan yang berkualitas, laboratorium, para medis dan dokter hewan.</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Ocean Dream Samudra, Ancol',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Samudra Ancol [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 60_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Paket Ber-3 Samudra [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 30_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '32d970fb-2916-4516-84c8-59d444ed7b2f',
      name: 'ATLANTIS ANCOL',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739496809/minpro-event-ticketing/event/banner/atlantis_ancol_lp4zsa.png',
      description: `
<p>Atlantis Ancol merupakan taman rekreasi air tematik dengan konsep peradaban dan kota-kota kuno di wilayah Mediterania yang lenyap akibat letusan gunung api dan gempa bumi.</p>
<p>Atlantis Ancol yang dahulu bernama Gelanggang Renang Ancol resmi dibuka untuk umum pada tanggal 28 Juni 1974 diresmikan oleh Gubernur DKI Jakarta Bapak Let.Jend Marinir Ali Sadikin dengan luar areal menjadi 7 HA.</p>
<p>Atlantis Ancol mengajak para pengunjung untuk merasakan petualangan ke dunia yang hilang dengan mengarungi Sembilan jenis kolam dan ragam permainan Wahana yang asyik dan juga menantang</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'DKI Jakarta',
      placeName: 'Atlantis, Ancol',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Atlantis Ancol [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 60_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
        {
          type: 'PAID',
          name: 'Paket Ber-3 Atlantis [Weekday]',
          amount: 100,
          initialAmount: 100,
          price: 30_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '901826a2-a5b8-4f57-b2f2-3c979c17aa68',
      name: 'JUNGLELAND',
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739496945/minpro-event-ticketing/event/banner/Junggle_Land_fnx7dp.jpg',
      description: `
<p>Jungleland Adventure Themepark, salah satu taman bermain wahana terbesar di Indonesia yang berlokasi di Sentul. Berada di kawasan sejuk Gunung Pancar dengan luas area mencapai 35Ha yang dibagi dalam 4 zona, yaitu Zona Carnivalia, Tropicalia, Mysteria &amp; Explora.</p>
<p>Jungleland Adventure Themepark, memberikan pengalaman wisata perualangan yang tak terlupakan bersama sahabat dan keluarga</p>
      `,
      startDate: bulandepan,
      endDate: bulandepan,
      startTime: '00:00',
      endTime: '23:30',
      categoryId: 'e139448d-50b6-41b6-9f91-a30b72f6afc1', // travels and holiday
      isPublished: true,
      isEventOnline: false,
      urlStreaming: null,
      organizerId: organizerId,
      placeAddress: 'Jl. Street 05',
      placeCity: 'Bogor',
      placeName: 'Jungleland Adventure Theme Park',
      views: 10,
      tickets: [
        {
          type: 'PAID',
          name: 'Reguler Terusan',
          amount: 100,
          initialAmount: 100,
          price: 125_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: bulanDepanKurangSatuHari,
          startTime: '00:00',
          endTime: '23:30',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*                         Event This Month                         */
    /* ---------------------------------------------------------------- */
    {
      id: 'eeebc53b-ce92-4e58-96a9-32dbc29045db',
      name: `BLOOM : Black and Red of Our Memories (A Valentine's Party Hosted by Weekfest)`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739512396/minpro-event-ticketing/event/banner/bloom_h3pkoy.jpg',
      description: `
<p>Brace yourself for&nbsp;<strong>BLOOM</strong>&nbsp;(<em>Black</em>&nbsp;<em>and Red of Our</em>&nbsp;<em>Memories</em>), a Valentine&rsquo;s celebration that&rsquo;s about to blow your mind, brought to you by Weekfest. This one-of-a-kind event showcases unforgettable sets from&nbsp;<em>Hozier</em>,&nbsp;<em>Laufey</em>,&nbsp;<em>Niki</em>, and&nbsp;<em>Wave to Earth</em>, merging soulful tunes with electrifying rhythms. In an atmosphere drenched in black and red, you&rsquo;ll be swept away by a night that embraces love, passion, and unforgettable experiences. The ideal balance of thrilling energy and smooth, relaxed beats, turning every moment into something out of a dream. Lock in your spot now, and get ready for a night packed with music, memories, and moments that&rsquo;ll stay with you long after the final beat drops.</p>
<p>&nbsp;</p>
<p>BLOOM, showcased by&nbsp;<a href="https://www.loket.com/event/t.me/weekfest" target="_blank" rel="noopener noreferrer">@WEEKFEST</a>. Saturday, February 15th, 2025, 7 PM, at Le Zenith Paris - La Villette, Paris, France.</p>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: '30e0d778-e66e-4250-92c2-c35ba1323eb0', // music
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'PUBLIC ON SALE',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '00:00',
          endTime: '22:30',
        },
      ],
    },
    {
      id: '05fbcd0b-b3d7-408f-8389-1e3129c6d19f',
      name: `Webinar Social Skills: Belajar Cara Berinteraksi Sosial`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739514553/minpro-event-ticketing/event/banner/webinar_interaksi_sosial_apzmu5.jpg',
      description: `
<p><strong>Webinar Social Skills: Belajar Cara Berinteraksi Sosial</strong>&nbsp;Bersama Grace Augustia Keeltjes, S.Psi (Mentor SP Collective)</p>
<p><strong>Kamu akan mempelajari:</strong></p>
<ol>
<li>Pentingnya Komunikasi yang Efektif</li>
<li>Mengembangkan Kecerdasan Emosional</li>
<li>Meningkatkan Kemampuan Mendengarkan Aktif</li>
<li>Strategi Membangun Kepercayaan dan Hubungan</li>
<li>Mengatasi Konflik secara Positif</li>
</ol>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: '4699d695-e405-44c4-9e26-29e74e20ae65', // education
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Ticket Miskin',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '00:00',
          endTime: '22:30',
        },
        {
          type: 'PAID',
          name: 'Reguler',
          amount: 100,
          initialAmount: 100,
          price: 50_000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '00:00',
          endTime: '22:30',
        },
      ],
    },
    {
      id: 'dba99d2c-851e-4cba-ad95-2589f86c8746',
      name: `ET-Asia Intensive Bootcamp: English for Legal Practitioner`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739514765/minpro-event-ticketing/event/banner/bootcamp_tsvmkw.jpg',
      description: `
<p>Bagi seorang praktisi hukum yang bekerja di sektor korporasi atau memiliki aspirasi menjadi international lawyer, penguasaan bahasa inggris adalah kunci penting untuk akselerasi karier. Dan bukan hanya bahasa inggris untuk sekadar komunikasi saja, melainkan versi yang lebih advanced untuk penyusunan dan revisi kontrak hingga negosiasi dengan orang asing.</p>
<p>Untuk menjawab kebutuhan memahami bahasa inggris yang lebih advanced bagi seorang praktisi hukum, ET-Asia kembali menyelenggarakan salah satu program unggulan yakni An Online Intensive Course: English for Legal Practitioner yang ditujukan bagi para mahasiswa, fresh graduate, dan entry level pada industri hukum.</p>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: '4699d695-e405-44c4-9e26-29e74e20ae65', // education
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '00:00',
          endTime: '22:30',
        },
      ],
    },
    {
      id: 'd5953e0f-ac95-4a2e-8270-c93bf1860711',
      name: `Modal Minimal, Skill Maksimal bISA Jadi Programmer Andal!`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739514921/minpro-event-ticketing/event/banner/Hacktiv_cge1qd.jpg',
      description: `
<p>Cita-cita programmer bukan lagi jadi impian, tapi kamu bISA raih dengan Income Share Agreement dari Hacktiv8!</p>
<p>&nbsp;</p>
<p>Ikuti sesi Talk &amp; Code: Income Share Agreement bersama Albert Eltom, ISA Product Improvement &amp; Analyst Lead Hacktiv8 dan Mega Pratiwi, Team Admission Hacktiv8. Acaranya&nbsp;<strong>GRATIS</strong>!</p>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: '4699d695-e405-44c4-9e26-29e74e20ae65', // education
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '22:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: 'a152e625-7de6-4f4c-9f5d-fd1a31e42a8a',
      name: `Company Law Advance Class - Data Protection Batch II`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739515074/minpro-event-ticketing/event/banner/data-protection_kc1ypn.jpg',
      description: `
<p>Dengan berlakunya Undang-Undang Perlindungan Data Pribadi (UU PDP) secara penuh mulai 17 Oktober 2024 yang lalu, perusahaan dihadapkan pada kewajiban mendesak untuk memastikan kepatuhan terhadap undang-undang tersebut guna melindungi data pribadi yang dikelolanya dan terhindar dari konsekuensi hukum. Company Law Advance Class- Data Protection Batch II dirancang untuk memberikan pemahaman mendalam tentang lanskap perlindungan data pribadi yang berkembang untuk membekali para profesional hukum terkait sektor ini.&nbsp;</p>
<p>&nbsp;</p>
<p><strong>Materi:</strong></p>
<p>1. Understanding Personal Data and Data Processing</p>
<p>2. Balancing the Scales: Understanding Data Subject Rights and Companies&rsquo; Obligations</p>
<p>3. Data Protection Impact Assessment (DPIA)</p>
<p>4. The PDP Accountability Compliance Framework: A Pathway to Corporate Success</p>
<p>5. Drafting Privacy Policy</p>
<p>&nbsp;</p>
<p><strong>Fasilitas:</strong></p>
<p>1. Material Soft-copy</p>
<p>2. E-Certificate</p>
<p>3. Webinar Recording</p>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: '4699d695-e405-44c4-9e26-29e74e20ae65', // education
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '22:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: '1f474445-209f-4fc1-ba8e-c3252474523c',
      name: `Belajar Basic Pyhton Untuk Pemula`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739515209/minpro-event-ticketing/event/banner/belajar_python_egvdee.jpg',
      description: `
<p>Ingin belajar Python dari nol? Kursus&nbsp;<strong>Belajar Basic Python untuk Pemula</strong>&nbsp;adalah pilihan tepat untuk Anda! Dapatkan pemahaman dasar tentang pemrograman Python dengan cara yang mudah dipahami dan langsung dipraktikkan. Mulai dari konsep dasar hingga penulisan kode sederhana, kursus ini akan mempersiapkan Anda untuk menguasai Python dan membuka peluang di dunia pengembangan perangkat lunak, data science, dan banyak lagi.</p>
<p class="description-panel-title">Syarat &amp; Ketentuan</p>
<ul>
<li>Pembelian dapat dilakukan melalui Loket.com dengan memilih course yang diinginkan dan menyelesaikan pembayaran menggunakan metode pembayaran yang tersedia</li>
<li>Setelah pembayaran berhasil, admin Taldio akan menghubungi kamu dalam waktu 24 jam melalui email atau nomor telepon yang didaftarkan di Loket.com.</li>
<li>Akses Course akan diberikan langsung oleh admin Taldio setelah konfirmasi pembayaran dan verifikasi data peserta.</li>
<li>Untuk informasi lebih lanjut silahkan menghubungi email&nbsp;chrisanty@taldio.com&nbsp;atau melalui WhatsApp +6282292667951</li>
</ul>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: 'ed8e3534-4836-4946-ad8e-86627ecf8b95', // self dev
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '22:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: 'a1670931-f7c3-4604-9190-e739c09a180e',
      name: `Membangun Karir Sukses Sebagai QA Engineer`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739515348/minpro-event-ticketing/event/banner/qa_engginer_ndo6oi.jpg',
      description: `
<p>Kursus ini dirancang untuk membantu Anda memulai dan mengembangkan karir sukses sebagai QA Engineer. Pelajari keterampilan penting untuk memastikan kualitas perangkat lunak, dari pengujian manual hingga otomatisasi. Dapatkan pengetahuan praktis yang dibutuhkan untuk unggul di industri teknologi dan siap menghadapi tantangan di dunia QA!</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p class="description-panel-title"><strong>Syarat &amp; Ketentuan</strong></p>
<div>
<ul>
<li>Pembelian dapat dilakukan melalui Loket.com dengan memilih course yang diinginkan dan menyelesaikan pembayaran menggunakan metode pembayaran yang tersedia</li>
<li>Setelah pembayaran berhasil, admin Taldio akan menghubungi kamu dalam waktu 24 jam melalui email atau nomor telepon yang didaftarkan di Loket.com.</li>
<li>Akses Course akan diberikan langsung oleh admin Taldio setelah konfirmasi pembayaran dan verifikasi data peserta.</li>
<li>Untuk informasi lebih lanjut silahkan menghubungi email&nbsp;chrisanty@taldio.com&nbsp;atau melalui WhatsApp +6282292667951</li>
</ul>

      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: 'ed8e3534-4836-4946-ad8e-86627ecf8b95', // self dev
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'FREE',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: null,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '22:00',
          endTime: '23:30',
        },
      ],
    },
    {
      id: 'ecaeab5d-2929-4acd-a02b-dd23f35b6f94',
      name: `PRACTICAL SUCCESSION MANAGEMENT ONLINE WORKSHOP`,
      bannerUrl:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1739515645/minpro-event-ticketing/event/banner/practical_session_management_obj6a8.jpg',
      description: `
<p><strong>PRACTICAL SUCCESSION MANAGEMENTONLINE WORKSHOP</strong></p>
<p>Memiliki sistem succession management yang efektif adalah kunci untuk memastikan keberlanjutan kepemimpinan dalam organisasi Anda. Workshop ini akan memandu Anda memahami dan mengimplementasikan succession management secara terstruktur, mulai dari mengidentifikasi posisi kritis hingga merencanakan pengembangan talent secara praktis.</p>
<p>&nbsp;</p>
<p>Outline Workshop:</p>
<ol>
<li>Succession Management: Issues &amp; Benefit</li>
<li>Identifying Critical Position</li>
<li>Talent Identification</li>
<li>Practical Succession Planning</li>
</ol>
<p>&nbsp;</p>
<p>Fasilitator: Eka Junis S. HR Strategy and Talent Management Practitioner</p>
<p>Workshop ini ideal untuk:</p>
<ul>
<li>HR Manager &amp; HR Business Partner</li>
<li>Learning &amp; Development Manager1</li>
<li>Talent Management Specialist</li>
<li>Organization Development Professional</li>
<li>Para profesional yang bertanggung jawab dalam pengembangan talent</li>
</ul>
      `,
      startDate: akhirBulanIni,
      endDate: akhirBulanIni,
      startTime: '23:00',
      endTime: '23:30',
      categoryId: 'ed8e3534-4836-4946-ad8e-86627ecf8b95', // self dev
      isPublished: true,
      isEventOnline: true,
      urlStreaming:
        'https://zoom.us/j/8607480399?pwd=RTJwaXlGZjR4eHdPN2kxWnArTDRVUT08',
      organizerId: organizerId,
      placeAddress: null,
      placeCity: null,
      placeName: null,
      views: 8,
      tickets: [
        {
          type: 'PAID',
          name: 'Regular Pass',
          amount: 100,
          initialAmount: 100,
          price: 50_0000,
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
          startDate: currentdate,
          endDate: satuHariSebelumAkhirBulanIni,
          startTime: '22:00',
          endTime: '23:30',
        },
      ],
    },

    // Active Event 1
    {
      id: '1fbcf999-c0bc-4103-bd2b-fa0e890c2f06',
      name: 'Tech Startup Conference 2023',
      bannerUrl: 'https://example.com/tech-conference.jpg',
      description:
        '<p>Join us for the biggest tech startup conference of the year! Learn from industry leaders and network with like-minded entrepreneurs.</p>',
      startDate: new Date('2023-12-15'),
      endDate: new Date('2023-12-16'),
      startTime: '09:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Convention Center',
      placeCity: 'San Francisco',
      placeAddress: '123 Tech Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '09a2b96b-2292-4a93-aec6-a0c59a5cb24e', // tech_startup
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2023-12-15'),
          endDate: new Date('2023-12-16'),
          startTime: '09:00',
          endTime: '18:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'Regular',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2023-12-15'),
          endDate: new Date('2023-12-16'),
          startTime: '09:00',
          endTime: '18:00',
          price: 299.99,
        },
      ],
    },
    // Draft Event 2
    {
      id: 'db811713-8070-47bf-b16f-b7cfcc0363d0',
      name: 'Future of AI Workshop',
      bannerUrl: 'https://example.com/ai-workshop.jpg',
      description:
        '<p>Explore the future of artificial intelligence in this hands-on workshop. Perfect for developers and data scientists.</p>',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-21'),
      startTime: '10:00',
      endTime: '16:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/ai-workshop-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'f2177166-07ec-4169-9867-69d6ead067fb', // science_technology
      tickets: [
        {
          type: TicketType.FREE,
          name: 'General Admission',
          description: 'Access to all sessions',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2024-01-20'),
          endDate: new Date('2024-01-21'),
          startTime: '10:00',
          endTime: '16:00',
          price: null,
        },
      ],
    },
    // Past Event 3
    {
      id: '7c3e05ca-0386-4c7e-9fde-2b02256bba0a',
      name: 'Music Festival 2023',
      bannerUrl: 'https://example.com/music-festival.jpg',
      description:
        '<p>Relive the magic of the 2023 Music Festival! Featuring top artists from around the world.</p>',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2023-07-02'),
      startTime: '12:00',
      endTime: '23:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Central Park',
      placeCity: 'New York',
      placeAddress: '456 Music Avenue',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '30e0d778-e66e-4250-92c2-c35ba1323eb0', // music
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Front-row access and exclusive lounge',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-07-01'),
          endDate: new Date('2023-07-02'),
          startTime: '12:00',
          endTime: '23:00',
          price: 499.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all stages',
          initialAmount: 500,
          amount: 500,
          startDate: new Date('2023-07-01'),
          endDate: new Date('2023-07-02'),
          startTime: '12:00',
          endTime: '23:00',
          price: 149.99,
        },
      ],
    },
    // Active Event 4
    {
      id: 'df48b184-c227-43e2-8948-03f274f6417c',
      name: 'Fitness Bootcamp 2024',
      bannerUrl: 'https://example.com/fitness-bootcamp.jpg',
      description:
        '<p>Kickstart your fitness journey with our intensive bootcamp. Suitable for all levels.</p>',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-12'),
      startTime: '07:00',
      endTime: '09:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'City Gym',
      placeCity: 'Los Angeles',
      placeAddress: '789 Fitness Road',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '0fda353f-1265-448e-a0fe-4827f940370a', // health_fitness
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Standard Pass',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2024-02-10'),
          endDate: new Date('2024-02-12'),
          startTime: '07:00',
          endTime: '09:00',
          price: 99.99,
        },
      ],
    },
    // Draft Event 5
    {
      id: 'bbd8cdc6-d2a5-4186-9ec5-143db4861ae4',
      name: 'Digital Marketing Masterclass',
      bannerUrl: 'https://example.com/digital-marketing.jpg',
      description:
        '<p>Learn the latest strategies in digital marketing from industry experts.</p>',
      startDate: new Date('2024-03-05'),
      endDate: new Date('2024-03-06'),
      startTime: '13:00',
      endTime: '17:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/digital-marketing-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'c14502f1-f690-4024-80de-6e1e540fbaed', // marketing
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2024-03-05'),
          endDate: new Date('2024-03-06'),
          startTime: '13:00',
          endTime: '17:00',
          price: 149.99,
        },
      ],
    },
    // Past Event 6
    {
      id: '02beac31-4efe-4c5e-bfc3-19010dc739e6',
      name: 'Food & Wine Festival 2023',
      bannerUrl: 'https://example.com/food-wine.jpg',
      description:
        '<p>Experience the finest cuisines and wines from around the world.</p>',
      startDate: new Date('2023-05-20'),
      endDate: new Date('2023-05-21'),
      startTime: '11:00',
      endTime: '20:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Downtown Plaza',
      placeCity: 'Chicago',
      placeAddress: '101 Gourmet Lane',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '421a51c0-f77d-4d86-9810-151c8e30d823', // food_drinks
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Exclusive tastings and lounge access',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-05-20'),
          endDate: new Date('2023-05-21'),
          startTime: '11:00',
          endTime: '20:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all tastings',
          initialAmount: 300,
          amount: 300,
          startDate: new Date('2023-05-20'),
          endDate: new Date('2023-05-21'),
          startTime: '11:00',
          endTime: '20:00',
          price: 99.99,
        },
      ],
    },
    // Active Event 7
    {
      id: '90bd2b62-f545-473b-9c13-d84f64a9db3b',
      name: 'Environmental Sustainability Summit',
      bannerUrl: 'https://example.com/environment-summit.jpg',
      description:
        '<p>Join global leaders in discussing solutions for a sustainable future.</p>',
      startDate: new Date('2024-04-22'),
      endDate: new Date('2024-04-23'),
      startTime: '10:00',
      endTime: '16:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Green Convention Center',
      placeCity: 'Seattle',
      placeAddress: '202 Eco Drive',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '6f9d4a6c-70d8-4d27-87e8-4c589a5b0082', // environment
      tickets: [
        {
          type: TicketType.FREE,
          name: 'General Admission',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2024-04-22'),
          endDate: new Date('2024-04-23'),
          startTime: '10:00',
          endTime: '16:00',
          price: null,
        },
      ],
    },
    // Draft Event 8
    {
      id: '9f1a9e74-8e4b-4b3f-bbc1-f63a6238d4f9',
      name: 'Photography Workshop',
      bannerUrl: 'https://example.com/photography-workshop.jpg',
      description:
        '<p>Learn the art of photography from professional photographers.</p>',
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-05-16'),
      startTime: '09:00',
      endTime: '15:00',
      isEventOnline: true,
      urlStreaming: 'https://example.com/photography-stream',
      placeName: null,
      placeCity: null,
      placeAddress: null,
      isPublished: false,
      organizerId: organizerId,
      categoryId: 'b019bf35-c2be-408b-88e2-e57ad7dd3aa8', // design_photo_video
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Standard Pass',
          description: 'Access to all sessions',
          initialAmount: 30,
          amount: 30,
          startDate: new Date('2024-05-15'),
          endDate: new Date('2024-05-16'),
          startTime: '09:00',
          endTime: '15:00',
          price: 79.99,
        },
      ],
    },
    // Past Event 9
    {
      id: '3f6f4bc0-6f55-4ed3-9d91-9da0a4092451',
      name: 'Stand-Up Comedy Night',
      bannerUrl: 'https://example.com/comedy-night.jpg',
      description:
        '<p>Laugh your heart out with the best comedians in town!</p>',
      startDate: new Date('2023-06-10'),
      endDate: new Date('2023-06-10'),
      startTime: '19:00',
      endTime: '22:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Laugh Factory',
      placeCity: 'Las Vegas',
      placeAddress: '303 Comedy Road',
      isPublished: true,
      organizerId: organizerId,
      categoryId: 'edec8781-3a36-42b5-b22a-dbe8989eb5af', // standup_comedy
      tickets: [
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to the show',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2023-06-10'),
          endDate: new Date('2023-06-10'),
          startTime: '19:00',
          endTime: '22:00',
          price: 49.99,
        },
      ],
    },
    // Active Event 10
    {
      id: '7e07e91d-a428-4578-83c1-2a7838973fd1',
      name: 'Blockchain & Crypto Conference',
      bannerUrl: 'https://example.com/blockchain-conference.jpg',
      description:
        '<p>Discover the future of blockchain technology and cryptocurrencies.</p>',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-02'),
      startTime: '09:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Tech Hub',
      placeCity: 'Austin',
      placeAddress: '404 Blockchain Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '58b059a6-0cf1-4406-9dab-5d7dbb790c58', // investment_stocks
      tickets: [
        {
          type: TicketType.PAID,
          name: 'Early Bird',
          description: 'Access to all sessions',
          initialAmount: 100,
          amount: 100,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-02'),
          startTime: '09:00',
          endTime: '18:00',
          price: 299.99,
        },
        {
          type: TicketType.PAID,
          name: 'Regular',
          description: 'Access to all sessions',
          initialAmount: 200,
          amount: 200,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-02'),
          startTime: '09:00',
          endTime: '18:00',
          price: 399.99,
        },
      ],
    },
    // Draft Event 11
    {
      id: '12ed7b7c-a655-460b-bc71-fd8f9d391e99',
      name: 'Art Exhibition: Modern Masters',
      bannerUrl: 'https://example.com/art-exhibition.jpg',
      description:
        '<p>Explore the works of modern art masters in this exclusive exhibition.</p>',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-12'),
      startTime: '10:00',
      endTime: '18:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Art Gallery',
      placeCity: 'Paris',
      placeAddress: '505 Art Avenue',
      isPublished: false,
      organizerId: organizerId,
      categoryId: '426588c8-0ec9-4f1f-a8d0-1163a3d7cbb6', // arts_culture
      tickets: [
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to the exhibition',
          initialAmount: 150,
          amount: 150,
          startDate: new Date('2024-07-10'),
          endDate: new Date('2024-07-12'),
          startTime: '10:00',
          endTime: '18:00',
          price: 29.99,
        },
      ],
    },
    // Past Event 12
    {
      id: '9105f166-aef5-4891-8cee-bda767d4d964',
      name: 'E-Sports Tournament 2023',
      bannerUrl: 'https://example.com/esports-tournament.jpg',
      description:
        '<p>Relive the excitement of the 2023 E-Sports Tournament featuring top gamers.</p>',
      startDate: new Date('2023-08-15'),
      endDate: new Date('2023-08-16'),
      startTime: '12:00',
      endTime: '22:00',
      isEventOnline: false,
      urlStreaming: null,
      placeName: 'Gaming Arena',
      placeCity: 'Tokyo',
      placeAddress: '606 Game Street',
      isPublished: true,
      organizerId: organizerId,
      categoryId: '3cd5540c-d08e-415c-be60-1deef20892ac', // game_esports
      tickets: [
        {
          type: TicketType.PAID,
          name: 'VIP Pass',
          description: 'Front-row seating and exclusive perks',
          initialAmount: 50,
          amount: 50,
          startDate: new Date('2023-08-15'),
          endDate: new Date('2023-08-16'),
          startTime: '12:00',
          endTime: '22:00',
          price: 199.99,
        },
        {
          type: TicketType.PAID,
          name: 'General Admission',
          description: 'Access to all matches',
          initialAmount: 500,
          amount: 500,
          startDate: new Date('2023-08-15'),
          endDate: new Date('2023-08-16'),
          startTime: '12:00',
          endTime: '22:00',
          price: 99.99,
        },
      ],
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: {
        id: event.id,
        name: event.name,
        bannerUrl: event.bannerUrl,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        isEventOnline: event.isEventOnline,
        urlStreaming: event.urlStreaming,
        placeName: event.placeName,
        placeCity: event.placeCity,
        placeAddress: event.placeAddress,
        isPublished: event.isPublished,
        organizerId: event.organizerId,
        categoryId: event.categoryId,
        views: event.views,
        tickets: {
          createMany: {
            data: event.tickets,
          },
        },
      },
    });
  }
}

async function SEED_USER(): Promise<{
  userid: string;
  organizerid: string;
}> {
  const organizerId = '4369549d-8056-4138-a1cf-5139f7527f0d';
  const userId = 'bc1a6307-6471-4b3b-b8a4-3aa2bb62c1f5';

  const sekarang = new Date();

  const tigaBulanKedepan = new Date();
  tigaBulanKedepan.setMonth(sekarang.getMonth() + 3);

  await prisma.user.create({
    data: {
      id: organizerId,
      name: 'John Doe',
      email: 'john@john.com',
      password: '$2a$12$g4OpJ3.Vezr4bZDz2dBy.OBuQoXWQccypaclZQUxT4njRSswLEIKe', // 12345678
      profilePicture:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1761898356/minpro-event-ticketing/users/profile/soldier-placeholder_am9khm.jpg',
      role: Role.ORGANIZER,
      referralCode: 'REFF-12345',
    },
  });

  await prisma.user.create({
    data: {
      id: userId,
      name: 'Alice Chan',
      email: 'alice@alice.com',
      password: '$2a$12$g4OpJ3.Vezr4bZDz2dBy.OBuQoXWQccypaclZQUxT4njRSswLEIKe', // 12345678
      profilePicture:
        'https://res.cloudinary.com/dx6hmxiv3/image/upload/v1761898356/minpro-event-ticketing/users/profile/soldier-placeholder_am9khm.jpg',
      role: Role.CUSTOMER,
      referralCode: 'REFF-54321',
      vouchers: {
        createMany: {
          data: [
            {
              name: 'Referral Rewards',
              price: 10000,
              expiredAt: tigaBulanKedepan,
              description: 'Get Rp10.000 off the next time you purchase!',
            },
            {
              name: 'Referral Rewards',
              price: 10000,
              expiredAt: tigaBulanKedepan,
              description: 'Get Rp10.000 off the next time you purchase!',
            },
          ],
        },
      },
    },
  });

  await prisma.pointBalance.createMany({
    data: [
      {
        point: 10000,
        type: 'EARN',
        userId: userId,
        // expiredAt: tigaBulanKedepan,
      },
      {
        point: 10000,
        type: 'EARN',
        userId: userId,
        // expiredAt: tigaBulanKedepan,
      },
    ],
  });

  return {
    organizerid: organizerId,
    userid: userId,
  };
}

async function main() {
  const {} = await SEED_CATEGORY();
  const { userid, organizerid } = await SEED_USER();
  await SEED_EVENTS_AND_TICKETS(organizerid);
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
