import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { Work } from './Work';

const work = [
  {
    company: 'Idopter Labs',
    role: 'Mobile Developer',
    startDate: '2022',
    endDate: 'Present',
    logo: '/business/idopterlabs.webp',
    description:
      'Hybrid apps in React Native and Flutter: architecture, documentation and tests. Store submissions for Google Play and the App Store, native modules in Swift, Objective-C, Java and Kotlin, and automated tests in Jest.',
  },
  {
    company: 'HackerOne',
    role: 'Independent Security Researcher',
    startDate: '2018',
    endDate: 'Present',
    logo: '/business/h1.jpg',
    description:
      'Vulnerability research for HackerOne partners: stored and reflected XSS, CSRF, open redirects, weak authentication flows and Android app reverse engineering, reported through coordinated disclosure.',
  },
  {
    company: 'VoxData Technology',
    role: 'Mobile Developer',
    startDate: '2019',
    endDate: '2022',
    logo: '/business/voxdata.png',
    description:
      'Native Android and iOS work in Java, Swift and Objective-C alongside hybrid apps in Quasar and React Native. Firebase Test Lab, Cloud Messaging and REST integrations.',
  },
  {
    company: 'Synko',
    role: 'Full Stack Developer',
    startDate: '2017',
    endDate: '2019',
    logo: '/business/synko.png',
    description:
      'Node.js services and Vue.js interfaces for logistics customers, plus the internal tooling that kept the deploys reproducible.',
  },
];

const volunteer = [
  {
    organization: 'Devs Norte',
    role: 'Organizer',
    startDate: '2019',
    endDate: 'Present',
    logo: '/business/devs_norte.png',
    description:
      'Bringing the developer community in the north of Brazil closer together through talks and meetups about development, career and tooling.',
    category: 'Community',
  },
  {
    organization: 'Node.js',
    role: 'Documentation Translator',
    startDate: '2023',
    endDate: 'Present',
    logo: '/business/nodejs.png',
    description:
      'Translating the Node.js documentation to Portuguese so the platform is reachable by developers who do not read English.',
    category: 'Open Source',
  },
  {
    organization: 'BrazilJS',
    role: 'Speaker',
    startDate: '2019',
    endDate: '2019',
    logo: '/business/braziljs.png',
    description: 'Talk on testing Telegram bots without a network connection.',
    category: 'Community',
  },
];

const skills = [
  {
    category: 'Mobile Development',
    items: [
      { name: 'Flutter', icon: 'SiFlutter', color: '#02569B' },
      { name: 'React Native', icon: 'SiReact', color: '#007F9D' },
      { name: 'Kotlin', icon: 'SiKotlin', color: '#7F52FF' },
      { name: 'Swift', icon: 'SiSwift', color: '#CE442F' },
      { name: 'Java', icon: 'FaJava', color: '#C25202' },
      { name: 'Ionic', icon: 'SiIonic', color: '#3070E0' },
    ],
  },
  {
    category: 'DevOps',
    items: [
      { name: 'Firebase', icon: 'SiFirebase', color: '#E41E00' },
      { name: 'GitLab CI/CD', icon: 'SiGitlab', color: '#C1521B' },
      { name: 'GitHub CI/CD', icon: 'SiGithub', color: '#181717' },
      { name: 'Docker', icon: 'SiDocker', color: '#1B78BF' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'TypeScript', icon: 'SiTypescript', color: '#3178C6' },
      { name: 'Vue.js', icon: 'SiVuedotjs', color: '#3FB27F' },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', color: '#0F7490' },
    ],
  },
  {
    category: 'Soft Skills',
    items: [
      { name: 'Leadership', icon: 'Users', color: '#8357E9' },
      { name: 'Problem Solving', icon: 'Brain', color: '#08855B' },
      { name: 'Communication', icon: 'MessageCircle', color: '#6063EB' },
    ],
  },
];

const about = {
  name: 'Tiago Danin',
  greeting: 'Hi I am',
  roles: ['Mobile Developer', 'Bug Hunter'],
  avatar: 'https://avatars.githubusercontent.com/u/5731176?v=4',
  bio: 'I build mobile apps, maintain open source, and report security bugs. Native (Java, Kotlin, Swift) and cross-platform (React Native, Flutter).',
  bioExtra: 'Runner, dancer and music listener outside of work.',
  seoDescription: 'Mobile and full stack developer, bug hunter',
  cvUrl: 'https://linkedin.com/in/tiagodanin',
  email: 'TiagoDanin@outlook.com',
};

/**
 * "Experience and skills", rendered on both the home page and `/about`.
 *
 * Two cards side by side: a clipped, expandable timeline of jobs and
 * volunteering on the left, and the technical skill badges on the right.
 */
