import { IMAGES } from "./images";
import type { Review, Studio } from "./types";
import { addDaysISO } from "./utils";

const AUTHORS = [
  { author: "Noa Bennett", avatar: IMAGES.avatarMia },
  { author: "Devon Shaw", avatar: IMAGES.avatarIdris },
  { author: "Priya Raman", avatar: IMAGES.avatarSana },
  { author: "Theo Grant", avatar: IMAGES.avatarLeo },
  { author: "Camille Wu", avatar: IMAGES.avatarMara },
  { author: "Jonah Ellis", avatar: IMAGES.avatarHarry },
];

const CATEGORY_NOTES: Record<string, string[]> = {
  "Photo Studio": [
    "The light was exactly as advertised, and the cyc was spotless. We shot a full lookbook in five hours without needing to move a single stand twice.",
    "Load-in was simple, the wifi held up for tethered capture, and the host left a thoughtful note with the lighting diagram. Would book the room again.",
    "A genuinely calm studio. The blackout setup gave us complete control and the green room made a long day feel much shorter.",
  ],
  "Film Stage": [
    "The stage was quiet, the power was where we needed it, and the dock made our van unload in under ten minutes. Rare to find a room this organised.",
    "We rigged a two-camera setup and had room to spare. The host answered every question before call time and the green room was a lifesaver.",
    "Blackout is real blackout here. Our gaffer called it one of the easiest rooms he has worked in this year.",
  ],
  "Podcast Lounge": [
    "The room sounds warm without feeling dead. Our guest forgot the mic was on, which is the highest compliment a podcast room can get.",
    "Everything was ready when we arrived — mics, headphones, backup recording. We recorded two episodes back to back and left on time.",
    "Small, quiet and well treated. The lounge made it easy to settle a nervous first-time guest before we started.",
  ],
  "Music Suite": [
    "The vocal booth is beautifully dead and the console felt familiar within minutes. We tracked three songs in a day and mixed in the room after.",
    "Good monitors, good chairs, and a host who actually understands session flow. The backline saved us an extra van trip.",
    "We booked a writing session and stayed for a full day. The room has a real atmosphere without getting in the way of the work.",
  ],
  Workshop: [
    "The benches are solid, the tools are sharp, and the sink is where it should be. Ran a class of ten without stepping on anyone.",
    "Bright, practical and forgiving of mess. We built a full set of props here and loaded them out through the courtyard door.",
    "The host thought of everything — aprons, drop cloths, extra power. A rare space that lets you focus on making.",
  ],
};

export function getStudioReviews(studio: Studio): Review[] {
  const studioId = studio._id || (studio as Studio & { id?: string }).id || "";
  const offset = studioId.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const notes = CATEGORY_NOTES[studio.category] ?? CATEGORY_NOTES["Photo Studio"];
  return notes.map((text, index) => {
    const author = AUTHORS[(offset + index) % AUTHORS.length];
    return {
      _id: `${studioId}-review-${index}`,
      studioId,
      author: author.author,
      avatar: author.avatar,
      rating: index === 2 ? 4 : 5,
      date: addDaysISO(-(8 + offset % 20 + index * 17)),
      text,
    };
  });
}

export function getRatingBreakdown(studio: Studio) {
  const total = studio.reviewCount || 1;
  const five = Math.round(total * 0.78);
  const four = Math.round(total * 0.16);
  const three = Math.round(total * 0.04);
  const two = Math.max(total - five - four - three - 1, 0);
  return [
    { stars: 5, count: five },
    { stars: 4, count: four },
    { stars: 3, count: three },
    { stars: 2, count: two },
    { stars: 1, count: Math.max(total - five - four - three - two, 0) },
  ];
}
