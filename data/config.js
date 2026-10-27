/* The text and series of the website. Edit this file freely; update_website.py never changes it.
   A series part is matched to a YouTube video when the video's title contains the 'match' text
   (not case sensitive). A part with no matching public video is shown as "Coming soon". */
window.SITE_CONFIG = {
  name: "Tech Element Lab",
  tagline: "The story of the chips behind your computer, from the Intel 4004 to AI accelerators.",
  channelUrl: "",            // leave empty: update_website.py fills in your real channel address
  about: [
    "Tech Element Lab explains how computer hardware works and how it got here. The first series, Evolution of Microprocessors, follows the processor from the first 4-bit chips to multi-core CPUs, GPUs and AI accelerators.",
    "Every video starts from a written script. The narration uses a synthetic voice. Pictures and clips come from free stock sources, with credits in each video's description, and some pictures are AI-generated."
  ],
  made: "Videos use stock footage and pictures (credited in the description), AI-generated images and a synthetic narration voice.",
  series: [
    {
      id: "evolution",
      title: "Evolution of Microprocessors",
      description: "Six videos from the Intel 4004 to AI chips: who built each processor, why it mattered, and what changed next.",
      parts: [
        { n: 1, title: "From 4-Bit Pioneers to 8-Bit Titans", match: "4-Bit Pioneers" },
        { n: 2, title: "The 16-Bit Revolution and the Birth of x86", match: "16-Bit Revolution" },
        { n: 3, title: "ARM and Mobile Processors", match: "Part 3" },
        { n: 4, title: "Multi-Core and GPUs", match: "Part 4" },
        { n: 5, title: "AI Chips and the Future", match: "Part 5" },
        { n: 6, title: "How Chips Are Made", match: "How Chips Are Made" }
      ]
    }
  ]
};
