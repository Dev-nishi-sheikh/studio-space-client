const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const IMAGES = {
  // Photography
  photoLoft: unsplash("1567443024551-f3e3cc2be870"),
  photoCyc: unsplash("1581591524425-c7e0978865fc"),
  photoSoft: unsplash("1595079676339-1534801ad6cf"),
  photoLights: unsplash("1552168324-d612d77725e3"),
  photoGear: unsplash("1554048612-b6a482bc67e5"),
  photoCamera: unsplash("1542038784456-1ea8e935640e"),
  // Film
  filmStage: unsplash("1574717024653-61fd2cf4d44d"),
  cinema: unsplash("1485846234645-a62644f84728"),
  filmCrew: unsplash("1487180144351-b8472da7d491"),
  filmCam: unsplash("1598899134739-24c46f58b8c0"),
  // Podcast
  podcast: unsplash("1590602847861-f357a9332bbc"),
  podcastBooth: unsplash("1589903308904-1010c2294adc"),
  podcastMic: unsplash("1579154204601-01588f351e67"),
  podcastDesk: unsplash("1593697821252-0c9137d9fc45"),
  podcastAlt: unsplash("1524650359799-842906ca1c06"),
  // Music
  music: unsplash("1598488035139-bdbb2231ce04"),
  musicMix: unsplash("1511379938547-c1f69419868d"),
  musicVocal: unsplash("1478737270239-2f02b77fc618"),
  musicKeys: unsplash("1598653222000-6b7b7a552625"),
  musicConsole: unsplash("1571330735066-03aaa9429d89"),
  musicGuitar: unsplash("1516280440614-37939bbacd81"),
  // Workshops & interiors
  workshop: unsplash("1567538096630-e0c55bd6374c"),
  artSupplies: unsplash("1513364776144-60967b0f800f"),
  artStudio: unsplash("1416339306562-f3d12fefd36f"),
  artGallery: unsplash("1541961017774-22349e4a1262"),
  artPaint: unsplash("1452860606245-08befc0ff44b"),
  makerspace: unsplash("1598300042247-d088f8ab3a91"),
  loft: unsplash("1522708323590-d24dbb6b0267"),
  interior: unsplash("1600607687939-ce8a6c25118c"),
  event: unsplash("1492684223066-81342ee5ff30"),
  // People
  avatarHarry: unsplash("1500648767791-00dcc994a43e", 240),
  avatarMia: unsplash("1494790108377-be9c29b29330", 240),
  avatarMara: unsplash("1534528741775-53994a69daeb", 240),
  avatarIdris: unsplash("1506794778202-cad84cf45f1d", 240),
  avatarSana: unsplash("1531123897727-8f129e1688ce", 240),
  avatarLeo: unsplash("1527980965255-d3b416303d12", 240),
  avatarAlex: unsplash("1506794778202-cad84cf45f1d", 240),
} as const;
