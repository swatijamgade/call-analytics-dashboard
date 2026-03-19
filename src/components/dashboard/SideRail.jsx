import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClock,
  ChartNoAxesCombined,
  CircleHelp,
  FileText,
  HelpCircle,
  ListTodo,
  LogOut,
  Mail,
  MessageCircle,
  PhoneCall,
  SearchCheck,
  Settings,
  TrendingUp,
} from "lucide-react";

const MENU_SECTIONS = [
  {
    title: "Menu",
    items: [
      { label: "Dashboard", href: "#dashboard", icon: ChartNoAxesCombined, active: true },
      { label: "Customer", href: "#customer", icon: SearchCheck },
      { label: "Calls", href: "#calls", icon: PhoneCall },
      { label: "Analytics", href: "#analytics", icon: TrendingUp },
      { label: "Reports", href: "#reports", icon: FileText },
      { label: "Email", href: "#email", icon: Mail, badge: "3" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Settings", href: "#settings", icon: Settings },
      { label: "Feedback", href: "#feedback", icon: MessageCircle },
      { label: "Help", href: "#help", icon: CircleHelp },
      { label: "Logout", href: "#logout", icon: LogOut },
    ],
  },
];

function MenuItem({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <Button
      asChild
      variant="ghost"
      className={
        active
          ? "h-9 w-full justify-start bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/90 hover:text-white"
          : "h-9 w-full justify-start text-foreground hover:bg-muted/80"
      }
    >
      <a
        href={item.href}
        onClick={(event) => onClick?.(item, event)}
        aria-current={active ? "page" : undefined}
      >
        <Icon className="size-4" />
        <span>{item.label}</span>
        {item.badge ? (
          <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
            {item.badge}
          </span>
        ) : null}
      </a>
    </Button>
  );
}

export default function SideRail({
  activeItem = "Dashboard",
  onSelectItem,
  onAddTask,
  onHelp,
  taskCount = 0,
}) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-4">
      <Card className="border-border/70 bg-card/90 shadow-[0_14px_34px_rgba(1,8,26,0.42)] backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <span className="grid size-8 place-content-center rounded-lg bg-primary text-sm font-semibold text-white">
              CDR
            </span>
            CDR Market
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {MENU_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <MenuItem
                    key={item.label}
                    item={item}
                    active={activeItem === item.label}
                    onClick={onSelectItem}
                  />
                ))}
              </div>
            </section>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90 shadow-[0_14px_34px_rgba(1,8,26,0.42)] backdrop-blur">
        <CardContent className="space-y-3 pt-5">
          <div className="inline-flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <ListTodo className="size-5" />
          </div>
          <p className="text-base font-semibold text-foreground">Task Manager</p>
          <p className="text-xs text-muted-foreground/80">
            {taskCount > 0
              ? `${taskCount} pending task${taskCount > 1 ? "s" : ""}.`
              : "Add quick dashboard tasks and reminders."}
          </p>
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={onAddTask}
          >
            <CalendarClock className="size-4" />
            Add Task
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted/80"
            onClick={onHelp}
          >
            <HelpCircle className="size-4" />
            Help
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