const meta = {
  title: 'Sections/Work',
  component: Work,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Experience and skills block, fed by four collections at once:',
          '`work`, `volunteer`, `skills` and the `about` singleton.',
          '',
          'Only one field of `about` is read: `cvUrl`, behind the "Open CV"',
          'button. The whole singleton is passed because the page already has it.',
          '',
          'The experience column is clipped to 660px until "Show more" is',
          'pressed, and there is no way back: the button unmounts once expanded.',
          'Each entry inside it is independently expandable, and reveals its',
          'description on click or on Enter/Space.',
          '',
          'Skill badges resolve their icon by name through a hardcoded map of 29',
          'react-icons and lucide components. A name outside that map renders',
          'nothing at all, silently: no badge, no fallback, no warning. Adding a',
          'skill with a new icon means editing `iconMap` in the component.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    work: {
      control: 'object',
      description:
        'Jobs, newest first. Dates are free text: `2022` renders inside a `<time>` element, `Present` renders as plain text.',
    },
    volunteer: {
      control: 'object',
      description:
        'Community and open source roles, listed under the jobs. `category` is carried by the collection but not rendered here.',
    },
    skills: {
      control: 'object',
      description:
        'Skill groups. Each item needs an `icon` name present in the component `iconMap`, and a brand `color` used as the badge background.',
    },
    about: {
      control: 'object',
      description: 'The `about` singleton. Only `cvUrl` is read, for the "Open CV" button.',
    },
  },
  args: { work, volunteer, skills, about },
} satisfies Meta<typeof Work>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The production shape: four jobs, three volunteer roles, four skill groups. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const cv = canvas.getByRole('link', { name: /open cv/i });
    await expect(cv).toHaveAttribute('href', 'https://linkedin.com/in/tiagodanin');

    await expect(canvas.getByRole('heading', { name: /professional experience/i })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: /technical skills/i })).toBeVisible();
  },
};

/**
 * "Show more" lifts the 660px clip on the experience column. It is a one way
 * door: the button removes itself, leaving only "Open CV" underneath.
 */
export const Expanded: Story = {
  play: async ({ canvas }) => {
    const showMore = canvas.getByRole('button', { name: /show more/i });
    await userEvent.click(showMore);

    await expect(showMore).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /open cv/i })).toBeVisible();
  },
};

/**
 * Each job is a button that expands to its description. The list is a `<ol>` of
 * `role="button"` items with `aria-expanded`, so keyboard users get the same
 * affordance as pointer users.
 */
export const ExperienceEntryExpanded: Story = {
  play: async ({ canvas }) => {
    const hackerOne = canvas.getByRole('button', { name: /hackerone/i });
    await expect(hackerOne).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(hackerOne);

    await expect(hackerOne).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByText(/coordinated disclosure/i)).toBeVisible();
  },
};

/**
 * A single job and no volunteering. The "Volunteering" heading still renders
 * over an empty list, and the experience column is far shorter than the 660px
 * clip, so "Show more" reveals nothing. Both are worth seeing before trimming
 * the collections.
 */
export const MinimalExperience: Story = {
  args: { work: work.slice(0, 1), volunteer: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: /volunteering/i })).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: /idopter labs/i })).toHaveLength(1);
  },
};

/**
 * An icon name the component does not know about. `Astro` is not in `iconMap`,
 * so its badge disappears entirely while its neighbours render normally. This is
 * the failure mode to check first when a skill "does not show up".
 */
export const UnknownSkillIcon: Story = {
  args: {
    skills: [
      {
        category: 'Frontend',
        items: [
          { name: 'TypeScript', icon: 'SiTypescript', color: '#3178C6' },
          { name: 'Astro', icon: 'SiAstro', color: '#BC52EE' },
          { name: 'Tailwind CSS', icon: 'SiTailwindcss', color: '#0F7490' },
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('TypeScript')).toBeVisible();
    await expect(canvas.getByText('Tailwind CSS')).toBeVisible();
    await expect(canvas.queryByText('Astro')).not.toBeInTheDocument();
  },
};

/**
 * No skills in the collection. The card keeps its heading and collapses to an
 * empty column next to a full experience list, which is the visual imbalance to
 * avoid.
 */
export const WithoutSkills: Story = {
  args: { skills: [] },
};

/**
 * A description long enough to prove that expanding an entry pushes everything
 * below it down rather than scrolling inside the card. Roles and company names
 * are not truncated either.
 */
export const LongContent: Story = {
  args: {
    work: [
      {
        company: 'Idopter Labs',
        role: 'Senior Mobile Developer and React Native Platform Maintainer',
        startDate: '2022',
        endDate: 'Present',
        logo: '/business/idopterlabs.webp',
        description:
          'Development of hybrid solutions in React Native and Flutter, system architecture, project documentation and test authoring, with occasional backend work in Elixir with Phoenix and frontend work in Vue. Responsibilities include submitting apps to Google Play and the App Store, writing and integrating native libraries in Swift, Objective-C, Java and Kotlin for React Native apps, managing AppCenter, Firebase and OneSignal, integrating REST APIs, defining the architecture of new React Native projects, and growing the automated test suite in Jest until the pipeline could be trusted to block a release.',
      },
      ...work.slice(1),
    ],
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /senior mobile developer and react native/i })
    );
    await expect(await canvas.findByText(/until the pipeline could be trusted/i)).toBeVisible();
  },
};

/**
 * Below `md` the two cards stack, experience first. The clip and its fade matter
 * most here, since the column would otherwise fill several screens before the
 * skills card is reachable.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
