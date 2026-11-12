export type BlogSection = "personal" | "professional";

export type BlogEntry = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const personalEntries: BlogEntry[] = [
  {
    slug: "nintendo-goal-origin",
    date: "April 8, 2026",
    title: "Why Nintendo Became My Long-Term Goal",
    excerpt:
      "Where my motivation started, why Nintendo stayed central to my goals, and how that direction still shapes my decisions.",
    content: [
      "Since this is my first entry, I'll take this opportunity introduce myself.",
      "I'm Edwin Gabriel Villanueva. I'm 22 years old, I grew up in Port Saint Lucie, and I've wanted to work with computers for as long as I can remember. From early on, Nintendo has left a huge impact on the way I think and view technology. I've especially been inspired by Satoru Iwata and his attitude/problem solving in projects like Earthbound.",
      "Around 2015, when I was about 11, that feeling sharpened. After the April 1, 2015 Nintendo Direct, I remember coming across Nintendo's careers page and wondering if it could ever actually be possible to work on programming with the company one day.",
      "That question stayed with me for years. It has since been my motivation for entering the field of computer science/software engineering and picking up languages like C.",
      "Now in 2026, with graduation close and real software experience behind me, that goal feels much more concrete than it did when I was a kid staring at that careers page."
    ]
  },
  {
    slug: "end-of-semester-reflection",
    date: "December 20, 2025",
    title: "End of Semester Reflection",
    excerpt:
      "Looking back on a packed semester and internship cycle, and processing how quickly things are moving while still feeling meaningful.",
    content: [
      "This semester was extremely eventful and went by quickly.",
      "I also wrapped my last day at CPT for the semester.",
      "It feels like time is moving faster, but somehow still giving me room to learn a lot in each phase."
    ]
  }
];

export const professionalEntries: BlogEntry[] = [
  {
    slug: "implicit-state-machines",
    date: "November 12, 2026",
    title: "Implicit State Machines",
    excerpt:
      "Undefined state machines = dangerous app behavior",
    content: [
      "Implicit state machines are the root of some of the most dangerous and hard-to-spot bugs in all of software engineering. You would assume everything has been carefully defined and accounted for, but nowadays, you can never be too sure. But what even are implicit state machines? Why are they hard to find, and why can they be so dangerous?",
      "To understand Implicit state machines, we need to understand what a state machine looks like in a full-stack application. ",
      "An example of a state machine in a full stack application is a KNW event flow. You can’t stop an event until an event has been started. An event cannot be started until the correct configurations have been created for it, or the event has already existed before. But what if you tried to stop an event that has never existed? If nothing stops a user from sending an API call that is supposed to do this, technically (depending on how it was implemented), this action can be carried out, resulting in the app experiencing unexpected/undefined behaviors. ",
      "Same for states that depend on status. If you’re on a disconnected status and click on something that requires connected without checking the connection again, the app may automatically determine that you are just not connected and ruin the user flow. ",
      "This could become even more dangerous when bad actors attempt to abuse states that are not completely protected. If we try to access an account protected by 2FA, but never properly enforce the transition from unverified to verified, we risk an innocent user’s data being exposed to anyone capable of bypassing or manipulating that verification state. Attacks such as SQL injection could potentially exploit this vulnerability, depending on how authentication and state transitions are implemented.",
      "If a developer is not mindful, implicit state machines can enable unintended behavior to be carried out. And, unfortunately, this is fairly common for apps which have been vibe-coded, as supported by the concept known as state machine divergence (https://arxiv.org/html/2511.00202v1). I would personally try to account for this by drawing out the system as a state machine and look for areas we have and have not explicitly defined in the code. If, instead, I were handed a completely vibe-coded app, one of the first things I would do is request thorough review for any possible implicit state machines so I can define the intended flow and implement those concretely. ",
      "That's all for now, bye!"
    ]
  },
  {
    slug: "internship-to-full-time",
    date: "Febrary 10, 2026",
    title: "From Internship Pace to Full-Time Execution",
    excerpt:
      "Workflow changes, ownership expectations, and engineering habits that mattered most during the transition.",
    content: [
      "Transitioning from internship work to full-time expectations changed the rhythm of delivery.",
      "The largest shift was ownership: making decisions earlier and carrying them through with less hand-holding.",
      "The biggest gains came from stronger planning, clearer communication, and tighter iteration loops."
    ]
  }
];

export const getEntriesBySection = (section: BlogSection): BlogEntry[] =>
  section === "personal" ? personalEntries : professionalEntries;

export const getEntryBySlug = (section: BlogSection, slug: string): BlogEntry | undefined =>
  getEntriesBySection(section).find((entry) => entry.slug === slug);
