import {
  Sparkles, Workflow, Boxes, Compass, HelpCircle, Layers, Blend, CircleSlash,
  AppWindow, FolderTree, LayoutGrid, BarChart3, Bot, GitBranch, ShoppingBag,
  Feather, Gauge, Network, ThumbsUp, Code2, Fingerprint, Rocket, PencilRuler,
  BookOpen, Users, ArrowRight, ArrowLeft, Check, Calendar, Mail, ExternalLink,
  Globe, Lock, LogOut, Sparkle, Lightbulb, Wand2, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Sparkles, Workflow, Boxes, Compass, HelpCircle, Layers, Blend, CircleSlash,
  AppWindow, FolderTree, LayoutGrid, BarChart3, Bot, GitBranch, ShoppingBag,
  Feather, Gauge, Network, ThumbsUp, Code2, Fingerprint, Rocket, PencilRuler,
  BookOpen, Users, ArrowRight, ArrowLeft, Check, Calendar, Mail, ExternalLink,
  Globe, Lock, LogOut, Sparkle, Lightbulb, Wand2,
};

/** Resolve a config icon name to a lucide icon (falls back to Sparkles). */
export function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = (name && MAP[name]) || Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
