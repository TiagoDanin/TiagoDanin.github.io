import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  BookOpen,
  Github,
  Mic,
  Newspaper,
  Package,
  Search,
  Clock,
} from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar';

/**
 * The largest file in the kit: a provider, a shell, and roughly twenty parts
 * for the menu inside it. Nothing on the site uses any of them.
 */
const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'This site navigates from a top bar, so the sidebar is documented here',
          'as the app-shell option rather than as something in production.',
          '',
          'Four things decide whether it works at all:',
          '',
          '1. **`SidebarProvider` is mandatory.** Every part calls `useSidebar`,',
          '   which throws outside the provider. It is applied as a decorator on',
          '   every story below.',
          '2. **It writes a cookie.** Toggling sets `sidebar:state` for a week,',
          '   so the open state survives a reload. In a story that means one',
          '   story can leave a cookie behind for the next; pass `open` and',
          '   `onOpenChange` to control it explicitly when that matters.',
          '3. **It has a desktop and a mobile rendering.** Below 768px of window',
          '   width the sidebar becomes a `Sheet` in a portal, driven by a',
          '   separate `openMobile` state that the desktop toggle does not',
          '   touch. Narrow the browser to see the other half of the component.',
          '4. **`collapsible` changes what collapsing means.** `offcanvas`',
          '   slides the whole panel out, `icon` shrinks it to a rail of icons,',
          '   and `none` renders a fixed panel with no toggle at all.',
          '',
          'The provider also binds Ctrl+B and Cmd+B globally, on `window`, for as',
          'long as it is mounted.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Which edge the panel is docked to.',
      table: { defaultValue: { summary: 'left' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['sidebar', 'floating', 'inset'],
      description:
        '`sidebar` is flush against the edge, `floating` is a rounded card with a border, `inset` pulls the main area in beside it.',
      table: { defaultValue: { summary: 'sidebar' } },
    },
    collapsible: {
      control: 'inline-radio',
      options: ['offcanvas', 'icon', 'none'],
      description:
        'How the panel collapses. `none` removes the collapse behaviour entirely, along with the toggle.',
      table: { defaultValue: { summary: 'offcanvas' } },
    },
  },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
  },
  decorators: [
    (Story) => (
      // Every part reads from this context; without it useSidebar throws.
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = [
  { title: 'Blog', icon: Newspaper, badge: '41' },
  { title: 'Talks', icon: Mic, badge: '12' },
  { title: 'Timeline', icon: Clock, badge: null },
  { title: 'Press', icon: BookOpen, badge: '7' },
];

function NavigationTree() {
  return (
    <>
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">tiagodanin.com</div>
        <SidebarInput placeholder="Search content" aria-label="Search content" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section, index) => (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton
                    isActive={index === 0}
                    tooltip={section.title}
                  >
                    <section.icon />
                    <span>{section.title}</span>
                  </SidebarMenuButton>
                  {section.badge ? (
                    <SidebarMenuBadge>{section.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="GitHub">
                  <Github />
                  <span>GitHub</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">
                      telegram-bot-api
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#">
                      cam-covers
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="npm">
                  <Package />
                  <span>npm</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground">
          250+ repositories indexed
        </div>
      </SidebarFooter>
    </>
  );
}

function MainArea({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarInset>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <span className="text-sm font-medium">Blog</span>
      </header>
      <div className="p-6 text-sm text-muted-foreground">
        {children ?? 'Forty one posts across two languages.'}
      </div>
    </SidebarInset>
  );
}

/**
 * The default shell: an off-canvas panel plus a main area with the toggle in
 * its header. The panel is `hidden md:block`, so at a narrow window width the
 * mobile sheet takes over instead.
 */
export const Default: Story = {
  args: {
    children: <NavigationTree />,
  },
  render: (args) => (
    <>
      <Sidebar {...args} />
      <MainArea />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The trigger is icon only, so its whole accessible name comes from the
    // sr-only span inside it. Losing that span leaves an unnamed button.
    await expect(
      canvas.getByRole('button', { name: 'Toggle Sidebar' })
    ).toBeVisible();
  },
};

type ControlledShellProps = {
  onOpenChange: (open: boolean) => void;
};

/**
 * Controlled shell used by the interaction story. Owning the open state here
 * keeps the assertion off the cookie the provider writes, which would otherwise
 * carry over between runs.
 */
function ControlledShell({ onOpenChange }: ControlledShellProps) {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange(next);
      }}
    >
      <Sidebar collapsible="icon">
        <NavigationTree />
      </Sidebar>
      <MainArea />
    </SidebarProvider>
  );
}

/**
 * Collapsing and expanding from the header trigger. The assertion is on the
 * `onOpenChange` callback, since collapsing is a state change rather than an
 * unmount: the menu labels stay in the DOM and are only shrunk out of sight.
 *
 * Note this story is inside two providers, the decorator's and its own. Only
 * the inner one is read by the parts below it.
 */
export const CollapsesToIcons: Story = {
  args: { children: <NavigationTree /> },
  parameters: {
    docs: {
      description: {
        story:
          'Clicks the trigger twice and asserts the controlled open state went false and then true again.',
      },
    },
  },
  render: () => <ControlledShell onOpenChange={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' });

    await userEvent.click(trigger);
    // The panel carries its state on a data attribute, which is the component's
    // own public signal and what its Tailwind variants key off.
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-collapsible="icon"]')
      ).toBeInTheDocument()
    );

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-collapsible="icon"]')
      ).not.toBeInTheDocument()
    );
  },
};

/**
 * `collapsible="none"` renders a fixed panel with no toggle, for a layout where
 * the navigation is never in the way. Note the trigger in the header still
 * mounts and still fires, it just has nothing to hide.
 */
export const AlwaysExpanded: Story = {
  args: {
    collapsible: 'none',
    children: <NavigationTree />,
  },
  render: (args) => (
    <>
      <Sidebar {...args} />
      <MainArea />
    </>
  ),
};

/**
 * The `floating` variant, docked to the right. Both are one prop each, and the
 * inner panel picks up its rounded border from a `data-variant` selector rather
 * than from a class you pass.
 */
export const FloatingOnTheRight: Story = {
  args: {
    side: 'right',
    variant: 'floating',
    children: <NavigationTree />,
  },
  render: (args) => (
    <>
      <MainArea />
      <Sidebar {...args} />
    </>
  ),
};

/**
 * Loading state. `SidebarMenuSkeleton` picks a random width between 50 and 90
 * percent per item, so a column of them looks like text rather than like a row
 * of identical bars. That randomness also means this story is not a stable
 * visual regression target.
 */
export const LoadingMenu: Story = {
  args: {
    children: (
      <>
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">tiagodanin.com</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </>
    ),
  },
  render: (args) => (
    <>
      <Sidebar {...args} />
      <MainArea>Loading collections.</MainArea>
    </>
  ),
};

/**
 * An empty menu. Without a message the panel reads as broken, so an empty
 * collection needs copy of its own rather than an absent list.
 */
export const EmptyMenu: Story = {
  args: {
    children: (
      <>
        <SidebarHeader>
          <SidebarInput
            placeholder="Search content"
            aria-label="Search content"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Results</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
                <Search className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nothing matched that search.
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </>
    ),
  },
  render: (args) => (
    <>
      <Sidebar {...args} />
      <MainArea>No results.</MainArea>
    </>
  ),
};
