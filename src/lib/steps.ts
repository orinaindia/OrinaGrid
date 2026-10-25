import type { StaticImageData } from 'next/image';
import { PHOTOS } from '@/lib/photos';

/** How a home goes solar with Orina, in five steps (the home page and How it works read these). */
export interface Step {
  title: string;
  text: string;
  /** How long it usually takes from the first call. */
  when: string;
  /** What the home has at the end of the step. */
  gets: string;
  /** Its photograph. */
  image: StaticImageData;
  /** Who does what in it (How it works). */
  you: string;
  partner: string;
}

export const STEPS: Step[] = [
  {
    image: PHOTOS.team,
    title: 'Tell us your PIN and bill',
    text: 'Two minutes, here or on WhatsApp. Your PIN code tells us which Orina Grid partner serves your district.',
    when: 'Day 0',
    gets: 'A call from your district’s partner',
    you: 'Fill the form or send a WhatsApp: name, mobile, PIN code, and the bill if you know it.',
    partner: 'Calls you back, usually within a working day, and fixes a time to visit.',
  },
  {
    image: PHOTOS.survey,
    title: 'Free site survey',
    text: 'The partner visits: the roof’s shade, strength and direction, and your electricity connection.',
    when: 'Usually day 1–3',
    gets: 'The right size for your roof and bill',
    you: 'Show the roof and a recent electricity bill. Ask anything.',
    partner: 'Measures the shade-free area, checks the roof and the meter, and works out the size.',
  },
  {
    image: PHOTOS.quote,
    title: 'A quotation you can read',
    text: 'System, brands, GST and the PM Surya Ghar subsidy, line by line, as a PDF you can keep.',
    when: 'Usually day 2–4',
    gets: 'One price, with what you pay after the subsidy',
    you: 'Read it, compare it, ask about the brands. Take your time.',
    partner:
      'Sends the quotation as a PDF: material and work, HSN codes, GST, the subsidy and the net price.',
  },
  {
    image: PHOTOS.install,
    title: 'Installation and testing',
    text: 'Structure, panels, inverter, wiring and earthing, by the partner’s own team, usually in a day or two.',
    when: 'Usually week 1–3',
    gets: 'A working system, tested and switched on',
    you: 'Pay as the quotation says and keep the roof clear on the day.',
    partner:
      'Fits the structure, panels and inverter, runs the wiring and earthing, tests it and shows you the app.',
  },
  {
    image: PHOTOS.meter,
    title: 'Net meter and subsidy',
    text: 'The partner files with your electricity company and on the national portal. The subsidy goes to your bank.',
    when: 'Usually week 3–8',
    gets: 'A net meter, and the subsidy in your account',
    you: 'Sign where needed and share your bank details for the subsidy.',
    partner:
      'Applies for the net meter with your electricity company and files the subsidy on the national portal.',
  },
];
